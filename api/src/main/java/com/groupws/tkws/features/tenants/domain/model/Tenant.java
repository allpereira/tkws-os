package com.groupws.tkws.features.tenants.domain.model;

import com.groupws.tkws.features.tenants.domain.event.TenantCreatedEvent;
import com.groupws.tkws.features.tenants.domain.exception.InvalidTenantSlugException;
import com.groupws.tkws.shared.domain.AggregateRoot;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Aggregate Root representando um Tenant (escritório de arquitetura cliente).
 * Encapsula invariantes: slug válido, nome não vazio, mapeamento com Zitadel org.
 *
 * NOTA: Coluna `status` (TenantStatus enum) foi adicionada via migration V3 mas a
 * implementação completa do workflow (PENDING/ACTIVE/REJECTED/SUSPENDED) vem na
 * feature `onboarding-v1`. Hoje, factory `create()` produz tenant ACTIVE diretamente
 * (compatibilidade com fluxo system_admin atual). Endpoint de onboarding público vai
 * adicionar factory `requestRegistration(...)` que produz PENDING.
 *
 * Ver ADR-014 e docs/13-ONBOARDING.md.
 */
public final class Tenant extends AggregateRoot<TenantId> {

    private static final Pattern SLUG_PATTERN = Pattern.compile("^[a-z0-9]+(?:-[a-z0-9]+)*$");

    private final TenantId id;
    private final String zitadelOrgId;
    private String name;
    private String slug;
    private boolean active;
    private final Instant createdAt;
    private Instant updatedAt;

    private Tenant(TenantId id, String zitadelOrgId, String name, String slug,
                   boolean active, Instant createdAt, Instant updatedAt) {
        this.id = Objects.requireNonNull(id, "id");
        this.zitadelOrgId = Objects.requireNonNull(zitadelOrgId, "zitadelOrgId");
        this.name = validateName(name);
        this.slug = validateSlug(slug);
        this.active = active;
        this.createdAt = Objects.requireNonNull(createdAt, "createdAt");
        this.updatedAt = Objects.requireNonNull(updatedAt, "updatedAt");
    }

    /**
     * Factory para criar um novo Tenant (registra evento de criação).
     */
    public static Tenant create(String zitadelOrgId, String name, String slug) {
        Instant now = Instant.now();
        TenantId id = TenantId.generate();
        Tenant tenant = new Tenant(id, zitadelOrgId, name, slug, true, now, now);
        tenant.registerEvent(new TenantCreatedEvent(id, name, slug, now));
        return tenant;
    }

    /**
     * Factory para reconstituir Tenant a partir da persistência (sem registrar eventos).
     */
    public static Tenant reconstitute(TenantId id, String zitadelOrgId, String name, String slug,
                                      boolean active, Instant createdAt, Instant updatedAt) {
        return new Tenant(id, zitadelOrgId, name, slug, active, createdAt, updatedAt);
    }

    public void rename(String newName) {
        this.name = validateName(newName);
        this.updatedAt = Instant.now();
    }

    public void deactivate() {
        if (!active) return;
        this.active = false;
        this.updatedAt = Instant.now();
    }

    public void activate() {
        if (active) return;
        this.active = true;
        this.updatedAt = Instant.now();
    }

    private String validateName(String name) {
        Objects.requireNonNull(name, "name");
        if (name.isBlank()) throw new IllegalArgumentException("Nome do tenant não pode ser vazio");
        if (name.length() > 255) throw new IllegalArgumentException("Nome muito longo (máximo 255)");
        return name.trim();
    }

    private String validateSlug(String slug) {
        Objects.requireNonNull(slug, "slug");
        if (!SLUG_PATTERN.matcher(slug).matches()) {
            throw new InvalidTenantSlugException(slug);
        }
        return slug;
    }

    @Override public TenantId id() { return id; }
    public String zitadelOrgId() { return zitadelOrgId; }
    public String name() { return name; }
    public String slug() { return slug; }
    public boolean active() { return active; }
    public Instant createdAt() { return createdAt; }
    public Instant updatedAt() { return updatedAt; }
}
