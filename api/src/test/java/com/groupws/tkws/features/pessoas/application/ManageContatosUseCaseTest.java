package com.groupws.tkws.features.pessoas.application;

import com.groupws.tkws.features.pessoas.application.dto.ContatoCommand;
import com.groupws.tkws.features.pessoas.application.dto.ContatoView;
import com.groupws.tkws.features.pessoas.application.usecase.ManageContatosUseCase;
import com.groupws.tkws.features.pessoas.domain.exception.ContatoNotFoundException;
import com.groupws.tkws.features.pessoas.domain.exception.PessoaNotFoundException;
import com.groupws.tkws.features.pessoas.domain.exception.RelacionamentoIncompativelException;
import com.groupws.tkws.features.pessoas.domain.model.Contato;
import com.groupws.tkws.features.pessoas.domain.model.ContatoId;
import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoRelacionamento;
import com.groupws.tkws.features.pessoas.domain.port.ContatoRepository;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ManageContatosUseCase")
class ManageContatosUseCaseTest {

    @Mock PessoaRepository pessoaRepository;
    @Mock ContatoRepository contatoRepository;
    @InjectMocks ManageContatosUseCase useCase;

    private static final long TENANT = 1L;

    private Pessoa pessoaPJ() {
        return Pessoa.createLead(TENANT, TipoPessoa.PJ, null, "Comprador Acme", null, null, "Acme Ltda");
    }

    private Pessoa pessoaPF() {
        return Pessoa.createLead(TENANT, TipoPessoa.PF, null, "Ana", null, null, null);
    }

    private ContatoCommand cmd(String nome, TipoRelacionamento rel) {
        return new ContatoCommand(nome, "x@x.com", "11999999999", rel);
    }

    @Test
    @DisplayName("adiciona contato de sócio a uma pessoa PJ")
    void adicionaSocioEmPJ() {
        Pessoa pj = pessoaPJ();
        when(pessoaRepository.findById(TENANT, pj.id())).thenReturn(Optional.of(pj));
        when(contatoRepository.save(any(Contato.class))).thenAnswer(inv -> inv.getArgument(0));

        ContatoView v = useCase.add(TENANT, pj.id(), cmd("João Sócio", TipoRelacionamento.SOCIO));

        assertThat(v.nome()).isEqualTo("João Sócio");
        assertThat(v.tipoRelacionamento()).isEqualTo(TipoRelacionamento.SOCIO);
        verify(contatoRepository).save(any(Contato.class));
    }

    @Test
    @DisplayName("rejeita relacionamento de PF (CONJUGE) numa pessoa PJ")
    void rejeitaRelacionamentoIncompativel() {
        Pessoa pj = pessoaPJ();
        when(pessoaRepository.findById(TENANT, pj.id())).thenReturn(Optional.of(pj));

        assertThatThrownBy(() -> useCase.add(TENANT, pj.id(), cmd("Maria", TipoRelacionamento.CONJUGE)))
            .isInstanceOf(RelacionamentoIncompativelException.class);

        verify(contatoRepository, never()).save(any());
    }

    @Test
    @DisplayName("rejeita relacionamento de PJ (SOCIO) numa pessoa PF")
    void rejeitaSocioEmPF() {
        Pessoa pf = pessoaPF();
        when(pessoaRepository.findById(TENANT, pf.id())).thenReturn(Optional.of(pf));

        assertThatThrownBy(() -> useCase.add(TENANT, pf.id(), cmd("João", TipoRelacionamento.SOCIO)))
            .isInstanceOf(RelacionamentoIncompativelException.class);
    }

    @Test
    @DisplayName("lança PessoaNotFound quando a pessoa dona não existe")
    void pessoaInexistente() {
        PessoaId id = PessoaId.generate();
        when(pessoaRepository.findById(TENANT, id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> useCase.add(TENANT, id, cmd("X", TipoRelacionamento.PAI)))
            .isInstanceOf(PessoaNotFoundException.class);
    }

    @Test
    @DisplayName("update lança ContatoNotFound quando o contato não pertence à pessoa")
    void updateContatoDeOutraPessoa() {
        Pessoa pf = pessoaPF();
        Contato deOutra = Contato.create(PessoaId.generate(), TENANT, "Outro", null, null,
            TipoRelacionamento.PAI);
        when(pessoaRepository.findById(TENANT, pf.id())).thenReturn(Optional.of(pf));
        when(contatoRepository.findById(TENANT, deOutra.id())).thenReturn(Optional.of(deOutra));

        assertThatThrownBy(() -> useCase.update(TENANT, pf.id(), deOutra.id(),
            cmd("Outro", TipoRelacionamento.PAI)))
            .isInstanceOf(ContatoNotFoundException.class);
    }

    @Test
    @DisplayName("remove apaga o contato da pessoa")
    void removeContato() {
        Pessoa pf = pessoaPF();
        Contato c = Contato.create(pf.id(), TENANT, "Filho", null, null, TipoRelacionamento.FILHO);
        when(contatoRepository.findById(TENANT, c.id())).thenReturn(Optional.of(c));

        useCase.remove(TENANT, pf.id(), c.id());

        verify(contatoRepository).deleteById(TENANT, c.id());
    }

    @Test
    @DisplayName("remove lança ContatoNotFound quando o id não existe")
    void removeInexistente() {
        ContatoId id = ContatoId.generate();
        when(contatoRepository.findById(TENANT, id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> useCase.remove(TENANT, PessoaId.generate(), id))
            .isInstanceOf(ContatoNotFoundException.class);
        verify(contatoRepository, never()).deleteById(anyLong(), any());
    }
}
