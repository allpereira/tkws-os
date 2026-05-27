package com.groupws.tkws.features.pessoas.web;

import com.groupws.tkws.features.pessoas.domain.model.Documento;
import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import com.groupws.tkws.shared.AbstractIntegrationTest;
import com.groupws.tkws.shared.MockJwtConfig;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

/**
 * E2E do {@link PessoaController}: HTTP → banco real, tenant resolvido pelo JWT
 * (claim resource owner). Cobre TODOS os endpoints do controller — list, byId,
 * search, buscar (dedup), create, update (PATCH) e converter — além de
 * autorização (401/403) e isolamento entre tenants.
 *
 * Cobre explicitamente os dois bugs que originaram a suíte:
 *   - PATCH ausente → 405 (ver {@link Update});
 *   - listagem sem filtros estourando `lower(bytea)` no PostgreSQL
 *     (ver {@link Listagem#listaSemFiltros}).
 *
 * Diretrizes em docs/15-API-BEST-PRACTICES.md.
 */
@org.springframework.boot.test.context.SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(MockJwtConfig.class)
@DisplayName("PessoaController — E2E")
class PessoaControllerIT extends AbstractIntegrationTest {

    private static final String ORG = "org-pessoas-it";
    private static final String OUTRA_ORG = "org-pessoas-it-outra";

    // Documentos válidos (só tamanho importa para o VO Documento · 11/14 dígitos).
    private static final String CPF_MARIA = "10683397990";
    private static final String CPF_LIVRE = "39053344705";
    private static final String CNPJ_ACME = "11222333000181";

    @LocalServerPort int port;
    @Autowired JdbcTemplate jdbc;
    @Autowired PessoaRepository pessoaRepository;

    private long tenantId;
    private long outroTenantId;

    private UUID mariaId;     // PF · LEAD · CPF_MARIA · São Paulo/SP
    private UUID joaoId;      // PF · LEAD · sem documento · Curitiba/PR
    private UUID outroId;     // pertence a OUTRA_ORG (isolamento)
    // Acme (PJ · CNPJ_ACME · Rio de Janeiro/RJ) é fixture só de dados · não precisa de id.

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        jdbc.execute("TRUNCATE pessoa_contatos, pessoas, tenants RESTART IDENTITY CASCADE");

        tenantId = inserirTenant(ORG, "IT Pessoas", "it-pessoas");
        outroTenantId = inserirTenant(OUTRA_ORG, "IT Pessoas Outra", "it-pessoas-outra");

        mariaId = salvarComEndereco(
            Pessoa.createLead(tenantId, TipoPessoa.PF, Documento.of(TipoPessoa.PF, CPF_MARIA),
                "Maria Silva", "maria@exemplo.com", "11999990000", null),
            "São Paulo", "SP");
        salvarComEndereco(
            Pessoa.createLead(tenantId, TipoPessoa.PJ, Documento.of(TipoPessoa.PJ, CNPJ_ACME),
                "Comprador Acme", "contato@acme.com", "2133334444", "Acme Ltda"),
            "Rio de Janeiro", "RJ");
        joaoId = salvarComEndereco(
            Pessoa.createLead(tenantId, TipoPessoa.PF, null,
                "João Souza", "joao@exemplo.com", null, null),
            "Curitiba", "PR");

        outroId = pessoaRepository.save(
            Pessoa.createLead(outroTenantId, TipoPessoa.PF, null, "De Outro Tenant", null, null, null))
            .id().value();
    }

    private long inserirTenant(String org, String name, String slug) {
        return jdbc.queryForObject(
            "INSERT INTO tenants (zitadel_org_id, name, slug, active, created_at, updated_at) "
                + "VALUES (?, ?, ?, true, now(), now()) RETURNING id",
            Long.class, org, name, slug);
    }

    /** Persiste e, em seguida, completa cidade/uf (endereço não vem na factory). */
    private UUID salvarComEndereco(Pessoa pessoa, String cidade, String uf) {
        Pessoa saved = pessoaRepository.save(pessoa);
        pessoaRepository.save(reloadComEndereco(saved, cidade, uf));
        return saved.id().value();
    }

    private Pessoa reloadComEndereco(Pessoa p, String cidade, String uf) {
        p.updateEnderecoENotas(null, cidade, uf, null, null);
        return p;
    }

    private String token() {
        return MockJwtConfig.tokenForOrg(ORG, "comercial_atendimento");
    }

    // ============================================================
    // GET /api/v1/pessoas — listagem paginada
    // ============================================================

    @Nested
    @DisplayName("GET /api/v1/pessoas — listagem")
    class Listagem {

        @Test
        @DisplayName("sem filtros retorna o envelope paginado (regressão lower(bytea))")
        void listaSemFiltros() {
            given()
                .auth().oauth2(token())
            .when()
                .get("/api/v1/pessoas")
            .then()
                .statusCode(200)
                .body("content.size()", equalTo(3))
                .body("total", equalTo(3))
                .body("limit", equalTo(50))
                .body("offset", equalTo(0))
                .body("hasNext", equalTo(false));
        }

        @Test
        @DisplayName("filtra por status")
        void filtraPorStatus() {
            given()
                .auth().oauth2(token())
                .queryParam("status", "LEAD")
            .when()
                .get("/api/v1/pessoas")
            .then()
                .statusCode(200)
                .body("content.size()", equalTo(3))
                .body("content.status", everyItem(equalTo("LEAD")));
        }

        @Test
        @DisplayName("filtra por tipoPessoa")
        void filtraPorTipo() {
            given()
                .auth().oauth2(token())
                .queryParam("tipoPessoa", "PJ")
            .when()
                .get("/api/v1/pessoas")
            .then()
                .statusCode(200)
                .body("content.size()", equalTo(1))
                .body("content[0].nomeContato", equalTo("Comprador Acme"));
        }

        @Test
        @DisplayName("filtra por uf e cidade (exercita o CAST de string nullable)")
        void filtraPorUfECidade() {
            given()
                .auth().oauth2(token())
                .queryParam("uf", "SP")
                .queryParam("cidade", "são")
            .when()
                .get("/api/v1/pessoas")
            .then()
                .statusCode(200)
                .body("content.size()", equalTo(1))
                .body("content[0].nomeContato", equalTo("Maria Silva"));
        }

        @Test
        @DisplayName("busca textual q casa em nome, empresa, email e documento")
        void buscaTextual() {
            given()
                .auth().oauth2(token())
                .queryParam("q", "acme")
            .when()
                .get("/api/v1/pessoas")
            .then()
                .statusCode(200)
                .body("content.size()", equalTo(1))
                .body("content[0].nomeEmpresa", equalTo("Acme Ltda"));
        }

        @Test
        @DisplayName("ordena por NOME (asc)")
        void ordenaPorNome() {
            given()
                .auth().oauth2(token())
                .queryParam("sort", "NOME")
            .when()
                .get("/api/v1/pessoas")
            .then()
                .statusCode(200)
                .body("content[0].nomeContato", equalTo("Comprador Acme"))
                .body("content[1].nomeContato", equalTo("João Souza"))
                .body("content[2].nomeContato", equalTo("Maria Silva"));
        }

        @Test
        @DisplayName("pagina via limit/offset e calcula hasNext")
        void pagina() {
            given()
                .auth().oauth2(token())
                .queryParam("limit", 2)
                .queryParam("offset", 0)
            .when()
                .get("/api/v1/pessoas")
            .then()
                .statusCode(200)
                .body("content.size()", equalTo(2))
                .body("total", equalTo(3))
                .body("hasNext", equalTo(true));
        }

        @Test
        @DisplayName("só vê pessoas do próprio tenant")
        void isolaPorTenant() {
            // tenant ORG tem 3 pessoas; OUTRA_ORG tem 1 (outroId) que não pode aparecer.
            given()
                .auth().oauth2(token())
            .when()
                .get("/api/v1/pessoas")
            .then()
                .statusCode(200)
                .body("content.id", everyItem(notNullValue()))
                .body("content.findAll { it.id == '" + outroId + "' }.size()", equalTo(0));
        }
    }

    // ============================================================
    // GET /api/v1/pessoas/{id} — busca por ID
    // ============================================================

    @Nested
    @DisplayName("GET /api/v1/pessoas/{id} — por ID")
    class PorId {

        @Test
        @DisplayName("retorna a pessoa com todos os campos")
        void buscaExistente() {
            given()
                .auth().oauth2(token())
            .when()
                .get("/api/v1/pessoas/{id}", mariaId)
            .then()
                .statusCode(200)
                .body("id", equalTo(mariaId.toString()))
                .body("nomeContato", equalTo("Maria Silva"))
                .body("tipoPessoa", equalTo("PF"))
                .body("documento", equalTo(CPF_MARIA))
                .body("emailContato", equalTo("maria@exemplo.com"))
                .body("cidade", equalTo("São Paulo"))
                .body("uf", equalTo("SP"))
                .body("status", equalTo("LEAD"));
        }

        @Test
        @DisplayName("id inexistente retorna 422 pessoas.not_found")
        void inexistente() {
            given()
                .auth().oauth2(token())
            .when()
                .get("/api/v1/pessoas/{id}", UUID.randomUUID())
            .then()
                .statusCode(422)
                .body("title", equalTo("pessoas.not_found"));
        }

        @Test
        @DisplayName("pessoa de outro tenant retorna 422 (isolamento)")
        void doOutroTenant() {
            given()
                .auth().oauth2(token())
            .when()
                .get("/api/v1/pessoas/{id}", outroId)
            .then()
                .statusCode(422)
                .body("title", equalTo("pessoas.not_found"));
        }
    }

    // ============================================================
    // GET /api/v1/pessoas/search — autocomplete
    // ============================================================

    @Nested
    @DisplayName("GET /api/v1/pessoas/search — autocomplete")
    class Search {

        @Test
        @DisplayName("casa parcialmente em nome/empresa")
        void casaPorNome() {
            given()
                .auth().oauth2(token())
                .queryParam("q", "mar")
            .when()
                .get("/api/v1/pessoas/search")
            .then()
                .statusCode(200)
                .body("size()", greaterThanOrEqualTo(1))
                .body("nomeContato", hasItem("Maria Silva"))
                .body("[0].documento", notNullValue());
        }

        @Test
        @DisplayName("query em branco retorna lista vazia (sem hit no banco)")
        void queryVazia() {
            given()
                .auth().oauth2(token())
                .queryParam("q", "   ")
            .when()
                .get("/api/v1/pessoas/search")
            .then()
                .statusCode(200)
                .body("size()", equalTo(0));
        }
    }

    // ============================================================
    // GET /api/v1/pessoas/buscar — detecção de duplicidade
    // ============================================================

    @Nested
    @DisplayName("GET /api/v1/pessoas/buscar — dedup")
    class Buscar {

        @Test
        @DisplayName("documento existente preenche matchedByDocumento")
        void matchPorDocumento() {
            given()
                .auth().oauth2(token())
                .queryParam("tipoPessoa", "PF")
                .queryParam("documento", CPF_MARIA)
            .when()
                .get("/api/v1/pessoas/buscar")
            .then()
                .statusCode(200)
                .body("matchedByDocumento.id", equalTo(mariaId.toString()))
                .body("matchedSoft.size()", equalTo(0));
        }

        @Test
        @DisplayName("email batendo preenche matchedSoft")
        void matchSoftPorEmail() {
            given()
                .auth().oauth2(token())
                .queryParam("email", "joao@exemplo.com")
            .when()
                .get("/api/v1/pessoas/buscar")
            .then()
                .statusCode(200)
                .body("matchedByDocumento", nullValue())
                .body("matchedSoft.size()", equalTo(1))
                .body("matchedSoft[0].id", equalTo(joaoId.toString()));
        }

        @Test
        @DisplayName("nada bate retorna ambos vazios")
        void semMatch() {
            given()
                .auth().oauth2(token())
                .queryParam("email", "ninguem@exemplo.com")
            .when()
                .get("/api/v1/pessoas/buscar")
            .then()
                .statusCode(200)
                .body("matchedByDocumento", nullValue())
                .body("matchedSoft.size()", equalTo(0));
        }
    }

    // ============================================================
    // POST /api/v1/pessoas — criação
    // ============================================================

    @Nested
    @DisplayName("POST /api/v1/pessoas — criação")
    class Criacao {

        @Test
        @DisplayName("cria lead válido (201 + Location)")
        void criaValido() {
            given()
                .auth().oauth2(token())
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "tipoPessoa", "PF",
                    "documento", CPF_LIVRE,
                    "nomeContato", "Novo Lead",
                    "emailContato", "novo@exemplo.com"))
            .when()
                .post("/api/v1/pessoas")
            .then()
                .statusCode(201)
                .header("Location", notNullValue())
                .body("id", notNullValue())
                .body("nomeContato", equalTo("Novo Lead"))
                .body("documento", equalTo(CPF_LIVRE))
                .body("status", equalTo("LEAD"));
        }

        @Test
        @DisplayName("documento já cadastrado retorna 422 pessoas.documento_duplicado")
        void documentoDuplicado() {
            given()
                .auth().oauth2(token())
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "tipoPessoa", "PF",
                    "documento", CPF_MARIA, // já é da Maria
                    "nomeContato", "Clone da Maria"))
            .when()
                .post("/api/v1/pessoas")
            .then()
                .statusCode(422)
                .body("title", equalTo("pessoas.documento_duplicado"));
        }

        @Test
        @DisplayName("documento incompatível com o tipo retorna 422")
        void documentoIncompativel() {
            given()
                .auth().oauth2(token())
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "tipoPessoa", "PJ",
                    "documento", CPF_LIVRE, // 11 dígitos para PJ
                    "nomeContato", "Empresa X"))
            .when()
                .post("/api/v1/pessoas")
            .then()
                .statusCode(422);
        }

        @Test
        @DisplayName("nome em branco retorna 400 VALIDATION_FAILED")
        void nomeObrigatorio() {
            given()
                .auth().oauth2(token())
                .contentType(ContentType.JSON)
                .body(Map.of("tipoPessoa", "PF", "nomeContato", ""))
            .when()
                .post("/api/v1/pessoas")
            .then()
                .statusCode(400)
                .body("title", equalTo("VALIDATION_FAILED"));
        }

        @Test
        @DisplayName("tipoPessoa ausente retorna 400")
        void tipoObrigatorio() {
            given()
                .auth().oauth2(token())
                .contentType(ContentType.JSON)
                .body(Map.of("nomeContato", "Sem Tipo"))
            .when()
                .post("/api/v1/pessoas")
            .then()
                .statusCode(400)
                .body("title", equalTo("VALIDATION_FAILED"));
        }
    }

    // ============================================================
    // PATCH /api/v1/pessoas/{id} — atualização (o bug original do 405)
    // ============================================================

    @Nested
    @DisplayName("PATCH /api/v1/pessoas/{id} — atualização")
    class Update {

        @Test
        @DisplayName("atualiza dados cadastrais (200)")
        void atualizaValido() {
            given()
                .auth().oauth2(token())
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "tipoPessoa", "PF",
                    "documento", CPF_MARIA,
                    "nomeContato", "Maria Silva Atualizada",
                    "emailContato", "maria.nova@exemplo.com",
                    "celularContato", "11900001111"))
            .when()
                .patch("/api/v1/pessoas/{id}", mariaId)
            .then()
                .statusCode(200)
                .body("id", equalTo(mariaId.toString()))
                .body("nomeContato", equalTo("Maria Silva Atualizada"))
                .body("emailContato", equalTo("maria.nova@exemplo.com"))
                .body("celularContato", equalTo("11900001111"))
                .body("status", equalTo("LEAD"));
        }

        @Test
        @DisplayName("não acusa duplicidade ao manter o próprio documento")
        void mantemProprioDocumento() {
            given()
                .auth().oauth2(token())
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "tipoPessoa", "PF",
                    "documento", CPF_MARIA, // o documento já é dela
                    "nomeContato", "Maria Mesmo CPF"))
            .when()
                .patch("/api/v1/pessoas/{id}", mariaId)
            .then()
                .statusCode(200)
                .body("documento", equalTo(CPF_MARIA));
        }

        @Test
        @DisplayName("documento de outra pessoa retorna 422 pessoas.documento_duplicado")
        void documentoDeOutra() {
            // joão não tem documento · tentar dar o CPF da Maria deve falhar
            given()
                .auth().oauth2(token())
                .contentType(ContentType.JSON)
                .body(Map.of(
                    "tipoPessoa", "PF",
                    "documento", CPF_MARIA,
                    "nomeContato", "João Souza"))
            .when()
                .patch("/api/v1/pessoas/{id}", joaoId)
            .then()
                .statusCode(422)
                .body("title", equalTo("pessoas.documento_duplicado"));
        }

        @Test
        @DisplayName("nome em branco retorna 400")
        void nomeObrigatorio() {
            given()
                .auth().oauth2(token())
                .contentType(ContentType.JSON)
                .body(Map.of("tipoPessoa", "PF", "nomeContato", ""))
            .when()
                .patch("/api/v1/pessoas/{id}", mariaId)
            .then()
                .statusCode(400)
                .body("title", equalTo("VALIDATION_FAILED"));
        }

        @Test
        @DisplayName("id inexistente retorna 422 pessoas.not_found")
        void inexistente() {
            given()
                .auth().oauth2(token())
                .contentType(ContentType.JSON)
                .body(Map.of("tipoPessoa", "PF", "nomeContato", "Fantasma"))
            .when()
                .patch("/api/v1/pessoas/{id}", UUID.randomUUID())
            .then()
                .statusCode(422)
                .body("title", equalTo("pessoas.not_found"));
        }

        @Test
        @DisplayName("não atualiza pessoa de outro tenant (isolamento)")
        void doOutroTenant() {
            given()
                .auth().oauth2(token())
                .contentType(ContentType.JSON)
                .body(Map.of("tipoPessoa", "PF", "nomeContato", "Invasor"))
            .when()
                .patch("/api/v1/pessoas/{id}", outroId)
            .then()
                .statusCode(422)
                .body("title", equalTo("pessoas.not_found"));
        }
    }

    // ============================================================
    // POST /api/v1/pessoas/{id}/converter — promoção LEAD → CLIENTE
    // ============================================================

    @Nested
    @DisplayName("POST /api/v1/pessoas/{id}/converter — conversão")
    class Converter {

        @Test
        @DisplayName("promove LEAD para CLIENTE (200)")
        void promove() {
            given()
                .auth().oauth2(token())
            .when()
                .post("/api/v1/pessoas/{id}/converter", mariaId)
            .then()
                .statusCode(200)
                .body("id", equalTo(mariaId.toString()))
                .body("status", equalTo("CLIENTE"))
                .body("convertidoEm", notNullValue());
        }

        @Test
        @DisplayName("é idempotente · converter de novo continua CLIENTE")
        void idempotente() {
            promove();

            given()
                .auth().oauth2(token())
            .when()
                .post("/api/v1/pessoas/{id}/converter", mariaId)
            .then()
                .statusCode(200)
                .body("status", equalTo("CLIENTE"));
        }

        @Test
        @DisplayName("id inexistente retorna 422 pessoas.not_found")
        void inexistente() {
            given()
                .auth().oauth2(token())
            .when()
                .post("/api/v1/pessoas/{id}/converter", UUID.randomUUID())
            .then()
                .statusCode(422)
                .body("title", equalTo("pessoas.not_found"));
        }
    }

    // ============================================================
    // Autorização — transversal a todos os endpoints
    // ============================================================

    @Nested
    @DisplayName("Autorização")
    class Autorizacao {

        @Test
        @DisplayName("sem token retorna 401")
        void semToken() {
            given()
            .when()
                .get("/api/v1/pessoas")
            .then()
                .statusCode(401);
        }

        @Test
        @DisplayName("role default (sem permissão) retorna 403")
        void semPermissao() {
            given()
                .auth().oauth2(MockJwtConfig.tokenForOrg(ORG, "default"))
            .when()
                .get("/api/v1/pessoas")
            .then()
                .statusCode(403);
        }

        @Test
        @DisplayName("PATCH sem token retorna 401")
        void patchSemToken() {
            given()
                .contentType(ContentType.JSON)
                .body(Map.of("tipoPessoa", "PF", "nomeContato", "X"))
            .when()
                .patch("/api/v1/pessoas/{id}", mariaId)
            .then()
                .statusCode(401);
        }

        @Test
        @DisplayName("org_admin também tem acesso")
        void orgAdminAcessa() {
            given()
                .auth().oauth2(MockJwtConfig.tokenForOrg(ORG, "org_admin"))
            .when()
                .get("/api/v1/pessoas")
            .then()
                .statusCode(200);
        }
    }
}
