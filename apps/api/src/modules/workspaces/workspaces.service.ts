import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { workspaces, workspaceMembers, users } from '../../database/schema';
import { eq, and } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module';

@Injectable()
export class WorkspacesService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: ReturnType<typeof drizzle>,
  ) {}

  async findAll() {
    return this.db.select().from(workspaces);
  }

  async findOne(id: string) {
    const workspace = await this.db.select().from(workspaces).where(eq(workspaces.id, id)).limit(1);
    if (!workspace[0]) {
      throw new NotFoundException('Workspace not found');
    }
    return workspace[0];
  }

  async findByUser(userId: string) {
    const members = await this.db.select({
      workspace: workspaces,
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(eq(workspaceMembers.userId, userId));

    return members.map(m => ({ ...m.workspace, role: m.role }));
  }

  async create(createWorkspaceDto: { name: string; ownerId: string; slug?: string }) {
    const slug = createWorkspaceDto.slug || createWorkspaceDto.name.toLowerCase().replace(/\s+/g, '-');
    
    const newWorkspace = await this.db.insert(workspaces).values({
      name: createWorkspaceDto.name,
      slug,
      ownerId: createWorkspaceDto.ownerId,
    }).returning();

    // Add owner as member
    await this.db.insert(workspaceMembers).values({
      workspaceId: newWorkspace[0].id,
      userId: createWorkspaceDto.ownerId,
      role: 'owner',
    });

    return newWorkspace[0];
  }

  async update(id: string, updateData: Partial<typeof workspaces.$inferInsert>) {
    const updated = await this.db.update(workspaces).set(updateData).where(eq(workspaces.id, id)).returning();
    if (!updated[0]) {
      throw new NotFoundException('Workspace not found');
    }
    return updated[0];
  }

  async remove(id: string) {
    const deleted = await this.db.delete(workspaces).where(eq(workspaces.id, id)).returning();
    if (!deleted[0]) {
      throw new NotFoundException('Workspace not found');
    }
    return deleted[0];
  }

  async addMember(workspaceId: string, userId: string, role: string = 'editor') {
    return this.db.insert(workspaceMembers).values({
      workspaceId,
      userId,
      role: role as any,
    }).returning();
  }

  async listMembers(workspaceId: string) {
    return this.db.select({ member: workspaceMembers, user: users })
      .from(workspaceMembers)
      .innerJoin(users, eq(workspaceMembers.userId, users.id))
      .where(eq(workspaceMembers.workspaceId, workspaceId));
  }

  async removeMember(workspaceId: string, userId: string) {
    return this.db.delete(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
      .returning();
  }

  async incrementAiTasks(workspaceId: string, count = 1) {
    const workspace = await this.findOne(workspaceId);
    const updated = await this.db.update(workspaces).set({
      aiTasksToday: Number(workspace.aiTasksToday || 0) + count,
      updatedAt: new Date(),
    }).where(eq(workspaces.id, workspaceId)).returning();

    return updated[0];
  }

  async resetAiTasksIfNeeded(workspaceId: string) {
    const workspace = await this.findOne(workspaceId);
    const now = new Date();

    if (!workspace.aiTasksResetAt || new Date(workspace.aiTasksResetAt).getTime() <= now.getTime()) {
      const nextReset = new Date(now);
      nextReset.setUTCDate(nextReset.getUTCDate() + 1);
      nextReset.setUTCHours(0, 0, 0, 0);

      await this.db.update(workspaces).set({
        aiTasksToday: 0,
        aiTasksResetAt: nextReset,
        updatedAt: new Date(),
      }).where(eq(workspaces.id, workspaceId));
    }
  }

  async getAiQuotaLimit(plan?: string) {
    const limits: Record<string, number> = {
      free: 20,
      pro: 200,
      enterprise: 2000,
    };
    return plan && limits[plan] ? limits[plan] : limits.free;
  }

  async ensureAiTaskAllowed(workspaceId: string) {
    await this.resetAiTasksIfNeeded(workspaceId);

    const workspace = await this.findOne(workspaceId);
    const limit = await this.getAiQuotaLimit(workspace.plan);
    const usage = Number(workspace.aiTasksToday || 0);

    if (usage >= limit) {
      throw new BadRequestException(`AI task quota exceeded for plan ${workspace.plan} (limit ${limit} per day)`);
    }

    return { usage, limit };
  }
}