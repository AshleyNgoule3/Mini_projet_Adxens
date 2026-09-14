package com.adxens.gestionemployes.exception;

/**
 * Erreur 400 generique : violation d'une regle metier (service) ou parametre
 * de requete invalide (controller), par opposition aux erreurs 400 de
 * validation de payload (MethodArgumentNotValidException), traitees a part
 * par GlobalExceptionHandler pour produire la liste champ par champ.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
