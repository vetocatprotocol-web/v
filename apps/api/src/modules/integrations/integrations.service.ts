import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { integrations, workspaceMembers } from '../../database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module';

@Injectable()
export class IntegrationsService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: ReturnType<typeof drizzle>,
  ) {}

  private async ensureWorkspaceMember(workspaceId: string, userId: string) {
    const member = await this.db.select()
      .from(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
      .limit(1);

    if (!member[0]) {
      throw new NotFoundException('Workspace access denied');
    }

    return member[0];
  }

  async list(workspaceId: string, userId: string) {
    await this.ensureWorkspaceMember(workspaceId, userId);
    return this.db.select().from(integrations).where(eq(integrations.workspaceId, workspaceId)).orderBy(desc(integrations.createdAt));
  }

  async connect(workspaceId: string, userId: string, provider: string) {
    await this.ensureWorkspaceMember(workspaceId, userId);

    const state = `${workspaceId}:${provider}:${Math.random().toString(36).slice(2)}`;
    const oauthUrl = `https://oauth.example.com/${provider}?client_id=fake-client-id&state=${encodeURIComponent(state)}`;

    const existing = await this.db.select().from(integrations)
      .where(and(eq(integrations.workspaceId, workspaceId), eq(integrations.provider, provider as any)))
      .limit(1);

    if (!existing[0]) {
      await this.db.insert(integrations).values({
        workspaceId,
        provider: provider as any,
        status: 'disconnected',
        syncStatus: 'disconnected',
      });
    }

    return { oauth_url: oauthUrl, state };
  }

  async callback(workspaceId: string, userId: string, provider: string, code: string, state: string) {
    await this.ensureWorkspaceMember(workspaceId, userId);

    const integration = await this.db.select().from(integrations)
      .where(and(eq(integrations.workspaceId, workspaceId), eq(integrations.provider, provider as any)))
      .limit(1);

    if (!integration[0]) {
      throw new NotFoundException('Integration not found');
    }

    // Simulated token exchange
    const accessToken = `access-${provider}-${code}`;
    const refreshToken = `refresh-${provider}-${code}`;

    const updated = await this.db.update(integrations).set({
      status: 'connected',
      config: { provider },
      accessToken,
      refreshToken,
      updatedAt: new Date(),
    }).where(eq(integrations.id, integration[0].id)).returning();

    return updated[0];
  }

  async triggerSync(integrationId: string, userId: string) {
    const integration = await this.db.select().from(integrations).where(eq(integrations.id, integrationId)).limit(1);
    if (!integration[0]) {
      throw new NotFoundException('Integration not found');
    }

    await this.ensureWorkspaceMember(integration[0].workspaceId, userId);

    // Mark sync started
    await this.db.update(integrations).set({
      syncStatus: 'syncing',
      updatedAt: new Date(),
    }).where(eq(integrations.id, integrationId));

    // Placeholder for async job queue
    setTimeout(async () => {
      await this.db.update(integrations).set({
        syncStatus: 'connected',
        lastSyncedAt: new Date(),
        updatedAt: new Date(),
      }).where(eq(integrations.id, integrationId));
    }, 1000);

    return { message: 'Sync queued' };
  }

  async disconnect(integrationId: string, userId: string) {
    const integration = await this.db.select().from(integrations).where(eq(integrations.id, integrationId)).limit(1);
    if (!integration[0]) {
      throw new NotFoundException('Integration not found');
    }

    await this.ensureWorkspaceMember(integration[0].workspaceId, userId);

    await this.db.delete(integrations).where(eq(integrations.id, integrationId));
    return { message: 'Integration disconnected' };
  }
}
