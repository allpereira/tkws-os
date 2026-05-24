package com.groupws.tkws.features.organizacao.configuracoes.tiposprojeto;

import com.groupws.tkws.shared.crud.LookupJpaEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** Tipos de Projeto · ver ADR-020. */
@Entity
@Table(name = "tipos_projeto")
class TipoProjetoJpaEntity extends LookupJpaEntity {}
