package com.groupws.tkws.features.crm.oportunidades.domain.model;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.features.crm.oportunidades.domain.event.OportunidadeMovedToConvertingEtapaEvent;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.shared.domain.AggregateRoot;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

/**
 * Aggregate Root · Oportunidade (= Negócio) no funil.
 *
 * `tenantId` é o BIGINT local (PK em tenants.id).
 *
 * Vive dentro de um Pipeline + Etapa. A regra de promoção LEAD→CLIENTE
 * (ADR-018) é disparada por este agregado quando `moveToEtapa()` recebe
 * uma etapa marcada com `converteLeadEmCliente=true` — emite o evento
 * {@link OportunidadeMovedToConvertingEtapaEvent}, consumido pelo módulo
 * Pessoas que promove o lead.
 *
 * A origem do negócio é um FK ({@code origemId}) para a configuração
 * Origens de Negócio (ADR-025). As regras condicionais (exige parceiro /
 * exige detalhe) não moram na origem em si — o {@code OportunidadeService}
 * consulta as flags via {@code OrigemLookup} e as passa para `create` /
 * `updateDetalhes`, que então validam.
 */
public final class Oportunidade extends AggregateRoot<OportunidadeId> {

    private final OportunidadeId id;
    private final long tenantId;
    private PipelineId pipelineId;
    private EtapaId etapaId;
    private PessoaId pessoaId;
    private UUID ofertaId;
    private UUID tipoPagamentoId;
    private UUID empreendimentoId;
    private UUID tipoProjetoId;
    private UUID responsavelId;
    private UUID parceiroId;
    private String descricao;
    private BigDecimal valor;
    private BigDecimal metragemM2;
    private LocalDate previsaoFechamento;
    private UUID origemId;
    private String origemOutros;
    private String notas;
    private final Instant createdAt;
    private Instant updatedAt;

    private Oportunidade(OportunidadeId id, long tenantId, PipelineId pipelineId, EtapaId etapaId,
                         PessoaId pessoaId, UUID ofertaId, UUID tipoPagamentoId,
                         UUID empreendimentoId, UUID tipoProjetoId, UUID responsavelId,
                         UUID parceiroId, String descricao, BigDecimal valor, BigDecimal metragemM2,
                         LocalDate previsaoFechamento, UUID origemId, String origemOutros,
                         String notas, Instant createdAt, Instant updatedAt) {
        this.id = Objects.requireNonNull(id);
        if (tenantId <= 0) {
            throw new IllegalArgumentException("tenantId deve ser positivo · recebeu: " + tenantId);
        }
        this.tenantId = tenantId;
        this.pipelineId = Objects.requireNonNull(pipelineId, "pipelineId");
        this.etapaId = Objects.requireNonNull(etapaId, "etapaId");
        this.pessoaId = pessoaId;
        this.ofertaId = ofertaId;
        this.tipoPagamentoId = tipoPagamentoId;
        this.empreendimentoId = empreendimentoId;
        this.tipoProjetoId = tipoProjetoId;
        this.responsavelId = responsavelId;
        this.parceiroId = parceiroId;
        this.descricao = required(descricao, "descricao");
        this.valor = valor == null ? BigDecimal.ZERO : valor;
        this.metragemM2 = metragemM2;
        this.previsaoFechamento = previsaoFechamento;
        this.origemId = Objects.requireNonNull(origemId, "origemId");
        this.origemOutros = blankToNull(origemOutros);
        this.notas = blankToNull(notas);
        this.createdAt = Objects.requireNonNull(createdAt);
        this.updatedAt = Objects.requireNonNull(updatedAt);
    }

    public static Oportunidade create(long tenantId, PipelineId pipelineId, EtapaId etapaId,
                                      PessoaId pessoaId, UUID ofertaId, UUID tipoPagamentoId,
                                      UUID empreendimentoId, UUID tipoProjetoId, UUID responsavelId,
                                      UUID parceiroId, String descricao, BigDecimal valor,
                                      BigDecimal metragemM2, LocalDate previsaoFechamento,
                                      UUID origemId, boolean origemExigeParceiro, boolean origemExigeDetalhe,
                                      String origemOutros, String notas) {
        Instant now = Instant.now();
        UUID origemEfetiva = Objects.requireNonNull(origemId, "origemId");
        UUID parceiroEfetivo = normalizeParceiroId(origemExigeParceiro, parceiroId);
        String origemOutrosEfetiva = normalizeOrigemOutros(origemExigeDetalhe, origemOutros);
        validateOrigem(origemExigeParceiro, origemExigeDetalhe, origemOutrosEfetiva, parceiroEfetivo);
        return new Oportunidade(OportunidadeId.generate(), tenantId, pipelineId, etapaId,
            pessoaId, ofertaId, tipoPagamentoId, empreendimentoId, tipoProjetoId, responsavelId,
            parceiroEfetivo, descricao, valor, metragemM2, previsaoFechamento,
            origemEfetiva, origemOutrosEfetiva, notas, now, now);
    }

    public static Oportunidade reconstitute(OportunidadeId id, long tenantId, PipelineId pipelineId,
                                            EtapaId etapaId, PessoaId pessoaId, UUID ofertaId,
                                            UUID tipoPagamentoId, UUID empreendimentoId,
                                            UUID tipoProjetoId, UUID responsavelId, UUID parceiroId,
                                            String descricao, BigDecimal valor, BigDecimal metragemM2,
                                            LocalDate previsaoFechamento, UUID origemId,
                                            String origemOutros, String notas,
                                            Instant createdAt, Instant updatedAt) {
        return new Oportunidade(id, tenantId, pipelineId, etapaId, pessoaId, ofertaId,
            tipoPagamentoId, empreendimentoId, tipoProjetoId, responsavelId, parceiroId,
            descricao, valor, metragemM2, previsaoFechamento, origemId, origemOutros, notas,
            createdAt, updatedAt);
    }

    public void moveToEtapa(EtapaId novaEtapa, boolean novaEtapaConverteLead) {
        Objects.requireNonNull(novaEtapa, "novaEtapa");
        boolean mudou = !novaEtapa.equals(this.etapaId);
        this.etapaId = novaEtapa;
        this.updatedAt = Instant.now();
        if (mudou && novaEtapaConverteLead && pessoaId != null) {
            registerEvent(new OportunidadeMovedToConvertingEtapaEvent(
                id, pessoaId, tenantId, this.updatedAt
            ));
        }
    }

    public void updateDetalhes(String descricao, BigDecimal valor, BigDecimal metragemM2,
                               LocalDate previsaoFechamento, UUID origemId, boolean origemExigeParceiro,
                               boolean origemExigeDetalhe, String origemOutros, String notas,
                               UUID ofertaId, UUID tipoPagamentoId, UUID empreendimentoId,
                               UUID tipoProjetoId, UUID responsavelId, PessoaId pessoaId,
                               UUID parceiroId) {
        this.descricao = required(descricao, "descricao");
        this.valor = valor == null ? BigDecimal.ZERO : valor;
        this.metragemM2 = metragemM2;
        this.previsaoFechamento = previsaoFechamento;
        this.origemId = Objects.requireNonNull(origemId, "origemId");
        this.origemOutros = normalizeOrigemOutros(origemExigeDetalhe, origemOutros);
        this.parceiroId = normalizeParceiroId(origemExigeParceiro, parceiroId);
        this.notas = blankToNull(notas);
        this.ofertaId = ofertaId;
        this.tipoPagamentoId = tipoPagamentoId;
        this.empreendimentoId = empreendimentoId;
        this.tipoProjetoId = tipoProjetoId;
        this.responsavelId = responsavelId;
        this.pessoaId = pessoaId;
        this.updatedAt = Instant.now();
        validateOrigem(origemExigeParceiro, origemExigeDetalhe, this.origemOutros, this.parceiroId);
    }

    private static void validateOrigem(boolean exigeParceiro, boolean exigeDetalhe,
                                       String origemOutros, UUID parceiroId) {
        if (exigeParceiro && parceiroId == null) {
            throw new IllegalArgumentException("parceiroId é obrigatório para esta origem de negócio");
        }
        if (exigeDetalhe && (origemOutros == null || origemOutros.isBlank())) {
            throw new IllegalArgumentException("origemOutros é obrigatório para esta origem de negócio");
        }
    }

    private static UUID normalizeParceiroId(boolean exigeParceiro, UUID parceiroId) {
        return exigeParceiro ? parceiroId : null;
    }

    private static String normalizeOrigemOutros(boolean exigeDetalhe, String origemOutros) {
        return exigeDetalhe ? required(origemOutros, "origemOutros") : null;
    }

    private static String required(String s, String f) {
        Objects.requireNonNull(s, f);
        String t = s.trim();
        if (t.isEmpty()) throw new IllegalArgumentException(f + " não pode ser vazio");
        return t;
    }

    private static String blankToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    @Override public OportunidadeId id() { return id; }
    public long tenantId() { return tenantId; }
    public PipelineId pipelineId() { return pipelineId; }
    public EtapaId etapaId() { return etapaId; }
    public Optional<PessoaId> pessoaId() { return Optional.ofNullable(pessoaId); }
    public Optional<UUID> ofertaId() { return Optional.ofNullable(ofertaId); }
    public Optional<UUID> tipoPagamentoId() { return Optional.ofNullable(tipoPagamentoId); }
    public Optional<UUID> empreendimentoId() { return Optional.ofNullable(empreendimentoId); }
    public Optional<UUID> tipoProjetoId() { return Optional.ofNullable(tipoProjetoId); }
    public Optional<UUID> responsavelId() { return Optional.ofNullable(responsavelId); }
    public Optional<UUID> parceiroId() { return Optional.ofNullable(parceiroId); }
    public String descricao() { return descricao; }
    public BigDecimal valor() { return valor; }
    public Optional<BigDecimal> metragemM2() { return Optional.ofNullable(metragemM2); }
    public Optional<LocalDate> previsaoFechamento() { return Optional.ofNullable(previsaoFechamento); }
    public UUID origemId() { return origemId; }
    public Optional<String> origemOutros() { return Optional.ofNullable(origemOutros); }
    public Optional<String> notas() { return Optional.ofNullable(notas); }
    public Instant createdAt() { return createdAt; }
    public Instant updatedAt() { return updatedAt; }
}
