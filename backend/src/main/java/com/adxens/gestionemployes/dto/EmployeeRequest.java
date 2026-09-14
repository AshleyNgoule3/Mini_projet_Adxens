package com.adxens.gestionemployes.dto;

import com.adxens.gestionemployes.entity.EmployeeStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record EmployeeRequest(

        @NotBlank(message = "Le prenom est obligatoire")
        @Size(max = 100, message = "Le prenom ne doit pas depasser 100 caracteres")
        String firstName,

        @NotBlank(message = "Le nom de famille est obligatoire")
        @Size(max = 100, message = "Le nom de famille ne doit pas depasser 100 caracteres")
        String lastName,

        @NotBlank(message = "Le poste est obligatoire")
        @Size(max = 100, message = "Le poste ne doit pas depasser 100 caracteres")
        String position,

        @NotBlank(message = "Le departement est obligatoire")
        @Size(max = 100, message = "Le departement ne doit pas depasser 100 caracteres")
        String department,

        @NotNull(message = "La date d'embauche est obligatoire")
        LocalDate hireDate,

        @NotNull(message = "Le statut est obligatoire")
        EmployeeStatus status
) {
}
