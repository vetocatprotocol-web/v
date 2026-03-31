import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { tasks, workspaces, workspaceMembers, agents } from '../../database/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { AgentsService } from '../agents/agents.service';
import { EventsGateway } from '../events/events.gateway';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { ObservabilityService } from '../observability/observability.service';
import { DATABASE_CONNECTION } from '../../database/database.module';

@Injectable()
export class TasksService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: ReturnType<typeof drizzle>,
    private agentsService: AgentsService,
    private eventsGateway: EventsGateway,
    private workspacesService: WorkspacesService,
    private observabilityService: ObservabilityService,
  ) {}

  async create(createTaskDto: {
    workspaceId: string;
    title: string;
    description?: string;
    type?: string;
    priority?: string;
    input?: any;
    agentId?: string;
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
      status: 'pending',
      priority: createTaskDto.priority as any || 'medium',
      input: createTaskDto.input || {},
      agentId: createTaskDto.agentId || null,
      assignedTo: createTaskDto.assignedTo,
      createdBy: userId,
    }).returning();

    this.eventsGateway.emitTaskCreated(createTaskDto.workspaceId, newTask[0]);
    this.observabilityService.increment('http_requests_total');

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

    if (conditions.length > 0) {
      return this.db.select().from(tasks).where(and(...conditions)).orderBy(desc(tasks.createdAt));
    }

    return this.db.select().from(tasks).orderBy(desc(tasks.createdAt));
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

    // Emit task status change
    this.eventsGateway.emitTaskStatusChanged(task.workspaceId, id, 'running', task.status);

    try {
      let result;

      if (task.type === 'agent' && task.agentId) {
        // Check and reset daily AI usage
        await this.workspacesService.resetAiTasksIfNeeded(task.workspaceId);
        await this.workspacesService.ensureAiTaskAllowed(task.workspaceId);

        // Emit agent started
        this.eventsGateway.emitAgentStarted(task.workspaceId, id, task.agentId);

        // Execute AI agent
        result = await this.agentsService.executeAgent(task.agentId, task.input, task.workspaceId, id);

        // Increment AI task counters
        await this.workspacesService.incrementAiTasks(task.workspaceId, 1);
        this.observabilityService.increment('agent_executions_total');

        // Emit agent completed
        this.eventsGateway.emitAgentCompleted(task.workspaceId, id, task.agentId, result.output);
      } else {
        this.observabilityService.increment('task_executions_total');
        // Emit task progress
        this.eventsGateway.emitTaskProgress(task.workspaceId, id, 50, 'Processing manual task...');

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

      // Emit task completed
      this.eventsGateway.emitTaskCompleted(task.workspaceId, id, result.output, result.cost);

      return { message: 'Task completed successfully', result };
    } catch (error) {
      await this.update(id, {
        status: 'failed',
        error: { message: error.message },
      });

      // Emit task failed
      this.eventsGateway.emitTaskFailed(task.workspaceId, id, error);

      throw error;
    }
  }
}