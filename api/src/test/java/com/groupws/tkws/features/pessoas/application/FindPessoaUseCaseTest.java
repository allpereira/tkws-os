package com.groupws.tkws.features.pessoas.application;

import com.groupws.tkws.features.pessoas.application.dto.PessoaView;
import com.groupws.tkws.features.pessoas.application.usecase.FindPessoaUseCase;
import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.StatusPessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.features.pessoas.domain.port.PessoaListCriteria;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import com.groupws.tkws.features.pessoas.domain.port.PessoaSort;
import com.groupws.tkws.shared.page.PageResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("FindPessoaUseCase · listagem paginada")
class FindPessoaUseCaseTest {

    @Mock PessoaRepository repository;
    @InjectMocks FindPessoaUseCase useCase;

    private static final long TENANT = 1L;

    private Pessoa lead(String nome) {
        return Pessoa.createLead(TENANT, TipoPessoa.PF, null, nome, null, null, null);
    }

    @Test
    @DisplayName("monta o envelope com content mapeado, total do count e hasNext=true quando há próxima página")
    void deveMontarEnvelopeComProximaPagina() {
        List<Pessoa> page = IntStream.range(0, 50).mapToObj(i -> lead("Contato " + i)).toList();
        PessoaListCriteria criteria = PessoaListCriteria.ofStatus(StatusPessoa.LEAD);
        when(repository.list(TENANT, criteria, 50, 0)).thenReturn(page);
        when(repository.count(TENANT, criteria)).thenReturn(137L);

        PageResponse<PessoaView> result = useCase.list(TENANT, criteria, 50, 0);

        assertThat(result.content()).hasSize(50);
        assertThat(result.total()).isEqualTo(137L);
        assertThat(result.limit()).isEqualTo(50);
        assertThat(result.offset()).isEqualTo(0);
        assertThat(result.hasNext()).isTrue();
        assertThat(result.content().get(0).nomeContato()).isEqualTo("Contato 0");
    }

    @Test
    @DisplayName("hasNext=false na última página (offset + tamanho >= total)")
    void deveCalcularUltimaPagina() {
        List<Pessoa> page = List.of(lead("Único"));
        PessoaListCriteria criteria = PessoaListCriteria.ofStatus(StatusPessoa.CLIENTE);
        when(repository.list(TENANT, criteria, 50, 100)).thenReturn(page);
        when(repository.count(TENANT, criteria)).thenReturn(101L);

        PageResponse<PessoaView> result = useCase.list(TENANT, criteria, 50, 100);

        assertThat(result.hasNext()).isFalse();
        assertThat(result.content()).hasSize(1);
    }

    @Test
    @DisplayName("repassa os critérios de filtro/ordenação intactos para o repositório")
    void deveRepassarCriterios() {
        PessoaListCriteria criteria = new PessoaListCriteria(
            StatusPessoa.LEAD, "ana", TipoPessoa.PJ, "São Paulo", "SP", PessoaSort.NOME);
        when(repository.list(eq(TENANT), any(), eq(25), eq(0))).thenReturn(List.of());
        when(repository.count(eq(TENANT), any())).thenReturn(0L);

        useCase.list(TENANT, criteria, 25, 0);

        ArgumentCaptor<PessoaListCriteria> captor = ArgumentCaptor.forClass(PessoaListCriteria.class);
        verify(repository).list(eq(TENANT), captor.capture(), eq(25), eq(0));
        PessoaListCriteria sent = captor.getValue();
        assertThat(sent.status()).isEqualTo(StatusPessoa.LEAD);
        assertThat(sent.q()).isEqualTo("ana");
        assertThat(sent.tipoPessoa()).isEqualTo(TipoPessoa.PJ);
        assertThat(sent.cidade()).isEqualTo("São Paulo");
        assertThat(sent.uf()).isEqualTo("SP");
        assertThat(sent.sort()).isEqualTo(PessoaSort.NOME);
    }

    @Test
    @DisplayName("envelope vazio com total 0 quando não há resultados")
    void deveRetornarEnvelopeVazio() {
        PessoaListCriteria criteria = PessoaListCriteria.ofStatus(StatusPessoa.LEAD);
        when(repository.list(TENANT, criteria, 50, 0)).thenReturn(List.of());
        when(repository.count(TENANT, criteria)).thenReturn(0L);

        PageResponse<PessoaView> result = useCase.list(TENANT, criteria, 50, 0);

        assertThat(result.content()).isEmpty();
        assertThat(result.total()).isZero();
        assertThat(result.hasNext()).isFalse();
    }
}
