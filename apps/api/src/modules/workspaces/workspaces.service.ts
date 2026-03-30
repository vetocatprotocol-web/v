import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { workspaces, workspaceMembers } from '../../database/schema';
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

  async removeMember(workspaceId: string, userId: string) {
    return this.db.delete(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
      .returning();
  }
}