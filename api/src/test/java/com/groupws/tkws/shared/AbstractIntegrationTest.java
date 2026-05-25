package com.groupws.tkws.shared;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * Base para integration tests que sobem Spring Context completo + Postgres.
 *
 * **Dois modos** suportados (selecionados por env var):
 *
 * 1. **Testcontainers** (default · usado em CI): sobe um Postgres efêmero
 *    via Docker. Container é compartilhado entre testes (`withReuse`).
 *
 * 2. **Local** (workaround para Docker Desktop com socket bugado · setar a
 *    env var `TKWS_TEST_DB_URL`): aponta os ITs para uma instância Postgres
 *    já em pé (ex.: o `tkws-postgres` do docker-compose, banco `tkws_test`).
 *    Useful quando Docker Desktop 29.x retorna 400 no /info endpoint e
 *    Testcontainers não inicia (ver docs/02-TESTING.md § Troubleshooting).
 *
 *    Exemplo:
 *    ```
 *    docker exec tkws-postgres psql -U tkws -c "CREATE DATABASE tkws_test;"
 *    TKWS_TEST_DB_URL=jdbc:postgresql://localhost:5432/tkws_test \
 *    TKWS_TEST_DB_USER=tkws TKWS_TEST_DB_PASS=tkws \
 *    mvn verify
 *    ```
 *
 * Convenção: arquivos com sufixo *IT.java rodam via maven-failsafe-plugin
 * (mvn verify). Arquivos *Test.java são unit tests rápidos (mvn test).
 */
@SpringBootTest
@ActiveProfiles("test")
@Import(MockJwtConfig.class)
public abstract class AbstractIntegrationTest {

    private static final String LOCAL_DB_URL_ENV = "TKWS_TEST_DB_URL";

    private static final PostgreSQLContainer<?> POSTGRES;

    static {
        if (System.getenv(LOCAL_DB_URL_ENV) == null) {
            // Modo Testcontainers
            POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
                .withDatabaseName("tkws_test")
                .withUsername("test")
                .withPassword("test")
                .withReuse(true);
            POSTGRES.start();
        } else {
            POSTGRES = null;
        }
    }

    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        String localUrl = System.getenv(LOCAL_DB_URL_ENV);
        if (localUrl != null) {
            registry.add("spring.datasource.url", () -> localUrl);
            registry.add("spring.datasource.username",
                () -> System.getenv().getOrDefault("TKWS_TEST_DB_USER", "tkws"));
            registry.add("spring.datasource.password",
                () -> System.getenv().getOrDefault("TKWS_TEST_DB_PASS", "tkws"));
            // Para evitar lixo entre rodadas de testes locais, limpa o schema
            // antes de aplicar migrations · só seguro porque é DB dedicado tkws_test.
            registry.add("spring.flyway.clean-disabled", () -> "false");
            registry.add("spring.flyway.clean-on-validation-error", () -> "true");
        } else {
            registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
            registry.add("spring.datasource.username", POSTGRES::getUsername);
            registry.add("spring.datasource.password", POSTGRES::getPassword);
        }

        // Mock issuer pra não bater no Zitadel real nos testes
        registry.add("spring.security.oauth2.resourceserver.jwt.issuer-uri",
            () -> "http://localhost:9999/mock-zitadel");

        // Desabilita JWK lookup em testes
        registry.add("spring.security.oauth2.resourceserver.jwt.jwk-set-uri",
            () -> "http://localhost:9999/mock-zitadel/.well-known/jwks.json");
    }
}
