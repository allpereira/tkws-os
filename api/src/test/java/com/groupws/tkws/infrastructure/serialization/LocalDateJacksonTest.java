package com.groupws.tkws.infrastructure.serialization;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

/**
 * Contrato JSON de {@link LocalDate} · alinhado a {@code docs/15-API-BEST-PRACTICES.md} §5.
 * Mesma config que Spring Boot: {@code JavaTimeModule} + datas como string ISO, não array.
 */
class LocalDateJacksonTest {

    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Test
    void serializesAsIsoDateStringWithoutTime() throws Exception {
        String json = mapper.writeValueAsString(LocalDate.of(2026, 6, 30));
        assertThat(json).isEqualTo("\"2026-06-30\"");
    }

    @Test
    void deserializesIsoDateString() throws Exception {
        LocalDate date = mapper.readValue("\"2026-06-30\"", LocalDate.class);
        assertThat(date).isEqualTo(LocalDate.of(2026, 6, 30));
    }
}
