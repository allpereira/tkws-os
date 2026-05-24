package com.groupws.tkws.features.organizacao.configuracoes.tiposempresa;

import com.groupws.tkws.shared.crud.LookupJpaEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** Tipos de Empresa · ver ADR-020. */
@Entity
@Table(name = "tipos_empresa")
class TipoEmpresaJpaEntity extends LookupJpaEntity {}
