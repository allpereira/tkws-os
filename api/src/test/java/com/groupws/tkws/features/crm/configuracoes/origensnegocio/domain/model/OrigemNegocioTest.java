package com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.model;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class OrigemNegocioTest {

    @Test
    void create_aplicaDefaults_eGeraId() {
        OrigemNegocio o = OrigemNegocio.create(1L, "ORI-001", "Google", false, false, true);

        assertThat(o.id()).isNotNull();
        assertThat(o.tenantId()).isEqualTo(1L);
        assertThat(o.codigo()).isEqualTo("ORI-001");
        assertThat(o.nome()).isEqualTo("Google");
        assertThat(o.exigeParceiro()).isFalse();
        assertThat(o.exigeDetalhe()).isFalse();
        assertThat(o.ativo()).isTrue();
        assertThat(o.createdAt()).isNotNull();
        assertThat(o.updatedAt()).isNotNull();
    }

    @Test
    void create_guardaFlags() {
        OrigemNegocio o = OrigemNegocio.create(1L, "ORI-001", "Indicação de Parceiro", true, false, true);
        assertThat(o.exigeParceiro()).isTrue();
        assertThat(o.exigeDetalhe()).isFalse();
    }

    @Test
    void create_codigoEnomeObrigatorios() {
        assertThatThrownBy(() -> OrigemNegocio.create(1L, "  ", "Google", false, false, true))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("codigo");
        assertThatThrownBy(() -> OrigemNegocio.create(1L, "ORI-001", "  ", false, false, true))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("nome");
    }

    @Test
    void create_tenantIdDeveSerPositivo() {
        assertThatThrownBy(() -> OrigemNegocio.create(0L, "ORI-001", "Google", false, false, true))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("tenantId");
    }

    @Test
    void update_alteraCamposEtouchUpdatedAt() throws InterruptedException {
        OrigemNegocio o = OrigemNegocio.create(1L, "ORI-001", "Google", false, false, true);
        var antes = o.updatedAt();
        Thread.sleep(1);

        o.update("ORI-001", "Google Ads", true, true, false);

        assertThat(o.nome()).isEqualTo("Google Ads");
        assertThat(o.exigeParceiro()).isTrue();
        assertThat(o.exigeDetalhe()).isTrue();
        assertThat(o.ativo()).isFalse();
        assertThat(o.updatedAt()).isAfter(antes);
    }
}
