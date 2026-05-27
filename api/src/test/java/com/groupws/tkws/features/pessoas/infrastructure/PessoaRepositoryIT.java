package com.groupws.tkws.features.pessoas.infrastructure;

import com.groupws.tkws.features.pessoas.domain.model.Documento;
import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.StatusPessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.features.pessoas.domain.port.PessoaListCriteria;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import com.groupws.tkws.features.pessoas.domain.port.PessoaSort;
import com.groupws.tkws.shared.AbstractIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * IT da listagem filtrada/paginada de Pessoas · exercita o SQL real
 * (filtros opcionais, busca textual, ordenação e teto de página) contra
 * Postgres via {@link PessoaRepository}. Ver ADR-022.
 */
@DisplayName("PessoaRepository · listagem filtrada e paginada")
class PessoaRepositoryIT extends AbstractIntegrationTest {

    @Autowired PessoaRepository repository;
    @Autowired JdbcTemplate jdbc;

    private long tenantId;

    @BeforeEach
    void setUp() {
        jdbc.execute("TRUNCATE pessoas, tenants RESTART IDENTITY CASCADE");
        tenantId = jdbc.queryForObject(
            "INSERT INTO tenants (zitadel_org_id, name, slug, active, created_at, updated_at) "
                + "VALUES (?, ?, ?, true, now(), now()) RETURNING id",
            Long.class, "org-it-pessoas", "IT Tenant", "it-pessoas");

        // Ana · PF · LEAD · São Paulo/SP · CPF
        save(TipoPessoa.PF, Documento.of(TipoPessoa.PF, "10683397990"),
            "Ana Silva", "ana@exemplo.com", null, "São Paulo", "SP", StatusPessoa.LEAD);
        // Bruno · PF · CLIENTE · Rio de Janeiro/RJ
        save(TipoPessoa.PF, null,
            "Bruno Costa", "bruno@exemplo.com", null, "Rio de Janeiro", "RJ", StatusPessoa.CLIENTE);
        // Acme · PJ · LEAD · Campinas/SP · CNPJ
        save(TipoPessoa.PJ, Documento.of(TipoPessoa.PJ, "11222333000181"),
            "Comprador Acme", "compras@acme.com", "Acme Móveis Ltda", "Campinas", "SP", StatusPessoa.LEAD);
        // Carla · PF · LEAD · Belo Horizonte/MG
        save(TipoPessoa.PF, null,
            "Carla Dias", null, null, "Belo Horizonte", "MG", StatusPessoa.LEAD);
    }

    private void save(TipoPessoa tipo, Documento doc, String nome, String email,
                      String empresa, String cidade, String uf, StatusPessoa status) {
        Pessoa p = Pessoa.createLead(tenantId, tipo, doc, nome, email, null, empresa);
        p.updateEnderecoENotas(null, cidade, uf, null, null);
        if (status == StatusPessoa.CLIENTE) p.convertToCliente();
        repository.save(p);
    }

    private PessoaListCriteria criteria(StatusPessoa status, String q, TipoPessoa tipo,
                                        String cidade, String uf, PessoaSort sort) {
        return new PessoaListCriteria(status, q, tipo, cidade, uf, sort);
    }

    @Test
    @DisplayName("filtra por status LEAD")
    void filtraPorStatus() {
        PessoaListCriteria c = PessoaListCriteria.ofStatus(StatusPessoa.LEAD);
        assertThat(repository.count(tenantId, c)).isEqualTo(3);
        assertThat(repository.list(tenantId, c, 50, 0)).hasSize(3);
    }

    @Test
    @DisplayName("filtra por tipoPessoa PJ")
    void filtraPorTipo() {
        PessoaListCriteria c = criteria(null, null, TipoPessoa.PJ, null, null, PessoaSort.RECENTE);
        List<Pessoa> result = repository.list(tenantId, c, 50, 0);
        assertThat(result).extracting(Pessoa::nomeContato).containsExactly("Comprador Acme");
    }

    @Test
    @DisplayName("filtra por UF (SP) — Ana e Acme")
    void filtraPorUf() {
        PessoaListCriteria c = criteria(null, null, null, null, "SP", PessoaSort.NOME);
        assertThat(repository.list(tenantId, c, 50, 0))
            .extracting(Pessoa::nomeContato)
            .containsExactly("Ana Silva", "Comprador Acme");
        assertThat(repository.count(tenantId, c)).isEqualTo(2);
    }

    @Test
    @DisplayName("filtra por cidade (case-insensitive, parcial)")
    void filtraPorCidade() {
        PessoaListCriteria c = criteria(null, null, null, "campinas", null, PessoaSort.RECENTE);
        assertThat(repository.list(tenantId, c, 50, 0))
            .extracting(Pessoa::nomeContato).containsExactly("Comprador Acme");
    }

    @Test
    @DisplayName("busca textual casa em nome do contato")
    void buscaPorNome() {
        PessoaListCriteria c = criteria(null, "ana", null, null, null, PessoaSort.RECENTE);
        assertThat(repository.list(tenantId, c, 50, 0))
            .extracting(Pessoa::nomeContato).containsExactly("Ana Silva");
    }

    @Test
    @DisplayName("busca textual casa em nome da empresa")
    void buscaPorEmpresa() {
        PessoaListCriteria c = criteria(null, "acme", null, null, null, PessoaSort.RECENTE);
        assertThat(repository.list(tenantId, c, 50, 0))
            .extracting(Pessoa::nomeContato).containsExactly("Comprador Acme");
    }

    @Test
    @DisplayName("busca textual casa em documento por dígitos")
    void buscaPorDocumento() {
        PessoaListCriteria c = criteria(null, "106.833", null, null, null, PessoaSort.RECENTE);
        assertThat(repository.list(tenantId, c, 50, 0))
            .extracting(Pessoa::nomeContato).containsExactly("Ana Silva");
    }

    @Test
    @DisplayName("ordena por nome (A→Z)")
    void ordenaPorNome() {
        PessoaListCriteria c = criteria(StatusPessoa.LEAD, null, null, null, null, PessoaSort.NOME);
        assertThat(repository.list(tenantId, c, 50, 0))
            .extracting(Pessoa::nomeContato)
            .containsExactly("Ana Silva", "Carla Dias", "Comprador Acme");
    }

    @Test
    @DisplayName("pagina por limit/offset mantendo o total")
    void pagina() {
        PessoaListCriteria c = criteria(StatusPessoa.LEAD, null, null, null, null, PessoaSort.NOME);
        List<Pessoa> primeira = repository.list(tenantId, c, 2, 0);
        List<Pessoa> segunda = repository.list(tenantId, c, 2, 2);

        assertThat(primeira).extracting(Pessoa::nomeContato).containsExactly("Ana Silva", "Carla Dias");
        assertThat(segunda).extracting(Pessoa::nomeContato).containsExactly("Comprador Acme");
        assertThat(repository.count(tenantId, c)).isEqualTo(3);
    }

    @Test
    @DisplayName("limit acima do teto (100) não estoura — retorna o disponível")
    void limitAcimaDoTeto() {
        PessoaListCriteria c = PessoaListCriteria.ofStatus(null);
        assertThat(repository.list(tenantId, c, 500, 0)).hasSize(4);
    }
}
