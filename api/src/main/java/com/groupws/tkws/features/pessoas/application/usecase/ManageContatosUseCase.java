package com.groupws.tkws.features.pessoas.application.usecase;

import com.groupws.tkws.features.pessoas.application.dto.ContatoCommand;
import com.groupws.tkws.features.pessoas.application.dto.ContatoView;
import com.groupws.tkws.features.pessoas.domain.exception.ContatoNotFoundException;
import com.groupws.tkws.features.pessoas.domain.exception.PessoaNotFoundException;
import com.groupws.tkws.features.pessoas.domain.exception.RelacionamentoIncompativelException;
import com.groupws.tkws.features.pessoas.domain.model.Contato;
import com.groupws.tkws.features.pessoas.domain.model.ContatoId;
import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.model.TipoRelacionamento;
import com.groupws.tkws.features.pessoas.domain.port.ContatoRepository;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use case · escrita dos {@link Contato} de uma Pessoa (adicionar/editar/remover).
 *
 * Toda operação:
 *   1. Carrega a Pessoa dona do tenant (404 lógico se não existir).
 *   2. Valida que o {@code tipoRelacionamento} é compatível com o tipo da Pessoa
 *      (relacionamentos de PJ só em Pessoa PJ e vice-versa).
 *   3. Aplica a mutação e persiste.
 *
 * Leitura fica em {@link ListContatosUseCase}. Ver ADR-023.
 */
@Service
public class ManageContatosUseCase {

    private final PessoaRepository pessoaRepository;
    private final ContatoRepository contatoRepository;

    public ManageContatosUseCase(PessoaRepository pessoaRepository,
                                 ContatoRepository contatoRepository) {
        this.pessoaRepository = pessoaRepository;
        this.contatoRepository = contatoRepository;
    }

    @Transactional
    public ContatoView add(long tenantId, PessoaId pessoaId, ContatoCommand cmd) {
        Pessoa pessoa = loadPessoa(tenantId, pessoaId);
        validarRelacionamento(cmd.tipoRelacionamento(), pessoa);

        Contato contato = Contato.create(
            pessoaId, tenantId, cmd.nome(), cmd.email(), cmd.telefone(), cmd.tipoRelacionamento());
        return ContatoView.from(contatoRepository.save(contato));
    }

    @Transactional
    public ContatoView update(long tenantId, PessoaId pessoaId, ContatoId contatoId, ContatoCommand cmd) {
        Pessoa pessoa = loadPessoa(tenantId, pessoaId);
        validarRelacionamento(cmd.tipoRelacionamento(), pessoa);

        Contato contato = contatoRepository.findById(tenantId, contatoId)
            .filter(c -> c.pessoaId().equals(pessoaId))
            .orElseThrow(() -> new ContatoNotFoundException(contatoId));

        contato.update(cmd.nome(), cmd.email(), cmd.telefone(), cmd.tipoRelacionamento());
        return ContatoView.from(contatoRepository.save(contato));
    }

    @Transactional
    public void remove(long tenantId, PessoaId pessoaId, ContatoId contatoId) {
        // Garante que o contato existe e pertence à pessoa do tenant antes de remover.
        Contato contato = contatoRepository.findById(tenantId, contatoId)
            .filter(c -> c.pessoaId().equals(pessoaId))
            .orElseThrow(() -> new ContatoNotFoundException(contatoId));
        contatoRepository.deleteById(tenantId, contato.id());
    }

    private Pessoa loadPessoa(long tenantId, PessoaId pessoaId) {
        return pessoaRepository.findById(tenantId, pessoaId)
            .orElseThrow(() -> new PessoaNotFoundException(pessoaId));
    }

    private static void validarRelacionamento(TipoRelacionamento rel, Pessoa pessoa) {
        if (!rel.validoPara(pessoa.tipoPessoa())) {
            throw new RelacionamentoIncompativelException(rel, pessoa.tipoPessoa());
        }
    }
}
