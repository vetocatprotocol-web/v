import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { agents, workspaces, workspaceMembers, workspaceAgents } from '../../database/schema';
import { eq, and, inArray, desc } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module';

@Injectable()
export class MarketplaceService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: ReturnType<typeof drizzle>,
  ) {}

  private async ensureWorkspaceMember(workspaceId: string, userId: string) {
    const member = await this.db.select().from(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
      .limit(1);

    if (!member[0]) {
      throw new NotFoundException('Workspace access denied');
    }

    return member[0];
  }

  async getAgents(filters: { page?: number; perPage?: number; category?: string; sort?: string } = {}) {
    const conditions = [eq(agents.isMarketplace, true)];
    if (filters.category) {
      conditions.push(eq(agents.category, filters.category as any));
    }

    const page = Math.max(1, filters.page || 1);
    const perPage = Math.min(100, filters.perPage || 20);
    const skip = (page - 1) * perPage;

    const base = this.db.select().from(agents).where(and(...conditions));

    let query;
    switch (filters.sort) {
      case 'rating':
        query = base.orderBy(desc(agents.rating));
        break;
      case 'newest':
        query = base.orderBy(desc(agents.createdAt));
        break;
      case 'price':
        query = base.orderBy(agents.pricePerExecution);
        break;
      default:
        query = base.orderBy(desc(agents.executionCount));
    }

    const items = await query.limit(perPage).offset(skip);
    return { data: items, page, perPage };
  }

  async installAgent(workspaceId: string, agentId: string, userId: string) {
    await this.ensureWorkspaceMember(workspaceId, userId);

    const agent = await this.db.select().from(agents).where(eq(agents.id, agentId)).limit(1);
    if (!agent[0] || !agent[0].isMarketplace) {
      throw new NotFoundException('Agent not found in marketplace');
    }

    const existing = await this.db.select().from(workspaceAgents)
      .where(and(eq(workspaceAgents.workspaceId, workspaceId), eq(workspaceAgents.agentId, agentId)))
      .limit(1);

    if (existing[0]) {
      throw new BadRequestException('Agent already installed in workspace');
    }

    const installed = await this.db.insert(workspaceAgents).values({
      workspaceId,
      agentId,
      installedBy: userId,
    }).returning();

    return installed[0];
  }
}
