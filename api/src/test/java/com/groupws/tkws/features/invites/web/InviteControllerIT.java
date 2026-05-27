package com.groupws.tkws.features.invites.web;

import com.groupws.tkws.features.invites.domain.port.IdentityProvider;
import com.groupws.tkws.features.invites.domain.port.InviteNotifier;
import com.groupws.tkws.shared.AbstractIntegrationTest;
import com.groupws.tkws.shared.MockJwtConfig;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

/**
 * E2E do InviteController: HTTP → use case → banco real. O IdP (Zitadel) e o
 * notifier (email) são mockados — não há Zitadel/SMTP nos testes.
 *
 * Multi-tenancy: o tenant é resolvido do claim de org do JWT (ver
 * {@link MockJwtConfig#tokenForOrg}); por isso seedamos um tenant com o mesmo
 * {@code zitadel_org_id} embutido no token.
 */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(MockJwtConfig.class)
@DisplayName("InviteController — E2E")
class InviteControllerIT extends AbstractIntegrationTest {

    private static final String ORG = "zitadel-org-invites";

    @LocalServerPort int port;
    @Autowired JdbcTemplate jdbc;

    @MockBean IdentityProvider idp;
    @MockBean InviteNotifier notifier;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        jdbc.execute("TRUNCATE invites, tenants RESTART IDENTITY CASCADE");
        jdbc.update(
            "INSERT INTO tenants (zitadel_org_id, name, slug, active, created_at, updated_at) "
                + "VALUES (?, ?, ?, true, now(), now())",
            ORG, "Studio Convites", "studio-convites");
        Mockito.when(idp.createShellUser(any(), any(), any())).thenReturn("zitadel-user-shell-1");
    }

    private String orgAdminToken() {
        return MockJwtConfig.tokenForOrg(ORG, "org_admin");
    }

    @Test
    @DisplayName("POST /api/v1/invites — cria convite (201) com org_admin")
    void deveCriarConvite() {
        given()
            .auth().oauth2(orgAdminToken())
            .contentType(ContentType.JSON)
            .body(Map.of("email", "convidado@studio.com", "fullName", "Convidado Um", "role", "comercial_atendimento"))
        .when()
            .post("/api/v1/invites")
        .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("email", equalTo("convidado@studio.com"))
            .body("status", equalTo("PENDING"))
            .body("rawToken", notNullValue());
    }

    @Test
    @DisplayName("POST /api/v1/invites — 401 sem token")
    void deveNegarSemToken() {
        given()
            .contentType(ContentType.JSON)
            .body(Map.of("email", "x@y.com", "role", "default"))
        .when()
            .post("/api/v1/invites")
        .then()
            .statusCode(401);
    }

    @Test
    @DisplayName("POST /api/v1/invites — 403 com role comercial")
    void deveNegarComercial() {
        given()
            .auth().oauth2(MockJwtConfig.tokenForOrg(ORG, "comercial_atendimento"))
            .contentType(ContentType.JSON)
            .body(Map.of("email", "x@y.com", "role", "default"))
        .when()
            .post("/api/v1/invites")
        .then()
            .statusCode(403);
    }

    @Test
    @DisplayName("POST /api/v1/invites — 400 com email inválido")
    void deveValidarEmail() {
        given()
            .auth().oauth2(orgAdminToken())
            .contentType(ContentType.JSON)
            .body(Map.of("email", "nao-eh-email", "role", "default"))
        .when()
            .post("/api/v1/invites")
        .then()
            .statusCode(400)
            .body("title", equalTo("VALIDATION_FAILED"));
    }

    @Test
    @DisplayName("POST /api/v1/invites — 409 quando já existe PENDING para o email")
    void deveRejeitarDuplicado() {
        given()
            .auth().oauth2(orgAdminToken())
            .contentType(ContentType.JSON)
            .body(Map.of("email", "dup@studio.com", "role", "default"))
        .when().post("/api/v1/invites").then().statusCode(201);

        given()
            .auth().oauth2(orgAdminToken())
            .contentType(ContentType.JSON)
            .body(Map.of("email", "dup@studio.com", "role", "default"))
        .when().post("/api/v1/invites").then().statusCode(409);
    }

    @Test
    @DisplayName("GET /api/v1/invites — lista paginada do tenant")
    void deveListar() {
        given().auth().oauth2(orgAdminToken()).contentType(ContentType.JSON)
            .body(Map.of("email", "a@studio.com", "role", "default"))
            .post("/api/v1/invites").then().statusCode(201);

        given()
            .auth().oauth2(orgAdminToken())
        .when()
            .get("/api/v1/invites")
        .then()
            .statusCode(200)
            .body("total", equalTo(1))
            .body("content[0].email", equalTo("a@studio.com"))
            .body("content[0].role", equalTo("default"));
    }

    @Test
    @DisplayName("POST /api/v1/invites/{id}/revoke — cancela o convite")
    void deveRevogar() {
        String id = given().auth().oauth2(orgAdminToken()).contentType(ContentType.JSON)
            .body(Map.of("email", "revoke@studio.com", "role", "default"))
            .post("/api/v1/invites")
            .then().statusCode(201)
            .extract().path("id");

        given()
            .auth().oauth2(orgAdminToken())
        .when()
            .post("/api/v1/invites/" + id + "/revoke")
        .then()
            .statusCode(200)
            .body("status", equalTo("REVOKED"));
    }

    @Test
    @DisplayName("POST /api/v1/invites/{id}/resend — reenvia e mantém PENDING")
    void deveReenviar() {
        String id = given().auth().oauth2(orgAdminToken()).contentType(ContentType.JSON)
            .body(Map.of("email", "resend@studio.com", "role", "default"))
            .post("/api/v1/invites")
            .then().statusCode(201)
            .extract().path("id");

        given()
            .auth().oauth2(orgAdminToken())
        .when()
            .post("/api/v1/invites/" + id + "/resend")
        .then()
            .statusCode(200)
            .body("status", equalTo("PENDING"))
            .body("email", equalTo("resend@studio.com"));
    }

    @Test
    @DisplayName("POST /api/v1/invites/{id}/revoke — 404 para id de outro tenant/inexistente")
    void revokeNotFound() {
        given()
            .auth().oauth2(orgAdminToken())
        .when()
            .post("/api/v1/invites/" + java.util.UUID.randomUUID() + "/revoke")
        .then()
            .statusCode(404);
    }
}
