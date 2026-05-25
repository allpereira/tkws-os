package com.groupws.tkws.features.crm.oportunidades.application;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.features.crm.oportunidades.domain.exception.OportunidadeNotFoundException;
import com.groupws.tkws.features.crm.oportunidades.domain.model.Oportunidade;
import com.groupws.tkws.features.crm.oportunidades.domain.model.OportunidadeId;
import com.groupws.tkws.features.crm.oportunidades.domain.port.EtapaLookup;
import com.groupws.tkws.features.crm.oportunidades.domain.port.OportunidadeRepository;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
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
    private final ApplicationEventPublisher eventPublisher;

    public OportunidadeService(OportunidadeRepository repository,
                               EtapaLookup etapaLookup,
                               ApplicationEventPublisher eventPublisher) {
        this.repository = repository;
        this.etapaLookup = etapaLookup;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public List<OportunidadeView> list(long tenantId, PipelineId pipelineId) {
        List<Oportunidade> data = pipelineId != null
            ? repository.listByPipeline(tenantId, pipelineId)
            : repository.listAll(tenantId);
        return data.stream().map(OportunidadeView::from).toList();
    }

    @Transactional(readOnly = true)
    public OportunidadeView findById(long tenantId, OportunidadeId id) {
        return repository.findById(tenantId, id)
            .map(OportunidadeView::from)
            .orElseThrow(() -> new OportunidadeNotFoundException(id));
    }

    @Transactional
    public OportunidadeView create(long tenantId, OportunidadeCommand cmd) {
        Oportunidade oportunidade = Oportunidade.create(
            tenantId,
            PipelineId.of(cmd.pipelineId()),
            EtapaId.of(cmd.etapaId()),
            cmd.pessoaId() != null ? PessoaId.of(cmd.pessoaId()) : null,
            cmd.ofertaId(), cmd.tipoPagamentoId(), cmd.empreendimentoId(),
            cmd.tipoProjetoId(), cmd.responsavelId(),
            cmd.titulo(), cmd.descricao(), cmd.valor(), cmd.metragemM2(),
            cmd.prazoFechamento(), cmd.notas()
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
        oportunidade.updateDetalhes(
            cmd.titulo(), cmd.descricao(), cmd.valor(), cmd.metragemM2(),
            cmd.prazoFechamento(), cmd.notas(),
            cmd.ofertaId(), cmd.tipoPagamentoId(), cmd.empreendimentoId(),
            cmd.tipoProjetoId(), cmd.responsavelId(),
            cmd.pessoaId() != null ? PessoaId.of(cmd.pessoaId()) : null
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
