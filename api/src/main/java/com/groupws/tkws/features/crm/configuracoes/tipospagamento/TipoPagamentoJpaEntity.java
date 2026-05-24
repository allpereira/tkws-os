package com.groupws.tkws.features.crm.configuracoes.tipospagamento;

import com.groupws.tkws.shared.crud.LookupJpaEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** Tipos de Pagamento · ver ADR-020. */
@Entity
@Table(name = "tipos_pagamento")
class TipoPagamentoJpaEntity extends LookupJpaEntity {}
