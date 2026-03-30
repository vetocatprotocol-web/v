import { pgTable, uuid, varchar, text, boolean, timestamp, integer, bigint, jsonb, decimal, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRole = pgEnum('user_role', ['user', 'admin', 'super_admin']);
export const workspaceRole = pgEnum('workspace_role', ['owner', 'admin', 'editor', 'viewer']);
export const planType = pgEnum('plan_type', ['free', 'pro', 'enterprise']);
export const taskType = pgEnum('task_type', ['manual', 'agent', 'workflow']);
export const taskStatus = pgEnum('task_status', ['pending', 'queued', 'running', 'completed', 'failed', 'cancelled']);
export const taskPriority = pgEnum('task_priority', ['low', 'medium', 'high', 'urgent']);
export const agentType = pgEnum('agent_type', ['executor', 'analyst', 'data', 'custom']);
export const agentStatus = pgEnum('agent_status', ['active', 'inactive', 'deprecated', 'retired']);
export const integrationProvider = pgEnum('integration_provider', ['google_drive', 'slack', 'gmail', 'airtable', 'stripe', 'dropbox']);
export const integrationStatus = pgEnum('integration_status', ['connected', 'disconnected', 'error', 'syncing']);
export const memoryType = pgEnum('memory_type', ['behavior', 'preference', 'pattern', 'context']);
export const memorySource = pgEnum('memory_source', ['observed', 'explicit', 'inferred']);
export const subscriptionStatus = pgEnum('subscription_status', ['active', 'cancelled', 'past_due', 'trialing']);
export const auditActionCategory = pgEnum('audit_action_category', ['auth', 'user', 'workspace', 'task', 'agent', 'file', 'ai', 'billing', 'admin', 'integration']);

// Tables
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  avatarUrl: text('avatar_url'),
  role: userRole('role').notNull().default('user'),
  locale: varchar('locale', { length: 10 }).default('id'),
  emailVerified: boolean('email_verified').default(false),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  plan: planType('plan').notNull().default('free'),
  settings: jsonb('settings').default({}),
  storageUsedBytes: bigint('storage_used_bytes', { mode: 'number' }).default(0),
  aiTasksToday: integer('ai_tasks_today').default(0),
  aiTasksResetAt: timestamp('ai_tasks_reset_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const workspaceMembers = pgTable('workspace_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: workspaceRole('role').notNull().default('editor'),
  invitedBy: uuid('invited_by').references(() => users.id),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
});

// Add more tables as needed from the schema
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  type: taskType('type').notNull().default('manual'),
  status: taskStatus('status').notNull().default('pending'),
  priority: taskPriority('priority').notNull().default('medium'),
  input: jsonb('input').default({}),
  output: jsonb('output'),
  agentId: uuid('agent_id'),
  assignedTo: uuid('assigned_to').references(() => users.id),
  progress: integer('progress').default(0),
  error: jsonb('error'),
  costUsd: decimal('cost_usd', { precision: 10, scale: 6 }).default('0'),
  modelUsed: varchar('model_used', { length: 100 }),
  tokensInput: integer('tokens_input').default(0),
  tokensOutput: integer('tokens_output').default(0),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  type: agentType('type').notNull().default('custom'),
  version: varchar('version', { length: 20 }).notNull().default('1.0.0'),
  status: agentStatus('status').notNull().default('active'),
  config: jsonb('config').notNull().default({}),
  permissions: text('permissions').array(),
  pricePerExecution: decimal('price_per_execution', { precision: 10, scale: 4 }).default('0'),
  isMarketplace: boolean('is_marketplace').default(false),
  category: varchar('category', { length: 50 }),
  creatorId: uuid('creator_id').references(() => users.id),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  ratingCount: integer('rating_count').default(0),
  executionCount: integer('execution_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});