package com.groupws.tkws.features.pessoas.application.usecase;

import com.groupws.tkws.features.pessoas.application.dto.DedupResult;
import com.groupws.tkws.features.pessoas.application.dto.PessoaView;
import com.groupws.tkws.features.pessoas.domain.model.Documento;
import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Use case · detectar duplicidade ANTES de criar uma Pessoa nova.
 *
 * Lógica (ver ADR-018):
 *   1. Se documento informado → busca exata. Match exato bloqueia criação
 *      duplicada (frontend reusa o cadastro existente).
 *   2. Senão → busca soft por email/celular. Pode retornar várias.
 *      Frontend mostra candidatos e deixa o vendedor decidir.
 *
 * Resposta única estruturada via `DedupResult`.
 */
@Service
public class CheckDuplicidadePessoaUseCase {

    private final PessoaRepository repository;

    public CheckDuplicidadePessoaUseCase(PessoaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public DedupResult execute(UUID tenantId, TipoPessoa tipoPessoa, String documentoRaw,
                               String email, String celular) {
        // Tentativa 1 · documento exato
        if (documentoRaw != null && !documentoRaw.isBlank() && tipoPessoa != null) {
            try {
                Documento documento = Documento.of(tipoPessoa, documentoRaw);
                Optional<Pessoa> exact = repository.findByDocumento(tenantId, documento.value());
                if (exact.isPresent()) {
                    return new DedupResult(PessoaView.from(exact.get()), List.of());
                }
            } catch (RuntimeException ignore) {
                // Documento mal-formatado → não busca exato · cai pra soft
            }
        }

        // Tentativa 2 · email/celular (soft match · pode retornar vários)
        String celularNormalizado = celular != null ? celular.replaceAll("\\D", "") : null;
        boolean temEmail = email != null && !email.isBlank();
        boolean temCelular = celularNormalizado != null && !celularNormalizado.isBlank();

        if (!temEmail && !temCelular) {
            return new DedupResult(null, List.of());
        }

        List<Pessoa> matches = repository.findByEmailOuCelular(tenantId, email, celularNormalizado);
        List<PessoaView> views = matches.stream().map(PessoaView::from).toList();
        return new DedupResult(null, views);
    }
}
