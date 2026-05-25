-- Convites de novos membros para tenants existentes.
--
-- Fluxo: admin de um tenant cria um invite via POST /api/v1/invites; o sistema
-- cria um user "shell" no Zitadel (sem senha), gera um token de uso único e
-- envia um magic link por email. O convidado clica, abre /accept-invite?token=...
-- na SPA login (:5174), define nome + senha (PATCH no user via Zitadel Admin API)
-- e é redirecionado para o fluxo OIDC normal.
--
-- Ver ADR-016 e docs/04-AUTH.md (seção "Convite de membros").

CREATE TABLE invites (
    id                  UUID PRIMARY KEY,
    tenant_id           BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email               VARCHAR(255) NOT NULL,
    full_name           VARCHAR(255),
    role                VARCHAR(50) NOT NULL,
    -- Apenas o hash do token (sha-256 hex) fica persistido; o token claro só
    -- aparece UMA vez na resposta da criação e no magic link enviado por email.
    token_hash          VARCHAR(64) NOT NULL UNIQUE,
    status              VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    expires_at          TIMESTAMPTZ NOT NULL,
    -- Auditoria
    created_by_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL,
    accepted_at         TIMESTAMPTZ,
    revoked_at          TIMESTAMPTZ,
    -- ID do user "shell" criado no Zitadel quando o invite foi emitido. Permite
    -- localizar e completar o user (definir senha, marcar email verified) quando
    -- o convidado aceitar.
    zitadel_user_id     VARCHAR(255),
    CONSTRAINT chk_invite_status CHECK (status IN ('PENDING','ACCEPTED','EXPIRED','REVOKED')),
    CONSTRAINT chk_invite_role   CHECK (role IN ('org_admin','comercial_atendimento','comercial_proposta','default'))
);

-- Um único invite PENDING por (tenant, email). Convites já aceitos/revogados não
-- bloqueiam a criação de um novo.
CREATE UNIQUE INDEX uq_invites_tenant_email_pending
    ON invites (tenant_id, lower(email))
    WHERE status = 'PENDING';

CREATE INDEX idx_invites_status        ON invites(status);
CREATE INDEX idx_invites_email         ON invites(lower(email));
CREATE INDEX idx_invites_expires_at    ON invites(expires_at);

COMMENT ON TABLE  invites IS 'Convites de membros para tenants existentes (ver ADR-016).';
COMMENT ON COLUMN invites.token_hash IS 'SHA-256 do token; o token claro nunca fica persistido.';
COMMENT ON COLUMN invites.status     IS 'PENDING (enviado), ACCEPTED (usado), EXPIRED (passou de expires_at), REVOKED (admin cancelou).';
COMMENT ON COLUMN invites.role       IS 'Role que o convidado terá no tenant após aceitar.';
COMMENT ON COLUMN invites.zitadel_user_id IS 'User shell criado no Zitadel no momento do convite.';
