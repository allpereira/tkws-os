package com.groupws.tkws.features.organizacao.configuracoes.ofertas;

import com.groupws.tkws.shared.crud.LookupJpaEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** Catálogo de Ofertas · ver ADR-020. */
@Entity
@Table(name = "ofertas")
class OfertaJpaEntity extends LookupJpaEntity {}
