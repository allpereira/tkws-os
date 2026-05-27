package com.groupws.tkws.features.invites.domain.model;

import com.groupws.tkws.features.invites.domain.event.InviteIssuedEvent;
import com.groupws.tkws.features.invites.domain.exception.InviteNotAcceptableException;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import com.groupws.tkws.shared.domain.AggregateRoot;

import java.time.Instant;
import java.util.Objects;

/**
 * Aggregate Root: convite de membro para um tenant existente.
 *
 * <p>Invariantes:
 * <ul>
 *   <li>token_hash só muda via {@link #rotateToken} (reenvio), sempre em estado PENDING</li>
 *   <li>status evolui apenas PENDING → ACCEPTED/EXPIRED/REVOKED (terminal)</li>
 *   <li>expires_at no futuro no momento da criação / rotação</li>
 *   <li>email normalizado pra lowercase</li>
 * </ul>
 *
 * <p>O token claro NÃO mora aqui — só o hash. O caller gera o token via
 * {@link InviteToken#generate()}, usa o {@code .value()} pra enviar no email, e
 * passa o {@code .hashHex()} pro construtor da fábrica.
 *
 * Ver ADR-016.
 */
public final class Invite extends AggregateRoot<InviteId> {

    private final InviteId id;
    private final TenantId tenantId;
    private final String email;
    private final String fullName;
    private final InviteRole role;
    private String tokenHash;
    private InviteStatus status;
    private Instant expiresAt;
    private final java.util.UUID createdByUserId;
    private final Instant createdAt;
    private Instant acceptedAt;
    private Instant revokedAt;
    private String zitadelUserId;

    private Invite(InviteId id, TenantId tenantId, String email, String fullName,
                   InviteRole role, String tokenHash, InviteStatus status,
                   Instant expiresAt, java.util.UUID createdByUserId,
                   Instant createdAt, Instant acceptedAt, Instant revokedAt,
                   String zitadelUserId) {
        this.id = Objects.requireNonNull(id, "id");
        this.tenantId = Objects.requireNonNull(tenantId, "tenantId");
        this.email = Objects.requireNonNull(email, "email").trim().toLowerCase();
        this.fullName = fullName != null && !fullName.isBlank() ? fullName.trim() : null;
        this.role = Objects.requireNonNull(role, "role");
        this.tokenHash = Objects.requireNonNull(tokenHash, "tokenHash");
        this.status = Objects.requireNonNull(status, "status");
        this.expiresAt = Objects.requireNonNull(expiresAt, "expiresAt");
        this.createdByUserId = createdByUserId;
        this.createdAt = Objects.requireNonNull(createdAt, "createdAt");
        this.acceptedAt = acceptedAt;
        this.revokedAt = revokedAt;
        this.zitadelUserId = zitadelUserId;
    }

    /** Cria um novo convite e registra evento de domínio. */
    public static Invite issue(TenantId tenantId, String email, String fullName,
                               InviteRole role, String tokenHash, java.time.Duration ttl,
                               java.util.UUID createdByUserId) {
        if (ttl == null || ttl.isZero() || ttl.isNegative()) {
            throw new IllegalArgumentException("ttl deve ser positivo");
        }
        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("email inválido");
        }
        Instant now = Instant.now();
        Invite invite = new Invite(
            InviteId.generate(), tenantId, email, fullName, role,
            tokenHash, InviteStatus.PENDING,
            now.plus(ttl), createdByUserId, now, null, null, null
        );
        invite.registerEvent(new InviteIssuedEvent(
            invite.id, tenantId, invite.email, invite.fullName, role, invite.expiresAt, now
        ));
        return invite;
    }

    /** Reconstitui um invite a partir da persistência (sem eventos). */
    public static Invite reconstitute(InviteId id, TenantId tenantId, String email,
                                      String fullName, InviteRole role, String tokenHash,
                                      InviteStatus status, Instant expiresAt,
                                      java.util.UUID createdByUserId, Instant createdAt,
                                      Instant acceptedAt, Instant revokedAt,
                                      String zitadelUserId) {
        return new Invite(id, tenantId, email, fullName, role, tokenHash, status,
            expiresAt, createdByUserId, createdAt, acceptedAt, revokedAt, zitadelUserId);
    }

    /** Marca o invite como aceito. Idempotente: lança se já está em estado terminal. */
    public void accept(String zitadelUserId) {
        ensureAcceptable();
        Objects.requireNonNull(zitadelUserId, "zitadelUserId");
        this.status = InviteStatus.ACCEPTED;
        this.acceptedAt = Instant.now();
        this.zitadelUserId = zitadelUserId;
    }

    /** Admin cancela um invite antes do aceite. */
    public void revoke() {
        ensureAcceptable();
        this.status = InviteStatus.REVOKED;
        this.revokedAt = Instant.now();
    }

    /**
     * Rotaciona o token (reenvio do convite) e estende a validade. Só é
     * permitido em estado PENDING — invalida o link antigo e gera um novo.
     */
    public void rotateToken(String newTokenHash, java.time.Duration ttl) {
        ensureAcceptable();
        Objects.requireNonNull(newTokenHash, "newTokenHash");
        if (ttl == null || ttl.isZero() || ttl.isNegative()) {
            throw new IllegalArgumentException("ttl deve ser positivo");
        }
        this.tokenHash = newTokenHash;
        this.expiresAt = Instant.now().plus(ttl);
    }

    /** Marca como expirado (job periódico ou sob demanda). */
    public void expire() {
        if (status != InviteStatus.PENDING) return;
        this.status = InviteStatus.EXPIRED;
    }

    /** Associa o user shell do Zitadel criado no momento da emissão. */
    public void attachZitadelUser(String zitadelUserId) {
        this.zitadelUserId = Objects.requireNonNull(zitadelUserId);
    }

    public boolean isExpired(Instant at) {
        return expiresAt.isBefore(at);
    }

    private void ensureAcceptable() {
        if (!status.isAcceptable()) {
            throw new InviteNotAcceptableException(status);
        }
    }

    // ── Getters ─────────────────────────────────────────────────────────────
    @Override public InviteId id()                  { return id; }
    public TenantId tenantId()                      { return tenantId; }
    public String email()                           { return email; }
    public String fullName()                        { return fullName; }
    public InviteRole role()                        { return role; }
    public String tokenHash()                       { return tokenHash; }
    public InviteStatus status()                    { return status; }
    public Instant expiresAt()                      { return expiresAt; }
    public java.util.UUID createdByUserId()         { return createdByUserId; }
    public Instant createdAt()                      { return createdAt; }
    public Instant acceptedAt()                     { return acceptedAt; }
    public Instant revokedAt()                      { return revokedAt; }
    public String zitadelUserId()                   { return zitadelUserId; }
}
