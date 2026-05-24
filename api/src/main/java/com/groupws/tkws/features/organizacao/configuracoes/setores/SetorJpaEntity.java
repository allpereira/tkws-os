package com.groupws.tkws.features.organizacao.configuracoes.setores;

import com.groupws.tkws.shared.crud.LookupJpaEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** Setores · ver ADR-020. */
@Entity
@Table(name = "setores")
class SetorJpaEntity extends LookupJpaEntity {}
