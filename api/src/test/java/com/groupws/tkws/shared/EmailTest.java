package com.groupws.tkws.shared;

import com.groupws.tkws.shared.domain.Email;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("Email — Value Object")
class EmailTest {

    @ParameterizedTest
    @ValueSource(strings = {
        "user@example.com",
        "first.last@company.com.br",
        "x@x.co"
    })
    @DisplayName("deve aceitar emails válidos")
    void deveAceitarValidos(String email) {
        Email vo = new Email(email);
        assertThat(vo.value()).isEqualTo(email.toLowerCase());
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "sem-arroba",
        "@semuser.com",
        "user@",
        "user@.com",
        "user @ com.com"
    })
    @DisplayName("deve rejeitar emails inválidos")
    void deveRejeitarInvalidos(String email) {
        assertThatThrownBy(() -> new Email(email))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("deve normalizar para lowercase")
    void deveNormalizarLowercase() {
        assertThat(new Email("USER@EXAMPLE.COM").value()).isEqualTo("user@example.com");
    }

    @Test
    @DisplayName("deve rejeitar null")
    void deveRejeitarNull() {
        assertThatThrownBy(() -> new Email(null))
            .isInstanceOf(NullPointerException.class);
    }

    @Test
    @DisplayName("deve rejeitar vazio")
    void deveRejeitarVazio() {
        assertThatThrownBy(() -> new Email("  "))
            .isInstanceOf(IllegalArgumentException.class);
    }
}
