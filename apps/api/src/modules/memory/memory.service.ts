import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { memory, workspaces, workspaceMembers } from '../../database/schema';
import { eq, and, or, desc } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module';

@Injectable()
export class MemoryService {
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

  async findAll(workspaceId: string, userId: string, type?: string, key?: string) {
    await this.ensureWorkspaceMember(workspaceId, userId);

    const conditions = [eq(memory.workspaceId, workspaceId)];
    if (type) conditions.push(eq(memory.type, type as any));
    if (key) conditions.push(eq(memory.key, key));

    return this.db.select().from(memory).where(and(...conditions)).orderBy(desc(memory.createdAt));
  }

  async create(workspaceId: string, userId: string, data: { type: string; key: string; value: any }) {
    if (!data.type || !data.key || data.value === undefined || data.value === null) {
      throw new BadRequestException('type, key, and value are required');
    }

    await this.ensureWorkspaceMember(workspaceId, userId);

    const existing = await this.db.select().from(memory).where(and(eq(memory.workspaceId, workspaceId), eq(memory.key, data.key), eq(memory.userId, userId))).limit(1);
    if (existing[0]) {
      const updated = await this.db.update(memory).set({
        value: data.value,
        type: data.type as any,
        updatedAt: new Date(),
      }).where(eq(memory.id, existing[0].id)).returning();

      return updated[0];
    }

    const newEntry = await this.db.insert(memory).values({
      workspaceId,
      userId,
      type: data.type as any,
      key: data.key,
      value: data.value,
      source: 'explicit',
    }).returning();

    return newEntry[0];
  }

  async search(workspaceId: string, userId: string, query: string, limit = 5) {
    await this.ensureWorkspaceMember(workspaceId, userId);

    if (!query || !query.trim()) {
      throw new BadRequestException('Query is required');
    }

    const entries = await this.db.select().from(memory)
      .where(eq(memory.workspaceId, workspaceId))
      .orderBy(desc(memory.updatedAt));

    const normalized = query.toLowerCase();
    const matched = entries.filter(entry => {
      const keyMatch = entry.key.toLowerCase().includes(normalized);
      const valueMatch = JSON.stringify(entry.value).toLowerCase().includes(normalized);
      return keyMatch || valueMatch;
    });

    return matched.slice(0, limit);

  }

  async remove(memoryId: string, userId: string) {
    const entry = await this.db.select().from(memory).where(eq(memory.id, memoryId)).limit(1);
    if (!entry[0]) {
      throw new NotFoundException('Memory entry not found');
    }

    await this.ensureWorkspaceMember(entry[0].workspaceId, userId);

    await this.db.delete(memory).where(eq(memory.id, memoryId));
    return { message: 'Memory entry deleted' };
  }
}
