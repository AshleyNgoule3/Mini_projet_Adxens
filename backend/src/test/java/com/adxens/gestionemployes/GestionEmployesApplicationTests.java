package com.adxens.gestionemployes;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// Aucune base PostgreSQL n'est disponible a ce stade (squelette uniquement) :
// on desactive l'auto-configuration datasource/JPA/Flyway pour ce test de contexte.
@SpringBootTest(properties = "spring.autoconfigure.exclude="
        + "org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,"
        + "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,"
        + "org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration")
class GestionEmployesApplicationTests {

    @Test
    void contextLoads() {
    }

}
