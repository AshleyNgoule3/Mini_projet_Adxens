package com.adxens.gestionemployes.service;

import com.adxens.gestionemployes.entity.Employee;
import com.adxens.gestionemployes.entity.EmployeeStatus;
import com.adxens.gestionemployes.exception.BadRequestException;
import com.adxens.gestionemployes.exception.EmployeeNotFoundException;
import com.adxens.gestionemployes.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    private EmployeeService employeeService;

    private Employee sampleEmployee() {
        return new Employee("Marie", "Dubois", "Developpeuse", "IT",
                LocalDate.of(2021, 3, 15), EmployeeStatus.active);
    }

    @Test
    void get_existingId_returnsEmployee() {
        employeeService = new EmployeeService(employeeRepository);
        Employee employee = sampleEmployee();
        when(employeeRepository.findById(1)).thenReturn(Optional.of(employee));

        Employee result = employeeService.get(1);

        assertThat(result).isSameAs(employee);
    }

    @Test
    void get_missingId_throwsNotFound() {
        employeeService = new EmployeeService(employeeRepository);
        when(employeeRepository.findById(42)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.get(42))
                .isInstanceOf(EmployeeNotFoundException.class)
                .hasMessageContaining("42");
    }

    @Test
    void create_validEmployee_savesAndReturns() {
        employeeService = new EmployeeService(employeeRepository);
        Employee employee = sampleEmployee();
        when(employeeRepository.save(employee)).thenReturn(employee);

        Employee result = employeeService.create(employee);

        assertThat(result).isSameAs(employee);
        verify(employeeRepository).save(employee);
    }

    @Test
    void create_futureHireDate_throwsBadRequestAndNeverSaves() {
        employeeService = new EmployeeService(employeeRepository);
        Employee employee = new Employee("Marie", "Dubois", "Developpeuse", "IT",
                LocalDate.now().plusDays(1), EmployeeStatus.active);

        assertThatThrownBy(() -> employeeService.create(employee))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("futur");
        verify(employeeRepository, never()).save(any());
    }

    @Test
    void update_missingId_throwsNotFound() {
        employeeService = new EmployeeService(employeeRepository);
        when(employeeRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.update(99, sampleEmployee()))
                .isInstanceOf(EmployeeNotFoundException.class);
    }

    @Test
    void update_valid_updatesFieldsAndSaves() {
        employeeService = new EmployeeService(employeeRepository);
        Employee existing = sampleEmployee();
        when(employeeRepository.findById(1)).thenReturn(Optional.of(existing));
        when(employeeRepository.save(existing)).thenReturn(existing);

        Employee changes = new Employee("Marianne", "Dubois-Martin", "Lead Dev", "IT",
                LocalDate.of(2021, 3, 15), EmployeeStatus.inactive);

        Employee result = employeeService.update(1, changes);

        assertThat(result.getFirstName()).isEqualTo("Marianne");
        assertThat(result.getLastName()).isEqualTo("Dubois-Martin");
        assertThat(result.getPosition()).isEqualTo("Lead Dev");
        assertThat(result.getStatus()).isEqualTo(EmployeeStatus.inactive);
        verify(employeeRepository).save(existing);
    }

    @Test
    void delete_missingId_throwsNotFoundAndNeverDeletes() {
        employeeService = new EmployeeService(employeeRepository);
        when(employeeRepository.findById(7)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.delete(7))
                .isInstanceOf(EmployeeNotFoundException.class);
        verify(employeeRepository, never()).delete(any(Employee.class));
    }

    @Test
    void delete_existing_callsRepositoryDelete() {
        employeeService = new EmployeeService(employeeRepository);
        Employee employee = sampleEmployee();
        when(employeeRepository.findById(1)).thenReturn(Optional.of(employee));

        employeeService.delete(1);

        verify(employeeRepository, times(1)).delete(employee);
    }

    @Test
    void listDepartments_delegatesToRepository() {
        employeeService = new EmployeeService(employeeRepository);
        when(employeeRepository.findDistinctDepartments()).thenReturn(List.of("IT", "RH"));

        List<String> result = employeeService.listDepartments();

        assertThat(result).containsExactly("IT", "RH");
    }

    @Test
    void list_appliesSpecificationAndPageable() {
        employeeService = new EmployeeService(employeeRepository);
        Pageable pageable = PageRequest.of(0, 10);
        Page<Employee> page = new PageImpl<>(List.of(sampleEmployee()));
        when(employeeRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);

        Page<Employee> result = employeeService.list("IT", EmployeeStatus.active, "mar", pageable);

        assertThat(result.getContent()).hasSize(1);
        verify(employeeRepository).findAll(any(Specification.class), eq(pageable));
    }
}
