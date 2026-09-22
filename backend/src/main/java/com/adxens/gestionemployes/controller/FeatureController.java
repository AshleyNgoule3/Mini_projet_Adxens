package com.adxens.gestionemployes.controller;

import com.adxens.gestionemployes.service.FeatureService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Expose au frontend l'etat des flags qui le concernent.
 *
 * Le frontend n'interroge jamais Unleash directement : le jeton d'API reste
 * ainsi cote serveur, et un seul composant de l'application connait l'adresse
 * d'Unleash.
 */
@RestController
@RequestMapping("/api/features")
public class FeatureController {

    private final FeatureService featureService;

    public FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @GetMapping
    public Map<String, Boolean> list() {
        return Map.of(
                "ecritureActivee", featureService.isEnabled(FeatureService.ACTIONS_ECRITURE)
        );
    }
}
