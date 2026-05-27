package com.groupws.tkws.features.pessoas.infrastructure;

import com.groupws.tkws.features.pessoas.domain.model.Contato;
import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoRelacionamento;
import com.groupws.tkws.features.pessoas.domain.port.ContatoRepository;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import com.groupws.tkws.shared.AbstractIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * IT do {@link ContatoRepository} · exercita o CRUD real de contatos contra
 * Postgres, incluindo o cascade de remoção via FK. Ver ADR-023.
 */
@DisplayName("ContatoRepository · persistência de contatos")
class ContatoRepositoryIT extends AbstractIntegrationTest {

    @Autowired PessoaRepository pessoaRepository;
    @Autowired ContatoRepository contatoRepository;
    @Autowired JdbcTemplate jdbc;

    private long tenantId;
    private Pessoa pessoa;

    @BeforeEach
    void setUp() {
        jdbc.execute("TRUNCATE pessoa_contatos, pessoas, tenants RESTART IDENTITY CASCADE");
        tenantId = jdbc.queryForObject(
            "INSERT INTO tenants (zitadel_org_id, name, slug, active, created_at, updated_at) "
                + "VALUES (?, ?, ?, true, now(), now()) RETURNING id",
            Long.class, "org-it-contatos", "IT Contatos", "it-contatos");

        pessoa = pessoaRepository.save(
            Pessoa.createLead(tenantId, TipoPessoa.PJ, null, "Acme", null, null, "Acme Ltda"));
    }

    @Test
    @DisplayName("salva e lista contatos da pessoa, ordenados por criação")
    void salvaELista() {
        contatoRepository.save(Contato.create(pessoa.id(), tenantId, "João Sócio",
            "joao@acme.com", "11999999999", TipoRelacionamento.SOCIO));
        contatoRepository.save(Contato.create(pessoa.id(), tenantId, "Maria Rep",
            null, null, TipoRelacionamento.REPRESENTANTE_LEGAL));

        List<Contato> contatos = contatoRepository.listByPessoa(tenantId, pessoa.id());

        assertThat(contatos).hasSize(2);
        assertThat(contatos).extracting(Contato::nome)
            .containsExactly("João Sócio", "Maria Rep");
    }

    @Test
    @DisplayName("atualiza um contato existente")
    void atualiza() {
        Contato saved = contatoRepository.save(Contato.create(pessoa.id(), tenantId, "João",
            null, null, TipoRelacionamento.SOCIO));

        saved.update("João da Silva", "joao@acme.com", "11888888888",
            TipoRelacionamento.REPRESENTANTE_LEGAL);
        contatoRepository.save(saved);

        Contato reloaded = contatoRepository.findById(tenantId, saved.id()).orElseThrow();
        assertThat(reloaded.nome()).isEqualTo("João da Silva");
        assertThat(reloaded.tipoRelacionamento()).isEqualTo(TipoRelacionamento.REPRESENTANTE_LEGAL);
        assertThat(reloaded.email()).contains("joao@acme.com");
    }

    @Test
    @DisplayName("remove um contato")
    void remove() {
        Contato saved = contatoRepository.save(Contato.create(pessoa.id(), tenantId, "Tmp",
            null, null, TipoRelacionamento.SOCIO));

        contatoRepository.deleteById(tenantId, saved.id());

        assertThat(contatoRepository.findById(tenantId, saved.id())).isEmpty();
        assertThat(contatoRepository.listByPessoa(tenantId, pessoa.id())).isEmpty();
    }

    @Test
    @DisplayName("não enxerga contato de outro tenant")
    void isolaPorTenant() {
        Contato saved = contatoRepository.save(Contato.create(pessoa.id(), tenantId, "João",
            null, null, TipoRelacionamento.SOCIO));

        long outroTenant = jdbc.queryForObject(
            "INSERT INTO tenants (zitadel_org_id, name, slug, active, created_at, updated_at) "
                + "VALUES (?, ?, ?, true, now(), now()) RETURNING id",
            Long.class, "org-outro", "Outro", "outro");

        assertThat(contatoRepository.findById(outroTenant, saved.id())).isEmpty();
    }

    @Test
    @DisplayName("FK ON DELETE CASCADE remove contatos quando a pessoa é apagada")
    void cascadeAoApagarPessoa() {
        contatoRepository.save(Contato.create(pessoa.id(), tenantId, "João",
            null, null, TipoRelacionamento.SOCIO));

        jdbc.update("DELETE FROM pessoas WHERE id = ?", pessoa.id().value());

        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM pessoa_contatos WHERE pessoa_id = ?", Integer.class,
            pessoa.id().value());
        assertThat(count).isZero();
    }
}
