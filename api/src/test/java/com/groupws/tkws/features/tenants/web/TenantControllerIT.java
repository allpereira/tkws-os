package com.groupws.tkws.features.tenants.web;

import com.groupws.tkws.shared.AbstractIntegrationTest;
import com.groupws.tkws.shared.MockJwtConfig;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

/**
 * E2E test do TenantController: vai do HTTP até o banco real.
 * Cobre autorização (roles), validação, casos felizes e de erro.
 */
@org.springframework.boot.test.context.SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(MockJwtConfig.class)
@DisplayName("TenantController — E2E")
class TenantControllerIT extends AbstractIntegrationTest {

    @LocalServerPort int port;
    @Autowired JdbcTemplate jdbc;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        jdbc.execute("TRUNCATE tenants RESTART IDENTITY CASCADE");
    }

    @Test
    @DisplayName("POST /api/v1/tenants — deve criar tenant com system_admin")
    void deveCriarTenantComSystemAdmin() {
        given()
            .auth().oauth2(MockJwtConfig.tokenForSystemAdmin())
            .contentType(ContentType.JSON)
            .body(Map.of(
                "zitadelOrgId", "zitadel-org-1",
                "name", "Studio Test",
                "slug", "studio-test"
            ))
        .when()
            .post("/api/v1/tenants")
        .then()
            .statusCode(201)
            .header("Location", notNullValue())
            .body("id", notNullValue())
            .body("slug", equalTo("studio-test"))
            .body("name", equalTo("Studio Test"))
            .body("active", equalTo(true));
    }

    @Test
    @DisplayName("POST /api/v1/tenants — deve retornar 403 sem role system_admin")
    void deveNegarSemRoleAdmin() {
        given()
            .auth().oauth2(MockJwtConfig.tokenForArchitect())
            .contentType(ContentType.JSON)
            .body(Map.of(
                "zitadelOrgId", "zitadel-org-x",
                "name", "Negado",
                "slug", "negado"
            ))
        .when()
            .post("/api/v1/tenants")
        .then()
            .statusCode(403);
    }

    @Test
    @DisplayName("POST /api/v1/tenants — deve retornar 401 sem token")
    void deveNegarSemToken() {
        given()
            .contentType(ContentType.JSON)
            .body(Map.of("zitadelOrgId", "x", "name", "X", "slug", "x"))
        .when()
            .post("/api/v1/tenants")
        .then()
            .statusCode(401);
    }

    @Test
    @DisplayName("POST /api/v1/tenants — deve retornar 400 com campo obrigatório vazio")
    void deveRetornar400ComCampoVazio() {
        given()
            .auth().oauth2(MockJwtConfig.tokenForSystemAdmin())
            .contentType(ContentType.JSON)
            .body(Map.of(
                "zitadelOrgId", "",
                "name", "Nome",
                "slug", "slug-x"
            ))
        .when()
            .post("/api/v1/tenants")
        .then()
            .statusCode(400)
            .body("title", equalTo("VALIDATION_FAILED"));
    }

    @Test
    @DisplayName("POST /api/v1/tenants — deve retornar 422 com slug inválido (regra de domínio)")
    void deveRetornar422ComSlugInvalido() {
        given()
            .auth().oauth2(MockJwtConfig.tokenForSystemAdmin())
            .contentType(ContentType.JSON)
            .body(Map.of(
                "zitadelOrgId", "zitadel-org-y",
                "name", "Nome",
                "slug", "SLUG INVALIDO"
            ))
        .when()
            .post("/api/v1/tenants")
        .then()
            .statusCode(422)
            .body("title", equalTo("INVALID_TENANT_SLUG"));
    }

    @Test
    @DisplayName("POST /api/v1/tenants — deve retornar 422 quando slug duplicado")
    void deveRejeitarSlugDuplicado() {
        // Cria o primeiro
        given()
            .auth().oauth2(MockJwtConfig.tokenForSystemAdmin())
            .contentType(ContentType.JSON)
            .body(Map.of(
                "zitadelOrgId", "zitadel-org-dup-1",
                "name", "Primeiro",
                "slug", "duplicado"
            ))
        .when()
            .post("/api/v1/tenants")
        .then()
            .statusCode(201);

        // Tenta criar segundo com mesmo slug
        given()
            .auth().oauth2(MockJwtConfig.tokenForSystemAdmin())
            .contentType(ContentType.JSON)
            .body(Map.of(
                "zitadelOrgId", "zitadel-org-dup-2",
                "name", "Segundo",
                "slug", "duplicado"
            ))
        .when()
            .post("/api/v1/tenants")
        .then()
            .statusCode(422)
            .body("title", equalTo("TENANT_SLUG_ALREADY_TAKEN"));
    }

    @Test
    @DisplayName("GET /api/v1/tenants/by-slug/{slug} — deve buscar por slug")
    void deveBuscarPorSlug() {
        given()
            .auth().oauth2(MockJwtConfig.tokenForSystemAdmin())
            .contentType(ContentType.JSON)
            .body(Map.of(
                "zitadelOrgId", "zitadel-org-find",
                "name", "Findable",
                "slug", "findable"
            ))
            .post("/api/v1/tenants")
        .then().statusCode(201);

        given()
            .auth().oauth2(MockJwtConfig.tokenForOrgAdmin())
        .when()
            .get("/api/v1/tenants/by-slug/findable")
        .then()
            .statusCode(200)
            .body("slug", equalTo("findable"))
            .body("name", equalTo("Findable"));
    }

    @Test
    @DisplayName("GET /api/v1/tenants/by-slug/{slug} — deve retornar 422 quando não existir")
    void deveRetornar422QuandoNaoEncontrar() {
        given()
            .auth().oauth2(MockJwtConfig.tokenForSystemAdmin())
        .when()
            .get("/api/v1/tenants/by-slug/nao-existe")
        .then()
            .statusCode(422)
            .body("title", equalTo("TENANT_NOT_FOUND"));
    }
}
