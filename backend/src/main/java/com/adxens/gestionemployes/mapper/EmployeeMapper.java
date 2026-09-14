package com.adxens.gestionemployes.mapper;

import com.adxens.gestionemployes.dto.EmployeeRequest;
import com.adxens.gestionemployes.dto.EmployeeResponse;
import com.adxens.gestionemployes.entity.Employee;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public Employee toEntity(EmployeeRequest request) {
        return new Employee(
                request.firstName(),
                request.lastName(),
                request.position(),
                request.department(),
                request.hireDate(),
                request.status()
        );
    }

    public EmployeeResponse toResponse(Employee employee) {
        return new EmployeeResponse(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getPosition(),
                employee.getDepartment(),
                employee.getHireDate(),
                employee.getStatus(),
                employee.getCreatedAt(),
                employee.getUpdatedAt()
        );
    }
}
