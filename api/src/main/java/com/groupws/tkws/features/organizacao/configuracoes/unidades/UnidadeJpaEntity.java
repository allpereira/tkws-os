package com.groupws.tkws.features.organizacao.configuracoes.unidades;

import com.groupws.tkws.shared.crud.LookupJpaEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** Unidades · ver ADR-020. */
@Entity
@Table(name = "unidades")
class UnidadeJpaEntity extends LookupJpaEntity {}
