import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { tasks, workspaces, workspaceMembers, agents } from '../../database/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { AgentsService } from '../agents/agents.service';
import { DATABASE_CONNECTION } from '../../database/database.module';

@Injectable()
export class TasksService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: ReturnType<typeof drizzle>,
    private agentsService: AgentsService,
  ) {}

  async create(createTaskDto: {
    workspaceId: string;
    title: string;
    description?: string;
    type?: string;
    priority?: string;
    input?: any;
    assignedTo?: string;
  }, userId: string) {
    // Verify user has access to workspace
    const member = await this.db.select()
      .from(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, createTaskDto.workspaceId), eq(workspaceMembers.userId, userId)))
      .limit(1);

    if (!member[0]) {
      throw new NotFoundException('Access denied to workspace');
    }

    const newTask = await this.db.insert(tasks).values({
      workspaceId: createTaskDto.workspaceId,
      title: createTaskDto.title,
      description: createTaskDto.description,
      type: createTaskDto.type as any || 'manual',
      priority: createTaskDto.priority as any || 'medium',
      input: createTaskDto.input || {},
      assignedTo: createTaskDto.assignedTo,
      createdBy: userId,
    }).returning();

    return newTask[0];
  }

  async findAll(workspaceId?: string, userId?: string) {
    const conditions = [];

    if (workspaceId) {
      conditions.push(eq(tasks.workspaceId, workspaceId));
    }

    if (userId) {
      // Only show tasks from workspaces user is member of
      const userWorkspaces = await this.db.select({ id: workspaces.id })
        .from(workspaces)
        .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
        .where(eq(workspaceMembers.userId, userId));

      const workspaceIds = userWorkspaces.map(w => w.id);
      if (workspaceIds.length > 0) {
        conditions.push(inArray(tasks.workspaceId, workspaceIds));
      } else {
        // If user has no workspaces, return empty result
        return [];
      }
    }

    return this.db.select().from(tasks).where(and(...conditions)).orderBy(desc(tasks.createdAt));
  }

  async findOne(id: string, userId?: string) {
    const task = await this.db.select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);

    if (!task[0]) {
      throw new NotFoundException('Task not found');
    }

    if (userId) {
      // Check access
      const member = await this.db.select()
        .from(workspaceMembers)
        .where(and(eq(workspaceMembers.workspaceId, task[0].workspaceId), eq(workspaceMembers.userId, userId)))
        .limit(1);

      if (!member[0]) {
        throw new NotFoundException('Access denied');
      }
    }

    return task[0];
  }

  async update(id: string, updateTaskDto: Partial<typeof tasks.$inferInsert>, userId?: string) {
    const task = await this.findOne(id, userId);

    const updated = await this.db.update(tasks)
      .set({
        ...updateTaskDto,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    if (!updated[0]) {
      throw new NotFoundException('Task not found');
    }

    return updated[0];
  }

  async remove(id: string, userId?: string) {
    const task = await this.findOne(id, userId);

    const deleted = await this.db.delete(tasks)
      .where(eq(tasks.id, id))
      .returning();

    if (!deleted[0]) {
      throw new NotFoundException('Task not found');
    }

    return deleted[0];
  }

  async executeTask(id: string, userId?: string) {
    const task = await this.findOne(id, userId);

    // Update status to running
    await this.update(id, {
      status: 'running',
      startedAt: new Date(),
    });

    try {
      let result;

      if (task.type === 'agent' && task.agentId) {
        // Execute AI agent
        result = await this.agentsService.executeAgent(task.agentId, task.input);
      } else {
        // Simulate manual task execution
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = {
          output: { result: 'Manual task completed successfully' },
          cost: 0,
          modelUsed: null,
        };
      }

      // Update task with results
      await this.update(id, {
        status: 'completed',
        completedAt: new Date(),
        output: result.output,
        progress: 100,
        costUsd: result.cost.toString(),
        modelUsed: result.modelUsed,
        tokensInput: result.output?.tokensUsed || 0,
        tokensOutput: result.output?.tokensUsed || 0,
      });

      return { message: 'Task completed successfully', result };
    } catch (error) {
      await this.update(id, {
        status: 'failed',
        error: { message: error.message },
      });
      throw error;
    }
  }
}