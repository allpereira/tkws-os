package com.groupws.tkws.features.organizacao.configuracoes.funcoespessoas;

import com.groupws.tkws.shared.crud.LookupJpaEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** Funções de Pessoas · ver ADR-020. */
@Entity
@Table(name = "funcoes_pessoas")
class FuncaoPessoaJpaEntity extends LookupJpaEntity {}
