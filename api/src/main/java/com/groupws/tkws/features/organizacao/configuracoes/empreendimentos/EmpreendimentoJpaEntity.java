package com.groupws.tkws.features.organizacao.configuracoes.empreendimentos;

import com.groupws.tkws.shared.crud.LookupJpaEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** Empreendimentos · ver ADR-020. */
@Entity
@Table(name = "empreendimentos")
class EmpreendimentoJpaEntity extends LookupJpaEntity {}
