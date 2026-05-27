package com.groupws.tkws.features.pessoas.web;

import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
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
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

/**
 * E2E do {@link ContatoController}: HTTP → banco real, com tenant resolvido a
 * partir do JWT (claim resource owner). Cobre autorização, validação e a regra
 * de compatibilidade relacionamento × tipo da pessoa. Ver ADR-023.
 */
@org.springframework.boot.test.context.SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(MockJwtConfig.class)
@DisplayName("ContatoController — E2E")
class ContatoControllerIT extends AbstractIntegrationTest {

    private static final String ORG = "org-contatos-it";

    @LocalServerPort int port;
    @Autowired JdbcTemplate jdbc;
    @Autowired PessoaRepository pessoaRepository;

    private UUID pessoaPjId;
    private UUID pessoaPfId;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        jdbc.execute("TRUNCATE pessoa_contatos, pessoas, tenants RESTART IDENTITY CASCADE");
        long tenantId = jdbc.queryForObject(
            "INSERT INTO tenants (zitadel_org_id, name, slug, active, created_at, updated_at) "
                + "VALUES (?, ?, ?, true, now(), now()) RETURNING id",
            Long.class, ORG, "IT Contatos", "it-contatos");

        Pessoa pj = pessoaRepository.save(
            Pessoa.createLead(tenantId, TipoPessoa.PJ, null, "Comprador Acme", null, null, "Acme Ltda"));
        Pessoa pf = pessoaRepository.save(
            Pessoa.createLead(tenantId, TipoPessoa.PF, null, "Ana", null, null, null));
        pessoaPjId = pj.id().value();
        pessoaPfId = pf.id().value();
    }

    private String token() {
        return MockJwtConfig.tokenForOrg(ORG, "comercial_atendimento");
    }

    @Test
    @DisplayName("POST — adiciona sócio a uma pessoa PJ (201)")
    void adicionaSocio() {
        given()
            .auth().oauth2(token())
            .contentType(ContentType.JSON)
            .body(Map.of(
                "nome", "João Sócio",
                "email", "joao@acme.com",
                "telefone", "11999999999",
                "tipoRelacionamento", "SOCIO"))
        .when()
            .post("/api/v1/pessoas/{pessoaId}/contatos", pessoaPjId)
        .then()
            .statusCode(201)
            .header("Location", notNullValue())
            .body("id", notNullValue())
            .body("nome", equalTo("João Sócio"))
            .body("tipoRelacionamento", equalTo("SOCIO"));
    }

    @Test
    @DisplayName("POST — relacionamento de PF (CONJUGE) numa PJ retorna 422")
    void relacionamentoIncompativel() {
        given()
            .auth().oauth2(token())
            .contentType(ContentType.JSON)
            .body(Map.of("nome", "Maria", "tipoRelacionamento", "CONJUGE"))
        .when()
            .post("/api/v1/pessoas/{pessoaId}/contatos", pessoaPjId)
        .then()
            .statusCode(422)
            .body("title", equalTo("pessoas.relacionamento_incompativel"));
    }

    @Test
    @DisplayName("POST — nome em branco retorna 400")
    void nomeObrigatorio() {
        given()
            .auth().oauth2(token())
            .contentType(ContentType.JSON)
            .body(Map.of("nome", "", "tipoRelacionamento", "CONJUGE"))
        .when()
            .post("/api/v1/pessoas/{pessoaId}/contatos", pessoaPfId)
        .then()
            .statusCode(400)
            .body("title", equalTo("VALIDATION_FAILED"));
    }

    @Test
    @DisplayName("GET — lista os contatos da pessoa")
    void listaContatos() {
        adicionaSocio();

        given()
            .auth().oauth2(token())
        .when()
            .get("/api/v1/pessoas/{pessoaId}/contatos", pessoaPjId)
        .then()
            .statusCode(200)
            .body("size()", equalTo(1))
            .body("[0].nome", equalTo("João Sócio"));
    }

    @Test
    @DisplayName("DELETE — remove o contato (204) e some da listagem")
    void removeContato() {
        String contatoId = given()
            .auth().oauth2(token())
            .contentType(ContentType.JSON)
            .body(Map.of("nome", "Tmp", "tipoRelacionamento", "SOCIO"))
        .when()
            .post("/api/v1/pessoas/{pessoaId}/contatos", pessoaPjId)
        .then()
            .statusCode(201)
            .extract().path("id");

        given()
            .auth().oauth2(token())
        .when()
            .delete("/api/v1/pessoas/{pessoaId}/contatos/{id}", pessoaPjId, contatoId)
        .then()
            .statusCode(204);

        given()
            .auth().oauth2(token())
        .when()
            .get("/api/v1/pessoas/{pessoaId}/contatos", pessoaPjId)
        .then()
            .statusCode(200)
            .body("size()", equalTo(0));
    }

    @Test
    @DisplayName("sem token retorna 401")
    void semToken() {
        given()
            .contentType(ContentType.JSON)
            .body(Map.of("nome", "X", "tipoRelacionamento", "SOCIO"))
        .when()
            .post("/api/v1/pessoas/{pessoaId}/contatos", pessoaPjId)
        .then()
            .statusCode(401);
    }

    @Test
    @DisplayName("role sem permissão (default) retorna 403")
    void semPermissao() {
        given()
            .auth().oauth2(MockJwtConfig.tokenForOrg(ORG, "default"))
            .contentType(ContentType.JSON)
            .body(Map.of("nome", "X", "tipoRelacionamento", "SOCIO"))
        .when()
            .post("/api/v1/pessoas/{pessoaId}/contatos", pessoaPjId)
        .then()
            .statusCode(403);
    }
}
