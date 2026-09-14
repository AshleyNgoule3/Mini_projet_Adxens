package com.adxens.gestionemployes.exception;

public class EmployeeNotFoundException extends RuntimeException {

    public EmployeeNotFoundException(Integer id) {
        super("Employe introuvable avec l'identifiant " + id);
    }
}
