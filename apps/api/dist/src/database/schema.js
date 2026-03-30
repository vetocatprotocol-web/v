"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agents = exports.tasks = exports.workspaceMembers = exports.workspaces = exports.users = exports.auditActionCategory = exports.subscriptionStatus = exports.memorySource = exports.memoryType = exports.integrationStatus = exports.integrationProvider = exports.agentStatus = exports.agentType = exports.taskPriority = exports.taskStatus = exports.taskType = exports.planType = exports.workspaceRole = exports.userRole = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.userRole = (0, pg_core_1.pgEnum)('user_role', ['user', 'admin', 'super_admin']);
exports.workspaceRole = (0, pg_core_1.pgEnum)('workspace_role', ['owner', 'admin', 'editor', 'viewer']);
exports.planType = (0, pg_core_1.pgEnum)('plan_type', ['free', 'pro', 'enterprise']);
exports.taskType = (0, pg_core_1.pgEnum)('task_type', ['manual', 'agent', 'workflow']);
exports.taskStatus = (0, pg_core_1.pgEnum)('task_status', ['pending', 'queued', 'running', 'completed', 'failed', 'cancelled']);
exports.taskPriority = (0, pg_core_1.pgEnum)('task_priority', ['low', 'medium', 'high', 'urgent']);
exports.agentType = (0, pg_core_1.pgEnum)('agent_type', ['executor', 'analyst', 'data', 'custom']);
exports.agentStatus = (0, pg_core_1.pgEnum)('agent_status', ['active', 'inactive', 'deprecated', 'retired']);
exports.integrationProvider = (0, pg_core_1.pgEnum)('integration_provider', ['google_drive', 'slack', 'gmail', 'airtable', 'stripe', 'dropbox']);
exports.integrationStatus = (0, pg_core_1.pgEnum)('integration_status', ['connected', 'disconnected', 'error', 'syncing']);
exports.memoryType = (0, pg_core_1.pgEnum)('memory_type', ['behavior', 'preference', 'pattern', 'context']);
exports.memorySource = (0, pg_core_1.pgEnum)('memory_source', ['observed', 'explicit', 'inferred']);
exports.subscriptionStatus = (0, pg_core_1.pgEnum)('subscription_status', ['active', 'cancelled', 'past_due', 'trialing']);
exports.auditActionCategory = (0, pg_core_1.pgEnum)('audit_action_category', ['auth', 'user', 'workspace', 'task', 'agent', 'file', 'ai', 'billing', 'admin', 'integration']);
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    passwordHash: (0, pg_core_1.varchar)('password_hash', { length: 255 }).notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    avatarUrl: (0, pg_core_1.text)('avatar_url'),
    role: (0, exports.userRole)('role').notNull().default('user'),
    locale: (0, pg_core_1.varchar)('locale', { length: 10 }).default('id'),
    emailVerified: (0, pg_core_1.boolean)('email_verified').default(false),
    lastLoginAt: (0, pg_core_1.timestamp)('last_login_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow(),
});
exports.workspaces = (0, pg_core_1.pgTable)('workspaces', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 100 }).notNull().unique(),
    ownerId: (0, pg_core_1.uuid)('owner_id').notNull().references(() => exports.users.id, { onDelete: 'restrict' }),
    plan: (0, exports.planType)('plan').notNull().default('free'),
    settings: (0, pg_core_1.jsonb)('settings').default({}),
    storageUsedBytes: (0, pg_core_1.bigint)('storage_used_bytes', { mode: 'number' }).default(0),
    aiTasksToday: (0, pg_core_1.integer)('ai_tasks_today').default(0),
    aiTasksResetAt: (0, pg_core_1.timestamp)('ai_tasks_reset_at', { withTimezone: true }).defaultNow(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow(),
});
exports.workspaceMembers = (0, pg_core_1.pgTable)('workspace_members', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    workspaceId: (0, pg_core_1.uuid)('workspace_id').notNull().references(() => exports.workspaces.id, { onDelete: 'cascade' }),
    userId: (0, pg_core_1.uuid)('user_id').notNull().references(() => exports.users.id, { onDelete: 'cascade' }),
    role: (0, exports.workspaceRole)('role').notNull().default('editor'),
    invitedBy: (0, pg_core_1.uuid)('invited_by').references(() => exports.users.id),
    joinedAt: (0, pg_core_1.timestamp)('joined_at', { withTimezone: true }).defaultNow(),
});
exports.tasks = (0, pg_core_1.pgTable)('tasks', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    workspaceId: (0, pg_core_1.uuid)('workspace_id').notNull().references(() => exports.workspaces.id, { onDelete: 'cascade' }),
    title: (0, pg_core_1.varchar)('title', { length: 500 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    type: (0, exports.taskType)('type').notNull().default('manual'),
    status: (0, exports.taskStatus)('status').notNull().default('pending'),
    priority: (0, exports.taskPriority)('priority').notNull().default('medium'),
    input: (0, pg_core_1.jsonb)('input').default({}),
    output: (0, pg_core_1.jsonb)('output'),
    agentId: (0, pg_core_1.uuid)('agent_id'),
    assignedTo: (0, pg_core_1.uuid)('assigned_to').references(() => exports.users.id),
    progress: (0, pg_core_1.integer)('progress').default(0),
    error: (0, pg_core_1.jsonb)('error'),
    costUsd: (0, pg_core_1.decimal)('cost_usd', { precision: 10, scale: 6 }).default('0'),
    modelUsed: (0, pg_core_1.varchar)('model_used', { length: 100 }),
    tokensInput: (0, pg_core_1.integer)('tokens_input').default(0),
    tokensOutput: (0, pg_core_1.integer)('tokens_output').default(0),
    createdBy: (0, pg_core_1.uuid)('created_by').notNull().references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow(),
    startedAt: (0, pg_core_1.timestamp)('started_at', { withTimezone: true }),
    completedAt: (0, pg_core_1.timestamp)('completed_at', { withTimezone: true }),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow(),
});
exports.agents = (0, pg_core_1.pgTable)('agents', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 100 }).notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    type: (0, exports.agentType)('type').notNull().default('custom'),
    version: (0, pg_core_1.varchar)('version', { length: 20 }).notNull().default('1.0.0'),
    status: (0, exports.agentStatus)('status').notNull().default('active'),
    config: (0, pg_core_1.jsonb)('config').notNull().default({}),
    permissions: (0, pg_core_1.text)('permissions').array(),
    pricePerExecution: (0, pg_core_1.decimal)('price_per_execution', { precision: 10, scale: 4 }).default('0'),
    isMarketplace: (0, pg_core_1.boolean)('is_marketplace').default(false),
    category: (0, pg_core_1.varchar)('category', { length: 50 }),
    creatorId: (0, pg_core_1.uuid)('creator_id').references(() => exports.users.id),
    rating: (0, pg_core_1.decimal)('rating', { precision: 3, scale: 2 }).default('0'),
    ratingCount: (0, pg_core_1.integer)('rating_count').default(0),
    executionCount: (0, pg_core_1.integer)('execution_count').default(0),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow(),
});
//# sourceMappingURL=schema.js.map