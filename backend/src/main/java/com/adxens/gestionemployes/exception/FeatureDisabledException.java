package com.adxens.gestionemployes.exception;

/**
 * Erreur 403 : l'action demandee existe, mais elle est desactivee par un
 * feature flag.
 *
 * A distinguer d'un 404 (la ressource n'existe pas) et d'un 400 (la requete
 * est malformee) : ici la requete est valide, c'est la fonctionnalite qui est
 * fermee.
 */
public class FeatureDisabledException extends RuntimeException {

    public FeatureDisabledException(String message) {
        super(message);
    }
}
