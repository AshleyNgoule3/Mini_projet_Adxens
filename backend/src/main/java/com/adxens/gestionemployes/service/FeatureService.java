package com.adxens.gestionemployes.service;

import io.getunleash.Unleash;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Point d'acces unique aux feature flags.
 *
 * Centraliser les noms ici evite qu'ils se dispersent dans le code : le jour
 * ou un flag est retire, un seul endroit est a nettoyer. C'est la principale
 * parade au reproche fait aux feature flags, l'accumulation de branches
 * mortes dans le code.
 */
@Service
public class FeatureService {

    /** Affiche et autorise les actions Modifier et Supprimer. */
    public static final String ACTIONS_ECRITURE = "employes-actions-ecriture";

    /**
     * null lorsque unleash.enabled vaut false : le bean n'est alors pas cree
     * du tout (voir UnleashConfiguration).
     *
     * ObjectProvider est le mecanisme Spring pour une dependance facultative
     * en injection par constructeur : getIfAvailable() rend null plutot que
     * de faire echouer le demarrage quand le bean est absent.
     */
    private final Unleash unleash;

    private final boolean defaultEnabled;

    public FeatureService(ObjectProvider<Unleash> unleashProvider,
                          @Value("${app.features.default-enabled}") boolean defaultEnabled) {
        this.unleash = unleashProvider.getIfAvailable();
        this.defaultEnabled = defaultEnabled;
    }

    public boolean isEnabled(String flag) {
        if (unleash == null) {
            return defaultEnabled;
        }
        // Le second argument est la valeur de repli : flag inconnu d'Unleash,
        // ou premier chargement pas encore abouti.
        return unleash.isEnabled(flag, defaultEnabled);
    }
}
