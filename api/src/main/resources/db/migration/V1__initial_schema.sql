CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE tenants (
    id              UUID PRIMARY KEY,
    zitadel_org_id  VARCHAR(255) NOT NULL UNIQUE,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_zitadel_org_id ON tenants(zitadel_org_id);

CREATE TABLE users (
    id              UUID PRIMARY KEY,
    zitadel_id      VARCHAR(255) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255),
    avatar_url      TEXT,
    tenant_id       UUID,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL,
    last_login_at   TIMESTAMPTZ,
    CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL
);

CREATE INDEX idx_users_zitadel_id ON users(zitadel_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
