package com.groupws.tkws.features.pessoas.domain;

import com.groupws.tkws.features.pessoas.domain.model.Contato;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoRelacionamento;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("Contato · agregado")
class ContatoTest {

    private static final long TENANT = 1L;

    @Test
    @DisplayName("cria contato normalizando opcionais em branco para null")
    void criaContato() {
        Contato c = Contato.create(PessoaId.generate(), TENANT, "  João  ", "  ", "",
            TipoRelacionamento.SOCIO);

        assertThat(c.nome()).isEqualTo("João");
        assertThat(c.email()).isEmpty();
        assertThat(c.telefone()).isEmpty();
        assertThat(c.tipoRelacionamento()).isEqualTo(TipoRelacionamento.SOCIO);
        assertThat(c.id()).isNotNull();
    }

    @Test
    @DisplayName("rejeita nome vazio")
    void rejeitaNomeVazio() {
        assertThatThrownBy(() -> Contato.create(PessoaId.generate(), TENANT, "   ", null, null,
            TipoRelacionamento.PAI))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("rejeita tenant não-positivo")
    void rejeitaTenantInvalido() {
        assertThatThrownBy(() -> Contato.create(PessoaId.generate(), 0L, "Ana", null, null,
            TipoRelacionamento.CONJUGE))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("update troca os dados e o relacionamento")
    void atualiza() {
        Contato c = Contato.create(PessoaId.generate(), TENANT, "Ana", "ana@x.com", "11999999999",
            TipoRelacionamento.CONJUGE);

        c.update("Ana Maria", "ana.maria@x.com", "11888888888", TipoRelacionamento.MAE);

        assertThat(c.nome()).isEqualTo("Ana Maria");
        assertThat(c.email()).contains("ana.maria@x.com");
        assertThat(c.tipoRelacionamento()).isEqualTo(TipoRelacionamento.MAE);
    }

    @Test
    @DisplayName("TipoRelacionamento conhece a aplicabilidade PF/PJ")
    void aplicabilidade() {
        assertThat(TipoRelacionamento.SOCIO.validoPara(TipoPessoa.PJ)).isTrue();
        assertThat(TipoRelacionamento.SOCIO.validoPara(TipoPessoa.PF)).isFalse();
        assertThat(TipoRelacionamento.CONJUGE.validoPara(TipoPessoa.PF)).isTrue();
        assertThat(TipoRelacionamento.CONJUGE.validoPara(TipoPessoa.PJ)).isFalse();

        assertThat(TipoRelacionamento.paraTipoPessoa(TipoPessoa.PJ))
            .containsExactlyInAnyOrder(TipoRelacionamento.SOCIO, TipoRelacionamento.REPRESENTANTE_LEGAL);
        assertThat(TipoRelacionamento.paraTipoPessoa(TipoPessoa.PF))
            .contains(TipoRelacionamento.PAI, TipoRelacionamento.MAE, TipoRelacionamento.FILHO,
                TipoRelacionamento.FILHA, TipoRelacionamento.CONJUGE, TipoRelacionamento.PARENTE,
                TipoRelacionamento.OUTROS);
    }
}
