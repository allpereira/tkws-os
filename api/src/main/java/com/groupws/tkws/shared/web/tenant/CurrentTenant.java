package com.groupws.tkws.shared.web.tenant;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Anota o parâmetro de um método de controller que deve ser injetado com
 * o {@link TenantContext} da request.
 *
 * Resolvido por {@link CurrentTenantArgumentResolver}:
 *   - Padrão: extrai `zitadel_org_id` do JWT e resolve o UUID local.
 *   - SYSTEM_ADMIN: pode passar header `X-Tenant-Id` para atuar em qualquer tenant
 *     (auditado).
 *
 * Exemplo:
 *   {@code @PostMapping ... public ... create(@CurrentTenant TenantContext tenant, ...) }
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentTenant {}
