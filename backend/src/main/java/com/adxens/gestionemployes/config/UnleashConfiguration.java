package com.adxens.gestionemployes.config;

import io.getunleash.DefaultUnleash;
import io.getunleash.Unleash;
import io.getunleash.util.UnleashConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cree le client Unleash uniquement si unleash.enabled vaut true.
 *
 * En son absence, FeatureService retombe sur app.features.default-enabled :
 * l'application demarre et fonctionne sans serveur Unleash. C'est une regle
 * essentielle des feature flags, le service de flags ne devant jamais devenir
 * un point de defaillance.
 */
@Configuration
@ConditionalOnProperty(name = "unleash.enabled", havingValue = "true")
public class UnleashConfiguration {

    @Value("${unleash.api-url}")
    private String apiUrl;

    @Value("${unleash.api-token}")
    private String apiToken;

    @Value("${unleash.app-name}")
    private String appName;

    @Bean
    public Unleash unleash() {
        UnleashConfig config = UnleashConfig.builder()
                .appName(appName)
                // Identifie ce pod dans la page "Applications" d'Unleash.
                .instanceId(System.getenv().getOrDefault("HOSTNAME", "local"))
                .unleashAPI(apiUrl)
                .apiKey(apiToken)
                // Le SDK interroge Unleash toutes les 15 secondes en tache de
                // fond et garde les flags en memoire. Deux consequences :
                // basculer un flag prend effet sans redemarrer l'application,
                // et une panne d'Unleash laisse la derniere configuration
                // connue en place au lieu de tout bloquer.
                .fetchTogglesInterval(15)
                .build();
        return new DefaultUnleash(config);
    }
}
