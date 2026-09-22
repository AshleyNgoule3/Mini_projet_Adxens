package com.adxens.gestionemployes.controller;

import com.adxens.gestionemployes.dto.EmployeeRequest;
import com.adxens.gestionemployes.entity.Employee;
import com.adxens.gestionemployes.entity.EmployeeStatus;
import com.adxens.gestionemployes.exception.EmployeeNotFoundException;
import com.adxens.gestionemployes.mapper.EmployeeMapper;
import com.adxens.gestionemployes.service.EmployeeService;
import com.adxens.gestionemployes.service.FeatureService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.nullable;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EmployeeController.class)
@Import(EmployeeMapper.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmployeeService employeeService;

    // EmployeeController depend de FeatureService depuis l'introduction du
    // feature flag. @WebMvcTest ne charge que la couche web : sans ce mock,
    // le contexte Spring ne demarre pas et TOUS les tests echouent.
    @MockBean
    private FeatureService featureService;

    @BeforeEach
    void activerLesActionsDEcriture() {
        // Par defaut Mockito rend false, ce qui ferait repondre 403 aux tests
        // de suppression. On ouvre donc le flag pour les cas nominaux ; le cas
        // ferme est couvert par son propre test plus bas.
        when(featureService.isEnabled(FeatureService.ACTIONS_ECRITURE)).thenReturn(true);
    }

    private Employee sampleEmployee() {
        return new Employee("Marie", "Dubois", "Developpeuse", "IT",
                LocalDate.of(2021, 3, 15), EmployeeStatus.active);
    }

    @Test
    void list_nominal_returnsPagedEmployees() throws Exception {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Employee> page = new PageImpl<>(List.of(sampleEmployee()), pageable, 1);
        when(employeeService.list(nullable(String.class), nullable(EmployeeStatus.class),
                nullable(String.class), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", org.hamcrest.Matchers.hasSize(1)))
                .andExpect(jsonPath("$.content[0].firstName").value("Marie"))
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.page").value(0));
    }

    @Test
    void get_missingId_returns404WithApiErrorBody() throws Exception {
        when(employeeService.get(42)).thenThrow(new EmployeeNotFoundException(42));

        mockMvc.perform(get("/api/employees/42"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Employe introuvable avec l'identifiant 42"))
                .andExpect(jsonPath("$.path").value("/api/employees/42"));
    }

    @Test
    void create_invalidBody_returns400WithFieldErrors() throws Exception {
        EmployeeRequest invalid = new EmployeeRequest("", "", "", "", null, null);

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors").isArray())
                .andExpect(jsonPath("$.errors[?(@.field == 'firstName')]").exists());
    }

    @Test
    void create_valid_returns201() throws Exception {
        EmployeeRequest request = new EmployeeRequest("Marie", "Dubois", "Developpeuse", "IT",
                LocalDate.of(2021, 3, 15), EmployeeStatus.active);
        when(employeeService.create(any(Employee.class))).thenReturn(sampleEmployee());

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName").value("Marie"))
                .andExpect(jsonPath("$.status").value("active"));
    }

    @Test
    void delete_existing_returns204() throws Exception {
        mockMvc.perform(delete("/api/employees/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_flagFerme_returns403() throws Exception {
        when(featureService.isEnabled(FeatureService.ACTIONS_ECRITURE)).thenReturn(false);

        mockMvc.perform(delete("/api/employees/1"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    void list_invalidSortField_returns400() throws Exception {
        mockMvc.perform(get("/api/employees").param("sort", "unknownField,asc"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}
