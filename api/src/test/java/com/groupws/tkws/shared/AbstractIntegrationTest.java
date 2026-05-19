package com.groupws.tkws.shared;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Base para integration tests que sobem Spring Context completo + Postgres real via Testcontainers.
 * Container é compartilhado entre testes (otimização: sobe uma vez).
 *
 * Convenção: arquivos com sufixo *IT.java rodam via maven-failsafe-plugin (mvn verify).
 * Arquivos *Test.java são unit tests rápidos (mvn test).
 */
@SpringBootTest
@ActiveProfiles("test")
@Testcontainers
public abstract class AbstractIntegrationTest {

    @Container
    @SuppressWarnings("resource")
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
        .withDatabaseName("tkws_test")
        .withUsername("test")
        .withPassword("test")
        .withReuse(true);

    static {
        POSTGRES.start();
    }

    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);

        // Mock issuer pra não bater no Zitadel real nos testes
        registry.add("spring.security.oauth2.resourceserver.jwt.issuer-uri",
            () -> "http://localhost:9999/mock-zitadel");

        // Desabilita JWK lookup em testes
        registry.add("spring.security.oauth2.resourceserver.jwt.jwk-set-uri",
            () -> "http://localhost:9999/mock-zitadel/.well-known/jwks.json");
    }
}
