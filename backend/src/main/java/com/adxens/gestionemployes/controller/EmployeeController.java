package com.adxens.gestionemployes.controller;

import com.adxens.gestionemployes.dto.EmployeeRequest;
import com.adxens.gestionemployes.dto.EmployeeResponse;
import com.adxens.gestionemployes.dto.PageResponse;
import com.adxens.gestionemployes.entity.Employee;
import com.adxens.gestionemployes.entity.EmployeeStatus;
import com.adxens.gestionemployes.exception.BadRequestException;
import com.adxens.gestionemployes.mapper.EmployeeMapper;
import com.adxens.gestionemployes.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    // Liste blanche des champs triables : evite qu'un nom de propriete
    // inconnu remonte comme PropertyReferenceException (500) au lieu d'un 400
    // explicite.
    private static final Set<String> SORTABLE_FIELDS = Set.of(
            "id", "firstName", "lastName", "position", "department", "hireDate", "status",
            "createdAt", "updatedAt"
    );

    private final EmployeeService employeeService;
    private final EmployeeMapper employeeMapper;

    public EmployeeController(EmployeeService employeeService, EmployeeMapper employeeMapper) {
        this.employeeService = employeeService;
        this.employeeMapper = employeeMapper;
    }

    @GetMapping
    public PageResponse<EmployeeResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastName,asc") String sort,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) EmployeeStatus status,
            @RequestParam(required = false) String search
    ) {
        Pageable pageable = PageRequest.of(page, size, parseSort(sort));
        Page<EmployeeResponse> result = employeeService.list(department, status, search, pageable)
                .map(employeeMapper::toResponse);
        return PageResponse.from(result);
    }

    @GetMapping("/{id}")
    public EmployeeResponse get(@PathVariable Integer id) {
        return employeeMapper.toResponse(employeeService.get(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponse create(@Valid @RequestBody EmployeeRequest request) {
        Employee created = employeeService.create(employeeMapper.toEntity(request));
        return employeeMapper.toResponse(created);
    }

    @PutMapping("/{id}")
    public EmployeeResponse update(@PathVariable Integer id, @Valid @RequestBody EmployeeRequest request) {
        Employee updated = employeeService.update(id, employeeMapper.toEntity(request));
        return employeeMapper.toResponse(updated);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        employeeService.delete(id);
    }

    private Sort parseSort(String sort) {
        String[] parts = sort.split(",", 2);
        String field = parts[0].trim();
        if (!SORTABLE_FIELDS.contains(field)) {
            throw new BadRequestException("Champ de tri invalide : '" + field
                    + "'. Valeurs acceptees : " + String.join(", ", SORTABLE_FIELDS));
        }
        Sort.Direction direction = parts.length > 1 && "desc".equalsIgnoreCase(parts[1].trim())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        return Sort.by(direction, field);
    }
}
