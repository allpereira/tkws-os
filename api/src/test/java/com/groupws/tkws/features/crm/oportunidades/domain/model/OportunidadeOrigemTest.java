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
    private static final UUID ORIGEM = UUID.randomUUID();

    @Test
    void origemQueExigeParceiro_semParceiro_falha() {
        assertThatThrownBy(() -> Oportunidade.create(
            1L, PIPELINE, ETAPA,
            null, null, null, null, null, null,
            null,
            "Negócio teste", null, null, null,
            ORIGEM, true, false, null, null
        )).isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("parceiroId");
    }

    @Test
    void origemQueExigeDetalhe_semDetalhe_falha() {
        assertThatThrownBy(() -> Oportunidade.create(
            1L, PIPELINE, ETAPA,
            null, null, null, null, null, null,
            null,
            "Negócio teste", null, null, null,
            ORIGEM, false, true, "  ", null
        )).isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("origemOutros");
    }

    @Test
    void origemSemFlags_naoExigeNada() {
        var o = Oportunidade.create(
            1L, PIPELINE, ETAPA,
            null, null, null, null, null, null,
            null,
            "Negócio simples", null, null, null,
            ORIGEM, false, false, null, null
        );
        assertThat(o.origemId()).isEqualTo(ORIGEM);
        assertThat(o.parceiroId()).isEmpty();
        assertThat(o.origemOutros()).isEmpty();
    }

    @Test
    void reconstitute_permiteLegadoSemDetalhe() {
        var o = Oportunidade.reconstitute(
            OportunidadeId.generate(),
            1L, PIPELINE, ETAPA,
            null, null, null, null, null, null,
            null,
            "Negócio legado", null, null, null,
            ORIGEM, null, null,
            Instant.now(), Instant.now()
        );
        assertThat(o.origemId()).isEqualTo(ORIGEM);
    }
}
