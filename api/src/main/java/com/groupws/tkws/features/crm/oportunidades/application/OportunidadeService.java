package com.groupws.tkws.features.crm.oportunidades.application;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.features.crm.oportunidades.domain.exception.OportunidadeNotFoundException;
import com.groupws.tkws.features.crm.oportunidades.domain.model.Oportunidade;
import com.groupws.tkws.features.crm.oportunidades.domain.model.OportunidadeId;
import com.groupws.tkws.features.crm.oportunidades.domain.port.EtapaLookup;
import com.groupws.tkws.features.crm.oportunidades.domain.port.OportunidadeRepository;
import com.groupws.tkws.features.crm.oportunidades.domain.port.OrigemLookup;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.shared.page.PageResponse;
import com.groupws.tkws.shared.page.Pagination;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Orquestração de Oportunidades.
 *
 * Cuida da regra de movimentar para uma etapa de conversão: consulta a
 * etapa via {@link EtapaLookup} e passa a flag para o agregado, que decide
 * emitir o evento {@code OportunidadeMovedToConvertingEtapaEvent}. Um
 * listener em `pessoas` consome o evento e promove a Pessoa.
 */
@Service
public class OportunidadeService {

    private final OportunidadeRepository repository;
    private final EtapaLookup etapaLookup;
    private final OrigemLookup origemLookup;
    private final ApplicationEventPublisher eventPublisher;

    public OportunidadeService(OportunidadeRepository repository,
                               EtapaLookup etapaLookup,
                               OrigemLookup origemLookup,
                               ApplicationEventPublisher eventPublisher) {
        this.repository = repository;
        this.etapaLookup = etapaLookup;
        this.origemLookup = origemLookup;
        this.eventPublisher = eventPublisher;
    }

    private OrigemLookup.OrigemInfo requireOrigem(long tenantId, java.util.UUID origemId) {
        return origemLookup.findOrigem(tenantId, origemId)
            .orElseThrow(() -> new IllegalArgumentException("origem de negócio inválida: " + origemId));
    }

    @Transactional(readOnly = true)
    public PageResponse<OportunidadeView> list(long tenantId, PipelineId pipelineId, int limit, int offset) {
        List<OportunidadeView> content = repository.list(tenantId, pipelineId, limit, offset)
            .stream().map(OportunidadeView::from).toList();
        return PageResponse.of(content, Pagination.clampLimit(limit), Pagination.clampOffset(offset),
            repository.count(tenantId, pipelineId));
    }

    @Transactional(readOnly = true)
    public OportunidadeView findById(long tenantId, OportunidadeId id) {
        return repository.findById(tenantId, id)
            .map(OportunidadeView::from)
            .orElseThrow(() -> new OportunidadeNotFoundException(id));
    }

    @Transactional
    public OportunidadeView create(long tenantId, OportunidadeCommand cmd) {
        OrigemLookup.OrigemInfo origem = requireOrigem(tenantId, cmd.origemId());
        Oportunidade oportunidade = Oportunidade.create(
            tenantId,
            PipelineId.of(cmd.pipelineId()),
            EtapaId.of(cmd.etapaId()),
            cmd.pessoaId() != null ? PessoaId.of(cmd.pessoaId()) : null,
            cmd.ofertaId(), cmd.tipoPagamentoId(), cmd.empreendimentoId(),
            cmd.tipoProjetoId(), cmd.responsavelId(), cmd.parceiroId(),
            cmd.descricao(), cmd.valor(), cmd.metragemM2(),
            cmd.previsaoFechamento(), cmd.origemId(), origem.exigeParceiro(), origem.exigeDetalhe(),
            cmd.origemOutros(), cmd.notas()
        );

        // Se já foi criada diretamente numa etapa de conversão, dispara o evento.
        var etapaInfo = etapaLookup.findEtapa(tenantId, oportunidade.etapaId());
        if (etapaInfo.isPresent() && etapaInfo.get().converteLeadEmCliente() && oportunidade.pessoaId().isPresent()) {
            // Re-aplica moveToEtapa(self, true) para registrar o evento
            oportunidade.moveToEtapa(oportunidade.etapaId(), true);
        }

        Oportunidade saved = repository.save(oportunidade);
        publishEvents(saved);
        return OportunidadeView.from(saved);
    }

    @Transactional
    public OportunidadeView update(long tenantId, OportunidadeId id, OportunidadeCommand cmd) {
        Oportunidade oportunidade = repository.findById(tenantId, id)
            .orElseThrow(() -> new OportunidadeNotFoundException(id));

        // Atualiza detalhes (não muda etapa aqui · move via endpoint dedicado)
        OrigemLookup.OrigemInfo origem = requireOrigem(tenantId, cmd.origemId());
        oportunidade.updateDetalhes(
            cmd.descricao(), cmd.valor(), cmd.metragemM2(),
            cmd.previsaoFechamento(), cmd.origemId(), origem.exigeParceiro(), origem.exigeDetalhe(),
            cmd.origemOutros(), cmd.notas(),
            cmd.ofertaId(), cmd.tipoPagamentoId(), cmd.empreendimentoId(),
            cmd.tipoProjetoId(), cmd.responsavelId(),
            cmd.pessoaId() != null ? PessoaId.of(cmd.pessoaId()) : null,
            cmd.parceiroId()
        );

        // Se mudou a etapa, aplica a regra de conversão
        EtapaId novaEtapa = EtapaId.of(cmd.etapaId());
        boolean converte = etapaLookup.findEtapa(tenantId, novaEtapa)
            .map(EtapaLookup.EtapaInfo::converteLeadEmCliente)
            .orElse(false);
        oportunidade.moveToEtapa(novaEtapa, converte);

        Oportunidade saved = repository.save(oportunidade);
        publishEvents(saved);
        return OportunidadeView.from(saved);
    }

    @Transactional
    public OportunidadeView moveToEtapa(long tenantId, OportunidadeId id, EtapaId novaEtapa) {
        Oportunidade oportunidade = repository.findById(tenantId, id)
            .orElseThrow(() -> new OportunidadeNotFoundException(id));

        boolean converte = etapaLookup.findEtapa(tenantId, novaEtapa)
            .map(EtapaLookup.EtapaInfo::converteLeadEmCliente)
            .orElse(false);
        oportunidade.moveToEtapa(novaEtapa, converte);

        Oportunidade saved = repository.save(oportunidade);
        publishEvents(saved);
        return OportunidadeView.from(saved);
    }

    @Transactional
    public void remove(long tenantId, OportunidadeId id) {
        repository.delete(tenantId, id);
    }

    private void publishEvents(Oportunidade aggregate) {
        aggregate.pullDomainEvents().forEach(eventPublisher::publishEvent);
    }
}
