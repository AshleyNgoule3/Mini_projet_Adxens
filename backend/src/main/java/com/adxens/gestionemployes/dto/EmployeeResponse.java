package com.adxens.gestionemployes.dto;

import com.adxens.gestionemployes.entity.EmployeeStatus;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record EmployeeResponse(
        Integer id,
        String firstName,
        String lastName,
        String position,
        String department,
        LocalDate hireDate,
        EmployeeStatus status,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}
