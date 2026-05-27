package com.groupws.tkws.features.pessoas.application;

import com.groupws.tkws.features.pessoas.application.dto.PessoaView;
import com.groupws.tkws.features.pessoas.application.dto.UpdatePessoaCommand;
import com.groupws.tkws.features.pessoas.application.usecase.UpdatePessoaUseCase;
import com.groupws.tkws.features.pessoas.domain.exception.DocumentoDuplicadoException;
import com.groupws.tkws.features.pessoas.domain.exception.DocumentoInvalidoException;
import com.groupws.tkws.features.pessoas.domain.exception.PessoaNotFoundException;
import com.groupws.tkws.features.pessoas.domain.model.Documento;
import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UpdatePessoaUseCase")
class UpdatePessoaUseCaseTest {

    @Mock PessoaRepository repository;
    @Mock ApplicationEventPublisher eventPublisher;

    @InjectMocks UpdatePessoaUseCase useCase;

    private static final long TENANT = 1L;

    private Pessoa existing;
    private PessoaId id;

    @BeforeEach
    void setUp() {
        existing = Pessoa.createLead(TENANT, TipoPessoa.PF, null,
            "Nome Antigo", "antigo@x.com", "11999999999", null);
        existing.pullDomainEvents(); // limpa o PessoaCreatedEvent da factory
        id = existing.id();
    }

    private UpdatePessoaCommand cmd(TipoPessoa tipo, String documento, String nome) {
        return new UpdatePessoaCommand(TENANT, tipo, documento, nome,
            "novo@x.com", "11888888888", null);
    }

    @Test
    @DisplayName("deve atualizar os dados de contato da pessoa")
    void deveAtualizarContato() {
        when(repository.findById(TENANT, id)).thenReturn(Optional.of(existing));
        when(repository.save(any(Pessoa.class))).thenAnswer(inv -> inv.getArgument(0));

        PessoaView result = useCase.execute(TENANT, id, cmd(TipoPessoa.PF, null, "Nome Novo"));

        assertThat(result.nomeContato()).isEqualTo("Nome Novo");
        assertThat(result.emailContato()).isEqualTo("novo@x.com");
    }

    @Test
    @DisplayName("deve validar e normalizar o documento informado")
    void deveAtualizarDocumento() {
        when(repository.findById(TENANT, id)).thenReturn(Optional.of(existing));
        when(repository.findByDocumento(TENANT, "10683397990")).thenReturn(Optional.empty());
        when(repository.save(any(Pessoa.class))).thenAnswer(inv -> inv.getArgument(0));

        PessoaView result = useCase.execute(TENANT, id,
            cmd(TipoPessoa.PF, "106.833.979-90", "Nome Novo"));

        assertThat(result.documento()).isEqualTo("10683397990");
    }

    @Test
    @DisplayName("não deve acusar duplicidade quando o documento é da própria pessoa")
    void naoDeveAcusarDuplicidadeDoProprioDocumento() {
        existing.setDocumento(Documento.of(TipoPessoa.PF, "10683397990"));
        existing.pullDomainEvents();
        when(repository.findById(TENANT, id)).thenReturn(Optional.of(existing));
        when(repository.findByDocumento(TENANT, "10683397990")).thenReturn(Optional.of(existing));
        when(repository.save(any(Pessoa.class))).thenAnswer(inv -> inv.getArgument(0));

        PessoaView result = useCase.execute(TENANT, id,
            cmd(TipoPessoa.PF, "10683397990", "Nome Novo"));

        assertThat(result.documento()).isEqualTo("10683397990");
    }

    @Test
    @DisplayName("deve rejeitar documento que pertence a outra pessoa do tenant")
    void deveRejeitarDocumentoDeOutraPessoa() {
        Pessoa outra = Pessoa.createLead(TENANT, TipoPessoa.PF,
            Documento.of(TipoPessoa.PF, "10683397990"), "Outra", null, null, null);
        when(repository.findById(TENANT, id)).thenReturn(Optional.of(existing));
        when(repository.findByDocumento(TENANT, "10683397990")).thenReturn(Optional.of(outra));

        assertThatThrownBy(() -> useCase.execute(TENANT, id,
            cmd(TipoPessoa.PF, "10683397990", "Nome Novo")))
            .isInstanceOf(DocumentoDuplicadoException.class);

        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("deve lançar PessoaNotFoundException quando a pessoa não existir")
    void deveLancarQuandoNaoExistir() {
        when(repository.findById(anyLong(), any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> useCase.execute(TENANT, id, cmd(TipoPessoa.PF, null, "X")))
            .isInstanceOf(PessoaNotFoundException.class);

        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("deve rejeitar documento incompatível com o tipoPessoa")
    void deveRejeitarDocumentoIncompativel() {
        when(repository.findById(TENANT, id)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> useCase.execute(TENANT, id,
            cmd(TipoPessoa.PJ, "10683397990", "Nome Novo"))) // 11 dígitos para PJ
            .isInstanceOf(DocumentoInvalidoException.class);

        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("deve persistir a pessoa atualizada via repository")
    void devePersistir() {
        when(repository.findById(TENANT, id)).thenReturn(Optional.of(existing));
        when(repository.save(any(Pessoa.class))).thenAnswer(inv -> inv.getArgument(0));

        useCase.execute(TENANT, id, cmd(TipoPessoa.PF, null, "Nome Novo"));

        ArgumentCaptor<Pessoa> captor = ArgumentCaptor.forClass(Pessoa.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().nomeContato()).isEqualTo("Nome Novo");
    }
}
