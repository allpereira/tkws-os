-- Adiciona workflow de aprovação manual em tenants.
-- Estados: PENDING (aguardando aprovação) → ACTIVE (aprovado) ou REJECTED (negado)
-- Ver ADR-014 e docs/13-ONBOARDING.md.

ALTER TABLE tenants
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN requested_at TIMESTAMPTZ,
    ADD COLUMN approved_at TIMESTAMPTZ,
    ADD COLUMN rejected_at TIMESTAMPTZ,
    ADD COLUMN rejection_reason TEXT,
    ADD COLUMN requester_email VARCHAR(255),
    ADD COLUMN requester_full_name VARCHAR(255),
    ADD COLUMN requester_phone VARCHAR(50),
    ADD COLUMN requester_company_role VARCHAR(255),
    ADD COLUMN approved_by_user_id UUID REFERENCES users(id),
    ADD CONSTRAINT chk_tenant_status CHECK (status IN ('PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED'));

CREATE INDEX idx_tenants_status ON tenants(status);

COMMENT ON COLUMN tenants.status IS 'Estado do tenant: PENDING (aguardando), ACTIVE (aprovado), REJECTED (negado), SUSPENDED (suspenso)';
COMMENT ON COLUMN tenants.requested_at IS 'Data da solicitação de cadastro (preenchido em auto-cadastro)';
COMMENT ON COLUMN tenants.approved_at IS 'Data da aprovação (NULL até ser aprovado)';
COMMENT ON COLUMN tenants.rejected_at IS 'Data da rejeição (mutuamente exclusivo com approved_at)';
COMMENT ON COLUMN tenants.requester_email IS 'Email de contato de quem solicitou o cadastro';
COMMENT ON COLUMN tenants.requester_full_name IS 'Nome completo de quem solicitou';
COMMENT ON COLUMN tenants.requester_phone IS 'Telefone de quem solicitou (opcional, contato comercial)';
COMMENT ON COLUMN tenants.requester_company_role IS 'Cargo de quem solicitou no escritório';
