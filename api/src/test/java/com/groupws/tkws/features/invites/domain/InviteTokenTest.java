package com.groupws.tkws.features.invites.domain;

import com.groupws.tkws.features.invites.domain.model.InviteToken;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("InviteToken — token de uso único")
class InviteTokenTest {

    @Test
    @DisplayName("generate produz tokens distintos e hash hex de 64 chars")
    void generateDistinto() {
        InviteToken a = InviteToken.generate();
        InviteToken b = InviteToken.generate();

        assertThat(a.value()).isNotBlank().isNotEqualTo(b.value());
        assertThat(a.hashHex()).hasSize(64).matches("[0-9a-f]+");
    }

    @Test
    @DisplayName("hash é determinístico para o mesmo valor")
    void hashDeterministico() {
        InviteToken token = InviteToken.generate();
        assertThat(token.hashHex()).isEqualTo(InviteToken.hashOf(token.value()));
    }

    @Test
    @DisplayName("of rejeita valor vazio")
    void ofRejeitaVazio() {
        assertThatThrownBy(() -> InviteToken.of("  ")).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("toString mascara o valor (não vaza em log)")
    void toStringMascara() {
        InviteToken token = InviteToken.generate();
        assertThat(token.toString()).doesNotContain(token.value()).contains("***");
    }
}
