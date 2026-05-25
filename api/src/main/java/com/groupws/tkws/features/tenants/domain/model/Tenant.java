package com.groupws.tkws.features.tenants.domain.model;

import com.groupws.tkws.features.tenants.domain.event.TenantCreatedEvent;
import com.groupws.tkws.features.tenants.domain.exception.InvalidTenantSlugException;
import com.groupws.tkws.shared.domain.AggregateRoot;

import java.time.Instant;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Aggregate Root representando um Tenant (escritório de arquitetura cliente).
 *
 * `id` é BIGINT gerado pelo banco (IDENTITY column). Antes do primeiro save,
 * o agregado é "transiente" (id null) — o adapter de persistência atribui o
 * id após o INSERT e dispara `TenantCreatedEvent`.
 *
 * Ver V1__initial_schema.sql, ADR-014, docs/13-ONBOARDING.md.
 */
public final class Tenant extends AggregateRoot<TenantId> {

    private static final Pattern SLUG_PATTERN = Pattern.compile("^[a-z0-9]+(?:-[a-z0-9]+)*$");

    /** null antes do primeiro save (transient). */
    private TenantId id;
    private final String zitadelOrgId;
    private String name;
    private String slug;
    private boolean active;
    private final Instant createdAt;
    private Instant updatedAt;

    private Tenant(TenantId id, String zitadelOrgId, String name, String slug,
                   boolean active, Instant createdAt, Instant updatedAt) {
        this.id = id; // pode ser null em estado transiente
        this.zitadelOrgId = Objects.requireNonNull(zitadelOrgId, "zitadelOrgId");
        this.name = validateName(name);
        this.slug = validateSlug(slug);
        this.active = active;
        this.createdAt = Objects.requireNonNull(createdAt, "createdAt");
        this.updatedAt = Objects.requireNonNull(updatedAt, "updatedAt");
    }

    /**
     * Factory para criar um novo Tenant (transiente · id ainda não atribuído).
     * O evento de criação é registrado pelo adapter após o INSERT, quando o
     * id real está disponível.
     */
    public static Tenant create(String zitadelOrgId, String name, String slug) {
        Instant now = Instant.now();
        return new Tenant(null, zitadelOrgId, name, slug, true, now, now);
    }

    /**
     * Factory para reconstituir Tenant a partir da persistência (sem registrar eventos).
     */
    public static Tenant reconstitute(TenantId id, String zitadelOrgId, String name, String slug,
                                      boolean active, Instant createdAt, Instant updatedAt) {
        Objects.requireNonNull(id, "id em reconstitute · use create() para novos");
        return new Tenant(id, zitadelOrgId, name, slug, active, createdAt, updatedAt);
    }

    /**
     * Chamado pelo adapter de persistência APÓS o INSERT, quando o id BIGINT
     * gerado pelo banco está disponível. Dispara o evento de criação.
     *
     * Idempotente: se já tem id, no-op.
     */
    public void assignIdIfTransient(TenantId newId) {
        if (this.id != null) return;
        Objects.requireNonNull(newId, "newId");
        this.id = newId;
        registerEvent(new TenantCreatedEvent(newId, name, slug, this.createdAt));
    }

    public boolean isTransient() {
        return this.id == null;
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

    /**
     * Retorna o id quando já persistido. Use {@link #idOrNull()} ou
     * {@link #isTransient()} quando o estado pode ser transiente.
     */
    @Override
    public TenantId id() {
        if (id == null) throw new IllegalStateException("Tenant ainda transiente · sem id");
        return id;
    }

    public Optional<TenantId> idOpt() { return Optional.ofNullable(id); }
    public TenantId idOrNull() { return id; }
    public String zitadelOrgId() { return zitadelOrgId; }
    public String name() { return name; }
    public String slug() { return slug; }
    public boolean active() { return active; }
    public Instant createdAt() { return createdAt; }
    public Instant updatedAt() { return updatedAt; }
}
