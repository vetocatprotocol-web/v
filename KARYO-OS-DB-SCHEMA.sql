-- ═══════════════════════════════════════════════════════════════
-- KARYO OS — Database Schema (PostgreSQL)
-- Version: 1.0.0
-- Compatible with: PostgreSQL 15+, Drizzle ORM
-- ═══════════════════════════════════════════════════════════════

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";          -- pgvector for embeddings

-- ═══════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════

CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'editor', 'viewer');
CREATE TYPE plan_type AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE task_type AS ENUM ('manual', 'agent', 'workflow');
CREATE TYPE task_status AS ENUM ('pending', 'queued', 'running', 'completed', 'failed', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE agent_type AS ENUM ('executor', 'analyst', 'data', 'custom');
CREATE TYPE agent_status AS ENUM ('active', 'inactive', 'deprecated', 'retired');
CREATE TYPE integration_provider AS ENUM ('google_drive', 'slack', 'gmail', 'airtable', 'stripe', 'dropbox');
CREATE TYPE integration_status AS ENUM ('connected', 'disconnected', 'error', 'syncing');
CREATE TYPE memory_type AS ENUM ('behavior', 'preference', 'pattern', 'context');
CREATE TYPE memory_source AS ENUM ('observed', 'explicit', 'inferred');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'trialing');
CREATE TYPE audit_action_category AS ENUM ('auth', 'user', 'workspace', 'task', 'agent', 'file', 'ai', 'billing', 'admin', 'integration');

-- ═══════════════════════════════════════════════════════════════
-- 1. USERS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    avatar_url      TEXT,
    role            user_role NOT NULL DEFAULT 'user',
    locale          VARCHAR(10) DEFAULT 'id',
    email_verified  BOOLEAN DEFAULT FALSE,
    last_login_at   TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ═══════════════════════════════════════════════════════════════
-- 2. WORKSPACES
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE workspaces (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    plan            plan_type NOT NULL DEFAULT 'free',
    settings        JSONB DEFAULT '{}',
    storage_used_bytes  BIGINT DEFAULT 0,
    ai_tasks_today      INTEGER DEFAULT 0,
    ai_tasks_reset_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);

-- ═══════════════════════════════════════════════════════════════
-- 3. WORKSPACE MEMBERS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE workspace_members (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            workspace_role NOT NULL DEFAULT 'editor',
    invited_by      UUID REFERENCES users(id),
    joined_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_ws_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_ws_members_user ON workspace_members(user_id);

-- ═══════════════════════════════════════════════════════════════
-- 4. TASKS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE tasks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    type            task_type NOT NULL DEFAULT 'manual',
    status          task_status NOT NULL DEFAULT 'pending',
    priority        task_priority NOT NULL DEFAULT 'medium',
    input           JSONB DEFAULT '{}',
    output          JSONB,
    agent_id        UUID,                          -- FK added after agents table
    assigned_to     UUID REFERENCES users(id),
    progress        INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    error           JSONB,
    cost_usd        DECIMAL(10, 6) DEFAULT 0,
    model_used      VARCHAR(100),
    tokens_input    INTEGER DEFAULT 0,
    tokens_output   INTEGER DEFAULT 0,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at      TIMESTAMP WITH TIME ZONE,
    completed_at    TIMESTAMP WITH TIME ZONE,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_tasks_agent ON tasks(agent_id);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_workspace_status ON tasks(workspace_id, status);

-- ═══════════════════════════════════════════════════════════════
-- 5. AGENTS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE agents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    description     TEXT,
    type            agent_type NOT NULL DEFAULT 'custom',
    version         VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    status          agent_status NOT NULL DEFAULT 'active',
    config          JSONB NOT NULL DEFAULT '{}',
    -- config structure:
    -- {
    --   "system_prompt": "You are a...",
    --   "model_preference": "gpt-4o",
    --   "tools": ["web_search", "file_read"],
    --   "max_execution_time": 300,
    --   "temperature": 0.7
    -- }
    permissions     TEXT[] DEFAULT '{}',
    price_per_execution DECIMAL(10, 4) DEFAULT 0,
    is_marketplace      BOOLEAN DEFAULT FALSE,
    category        VARCHAR(50),
    creator_id      UUID REFERENCES users(id),
    rating          DECIMAL(3, 2) DEFAULT 0,
    rating_count    INTEGER DEFAULT 0,
    execution_count INTEGER DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_agents_type ON agents(type);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_marketplace ON agents(is_marketplace) WHERE is_marketplace = TRUE;
CREATE INDEX idx_agents_category ON agents(category);
CREATE INDEX idx_agents_creator ON agents(creator_id);

-- Now add FK from tasks to agents
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_agent FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL;

-- ═══════════════════════════════════════════════════════════════
-- 6. AGENT VERSIONS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE agent_versions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id        UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    version         VARCHAR(20) NOT NULL,
    changelog       TEXT,
    config          JSONB NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft',   -- draft, active, deprecated
    breaking_changes BOOLEAN DEFAULT FALSE,
    published_by    UUID REFERENCES users(id),
    published_at    TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(agent_id, version)
);

CREATE INDEX idx_agent_versions_agent ON agent_versions(agent_id);

-- ═══════════════════════════════════════════════════════════════
-- 7. FILES
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE files (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name            VARCHAR(500) NOT NULL,
    original_name   VARCHAR(500) NOT NULL,
    mime_type       VARCHAR(100) NOT NULL,
    size_bytes      BIGINT NOT NULL,
    path            TEXT NOT NULL,
    url             TEXT,
    ai_processed    BOOLEAN DEFAULT FALSE,
    ai_summary      TEXT,
    ai_metadata     JSONB,
    tags            TEXT[] DEFAULT '{}',
    version         INTEGER DEFAULT 1,
    parent_id       UUID REFERENCES files(id),       -- for versioning
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_files_workspace ON files(workspace_id);
CREATE INDEX idx_files_mime_type ON files(mime_type);
CREATE INDEX idx_files_created_by ON files(created_by);
CREATE INDEX idx_files_tags ON files USING GIN(tags);
CREATE INDEX idx_files_ai_processed ON files(ai_processed) WHERE ai_processed = FALSE;

-- ═══════════════════════════════════════════════════════════════
-- 8. TASK FILES (Many-to-Many)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE task_files (
    task_id     UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    file_id     UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    PRIMARY KEY (task_id, file_id)
);

-- ═══════════════════════════════════════════════════════════════
-- 9. EXECUTIONS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE executions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    agent_id        UUID REFERENCES agents(id),
    worker_id       VARCHAR(100),                  -- BullMQ worker ID
    status          task_status NOT NULL DEFAULT 'queued',
    input           JSONB,
    output          JSONB,
    error           JSONB,
    cost_usd        DECIMAL(10, 6) DEFAULT 0,
    model_used      VARCHAR(100),
    tokens_input    INTEGER DEFAULT 0,
    tokens_output   INTEGER DEFAULT 0,
    latency_ms      INTEGER,
    retry_count     INTEGER DEFAULT 0,
    started_at      TIMESTAMP WITH TIME ZONE,
    completed_at    TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_executions_task ON executions(task_id);
CREATE INDEX idx_executions_agent ON executions(agent_id);
CREATE INDEX idx_executions_status ON executions(status);
CREATE INDEX idx_executions_created_at ON executions(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- 10. MEMORY
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE memory (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    type            memory_type NOT NULL,
    key             VARCHAR(255) NOT NULL,
    value           JSONB NOT NULL,
    confidence      DECIMAL(3, 2) DEFAULT 0.50,
    source          memory_source NOT NULL DEFAULT 'observed',
    embedding       vector(1536),                  -- OpenAI embedding dimension
    access_count    INTEGER DEFAULT 0,
    last_accessed   TIMESTAMP WITH TIME ZONE,
    expires_at      TIMESTAMP WITH TIME ZONE,      -- NULL = never expires
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_memory_user ON memory(user_id);
CREATE INDEX idx_memory_workspace ON memory(workspace_id);
CREATE INDEX idx_memory_type ON memory(type);
CREATE INDEX idx_memory_key ON memory(key);
CREATE INDEX idx_memory_expires ON memory(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_memory_embedding ON memory USING ivfflat(embedding vector_cosine_ops);

-- ═══════════════════════════════════════════════════════════════
-- 11. INTEGRATIONS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE integrations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    provider        integration_provider NOT NULL,
    status          integration_status NOT NULL DEFAULT 'disconnected',
    display_name    VARCHAR(255),
    access_token    TEXT,                          -- Encrypted
    refresh_token   TEXT,                          -- Encrypted
    token_expires_at TIMESTAMP WITH TIME ZONE,
    config          JSONB DEFAULT '{}',
    metadata        JSONB DEFAULT '{}',
    connected_by    UUID NOT NULL REFERENCES users(id),
    last_synced_at  TIMESTAMP WITH TIME ZONE,
    error_message   TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(workspace_id, provider)
);

CREATE INDEX idx_integrations_workspace ON integrations(workspace_id);
CREATE INDEX idx_integrations_provider ON integrations(provider);
CREATE INDEX idx_integrations_status ON integrations(status);

-- ═══════════════════════════════════════════════════════════════
-- 12. SUBSCRIPTIONS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE subscriptions (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id            UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    plan                    plan_type NOT NULL DEFAULT 'free',
    status                  subscription_status NOT NULL DEFAULT 'active',
    stripe_subscription_id  VARCHAR(255),
    stripe_customer_id      VARCHAR(255),
    monthly_cost_usd        DECIMAL(10, 2) DEFAULT 0,
    current_period_start    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end      TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end    BOOLEAN DEFAULT FALSE,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(workspace_id)
);

CREATE INDEX idx_subscriptions_workspace ON subscriptions(workspace_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

-- ═══════════════════════════════════════════════════════════════
-- 13. USAGE RECORDS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE usage_records (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),
    task_id         UUID REFERENCES tasks(id),
    resource_type   VARCHAR(50) NOT NULL,          -- 'ai_task', 'storage', 'api_call'
    quantity        INTEGER NOT NULL DEFAULT 1,
    cost_usd        DECIMAL(10, 6) DEFAULT 0,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_usage_workspace ON usage_records(workspace_id);
CREATE INDEX idx_usage_user ON usage_records(user_id);
CREATE INDEX idx_usage_type ON usage_records(resource_type);
CREATE INDEX idx_usage_created ON usage_records(created_at DESC);
CREATE INDEX idx_usage_workspace_date ON usage_records(workspace_id, created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- 14. BUDGET LIMITS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE budget_limits (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id        UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    scope               VARCHAR(20) NOT NULL DEFAULT 'workspace',  -- workspace | user
    scope_id            UUID,                                        -- user_id if scope=user
    limit_usd           DECIMAL(10, 2) NOT NULL,
    alert_thresholds    INTEGER[] DEFAULT '{50, 75, 90, 100}',
    action_on_limit     VARCHAR(30) DEFAULT 'downgrade_to_economy', -- block | downgrade | notify
    current_usage_usd   DECIMAL(10, 6) DEFAULT 0,
    period_start        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    period_end          TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(workspace_id, scope, scope_id)
);

CREATE INDEX idx_budget_workspace ON budget_limits(workspace_id);

-- ═══════════════════════════════════════════════════════════════
-- 15. AUDIT LOGS (Immutable)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL,                 -- workspace_id
    user_id         UUID,
    action          VARCHAR(100) NOT NULL,
    category        audit_action_category NOT NULL,
    resource_type   VARCHAR(50),
    resource_id     UUID,
    details         JSONB DEFAULT '{}',
    ip_address      INET,
    user_agent      TEXT,
    request_id      UUID,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Immutability: no UPDATE or DELETE allowed
    CONSTRAINT audit_immutable CHECK (true)
);

-- No UPDATE/DELETE privileges for any role
REVOKE UPDATE, DELETE ON audit_logs FROM PUBLIC;

CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_category ON audit_logs(category);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_tenant_created ON audit_logs(tenant_id, created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- 16. API KEYS (For external API access)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE api_keys (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    key_hash        VARCHAR(255) NOT NULL UNIQUE,  -- SHA-256 of the key
    key_prefix      VARCHAR(10) NOT NULL,           -- First 8 chars for identification
    permissions     TEXT[] DEFAULT '{}',
    last_used_at    TIMESTAMP WITH TIME ZONE,
    expires_at      TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_api_keys_workspace ON api_keys(workspace_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);

-- ═══════════════════════════════════════════════════════════════
-- 17. NOTIFICATIONS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id    UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    type            VARCHAR(50) NOT NULL,
    title           VARCHAR(500) NOT NULL,
    body            TEXT,
    data            JSONB DEFAULT '{}',
    read            BOOLEAN DEFAULT FALSE,
    read_at         TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read) WHERE read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- 18. COMMENTS (Collaboration)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE comments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    resource_type   VARCHAR(50) NOT NULL,          -- 'task', 'file', 'agent'
    resource_id     UUID NOT NULL,
    user_id         UUID NOT NULL REFERENCES users(id),
    parent_id       UUID REFERENCES comments(id),  -- threaded replies
    body            TEXT NOT NULL,
    mentions        UUID[] DEFAULT '{}',           -- mentioned user IDs
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_resource ON comments(resource_type, resource_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (Multi-Tenancy)
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS on tenant-scoped tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY tenant_isolation_tasks ON tasks
    USING (workspace_id = current_setting('app.current_workspace_id')::UUID);

CREATE POLICY tenant_isolation_files ON files
    USING (workspace_id = current_setting('app.current_workspace_id')::UUID);

CREATE POLICY tenant_isolation_agents ON agents
    USING (
        creator_id IS NULL  -- system agents visible to all
        OR EXISTS (
            SELECT 1 FROM workspace_members wm
            WHERE wm.user_id = agents.creator_id
            AND wm.workspace_id = current_setting('app.current_workspace_id')::UUID
        )
    );

CREATE POLICY tenant_isolation_memory ON memory
    USING (workspace_id = current_setting('app.current_workspace_id')::UUID);

CREATE POLICY tenant_isolation_integrations ON integrations
    USING (workspace_id = current_setting('app.current_workspace_id')::UUID);

-- ═══════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_files_updated_at BEFORE UPDATE ON files FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_memory_updated_at BEFORE UPDATE ON memory FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_budget_limits_updated_at BEFORE UPDATE ON budget_limits FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA (Development)
-- ═══════════════════════════════════════════════════════════════

-- Default system agents
INSERT INTO agents (name, slug, description, type, config, is_marketplace, category, permissions) VALUES
('Finance Analyst', 'finance-analyst', 'Analisis data keuangan, laporan, dan forecasting', 'analyst',
 '{"system_prompt": "You are a financial analyst. Analyze data and generate reports.", "model_preference": "gpt-4o", "tools": ["file_read", "csv_parse", "chart_generate"], "max_execution_time": 300}',
 TRUE, 'finance', '{"read:files", "read:tasks", "write:files"}'),

('Marketing Strategist', 'marketing-strategist', 'Analisis kampanye, content strategy, SEO', 'analyst',
 '{"system_prompt": "You are a marketing strategist. Analyze campaigns and suggest improvements.", "model_preference": "gpt-4o", "tools": ["web_search", "file_read", "chart_generate"], "max_execution_time": 300}',
 TRUE, 'marketing', '{"read:files", "read:tasks", "write:files"}'),

('Data Analyst', 'data-analyst', 'Analisis data umum, visualisasi, statistik', 'analyst',
 '{"system_prompt": "You are a data analyst. Process and analyze data.", "model_preference": "gpt-4o-mini", "tools": ["file_read", "csv_parse", "chart_generate", "code_execute"], "max_execution_time": 300}',
 TRUE, 'data', '{"read:files", "read:tasks", "write:files"}'),

('Report Writer', 'report-writer', 'Generate laporan dari data yang diberikan', 'executor',
 '{"system_prompt": "You are a report writer. Generate comprehensive reports.", "model_preference": "gpt-4o", "tools": ["file_read", "template_render", "pdf_generate"], "max_execution_time": 180}',
 TRUE, 'productivity', '{"read:files", "write:files"}'),

('Summarizer', 'summarizer', 'Ringkas dokumen, email, dan meeting notes', 'executor',
 '{"system_prompt": "You are a summarizer. Create concise summaries.", "model_preference": "gpt-4o-mini", "tools": ["file_read"], "max_execution_time": 60}',
 TRUE, 'productivity', '{"read:files"}');

-- ═══════════════════════════════════════════════════════════════
-- ENTITY-RELATIONSHIP SUMMARY
-- ═══════════════════════════════════════════════════════════════
--
-- users ─────┬── workspace_members ── workspaces ──┬── tasks ──┬── executions
--            │                                     │           ├── task_files ── files
--            │                                     │           └── agents
--            │                                     ├── files
--            │                                     ├── memory
--            │                                     ├── integrations
--            │                                     ├── subscriptions
--            │                                     ├── usage_records
--            │                                     ├── budget_limits
--            │                                     └── audit_logs
--            │
--            ├── api_keys
--            └── notifications
--
-- ═══════════════════════════════════════════════════════════════
