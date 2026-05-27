package com.groupws.tkws.features.crm.oportunidades.domain.model;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class OportunidadeOrigemTest {

    private static final PipelineId PIPELINE = PipelineId.of(UUID.randomUUID());
    private static final EtapaId ETAPA = EtapaId.of(UUID.randomUUID());

    @Test
    void indicaoParceiro_exigeParceiroId() {
        assertThatThrownBy(() -> Oportunidade.create(
            1L, PIPELINE, ETAPA,
            null, null, null, null, null, null,
            null,
            "Negócio teste", null, null, null,
            OrigemNegocio.INDICACAO_PARCEIRO, null, null
        )).isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("parceiroId");
    }

    @Test
    void outros_exigeOrigemOutros() {
        assertThatThrownBy(() -> Oportunidade.create(
            1L, PIPELINE, ETAPA,
            null, null, null, null, null, null,
            null,
            "Negócio teste", null, null, null,
            OrigemNegocio.OUTROS, "  ", null
        )).isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("origemOutros");
    }

    @Test
    void reconstitute_permiteLegadoOutrosSemDetalhe() {
        var o = Oportunidade.reconstitute(
            OportunidadeId.generate(),
            1L, PIPELINE, ETAPA,
            null, null, null, null, null, null,
            null,
            "Negócio legado", null, null, null,
            OrigemNegocio.OUTROS, null, null,
            Instant.now(), Instant.now()
        );
        assertThat(o.origem()).isEqualTo(OrigemNegocio.OUTROS);
    }
}
