package com.adxens.gestionemployes.service;

import com.adxens.gestionemployes.entity.Employee;
import com.adxens.gestionemployes.entity.EmployeeStatus;
import com.adxens.gestionemployes.exception.BadRequestException;
import com.adxens.gestionemployes.exception.EmployeeNotFoundException;
import com.adxens.gestionemployes.repository.EmployeeRepository;
import com.adxens.gestionemployes.repository.EmployeeSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Page<Employee> list(String department, EmployeeStatus status, String search, Pageable pageable) {
        Specification<Employee> spec = Specification.allOf(
                EmployeeSpecifications.hasDepartment(department),
                EmployeeSpecifications.hasStatus(status),
                EmployeeSpecifications.matchesSearch(search)
        );
        return employeeRepository.findAll(spec, pageable);
    }

    public Employee get(Integer id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));
    }

    public List<String> listDepartments() {
        return employeeRepository.findDistinctDepartments();
    }

    @Transactional
    public Employee create(Employee employee) {
        validateBusinessRules(employee);
        return employeeRepository.save(employee);
    }

    @Transactional
    public Employee update(Integer id, Employee changes) {
        Employee existing = get(id);
        validateBusinessRules(changes);
        existing.setFirstName(changes.getFirstName());
        existing.setLastName(changes.getLastName());
        existing.setPosition(changes.getPosition());
        existing.setDepartment(changes.getDepartment());
        existing.setHireDate(changes.getHireDate());
        existing.setStatus(changes.getStatus());
        return employeeRepository.save(existing);
    }

    @Transactional
    public void delete(Integer id) {
        employeeRepository.delete(get(id));
    }

    private void validateBusinessRules(Employee employee) {
        if (employee.getHireDate().isAfter(LocalDate.now())) {
            throw new BadRequestException("La date d'embauche ne peut pas etre dans le futur");
        }
    }
}
