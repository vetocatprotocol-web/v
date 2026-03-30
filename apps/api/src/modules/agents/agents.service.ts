import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { agents } from '../../database/schema';
import { eq, desc, and } from 'drizzle-orm';
import { EventsGateway } from '../events/events.gateway';
import { DATABASE_CONNECTION } from '../../database/database.module';

@Injectable()
export class AgentsService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: ReturnType<typeof drizzle>,
    private eventsGateway: EventsGateway,
  ) {}

  async create(createAgentDto: {
    name: string;
    description?: string;
    type?: string;
    config?: any;
    category?: string;
  }, creatorId: string) {
    const slug = createAgentDto.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const newAgent = await this.db.insert(agents).values({
      name: createAgentDto.name,
      slug,
      description: createAgentDto.description,
      type: createAgentDto.type as any || 'custom',
      config: createAgentDto.config || {
        systemPrompt: 'You are a helpful AI assistant.',
        modelPreference: 'gpt-4',
        tools: [],
        maxExecutionTime: 300,
        temperature: 0.7,
      },
      category: createAgentDto.category,
      creatorId,
    }).returning();

    return newAgent[0];
  }

  async findAll(filters?: { type?: string; category?: string; isMarketplace?: boolean }) {
    const conditions = [];

    if (filters?.type) {
      conditions.push(eq(agents.type, filters.type as any));
    }
    if (filters?.category) {
      conditions.push(eq(agents.category, filters.category));
    }
    if (filters?.isMarketplace !== undefined) {
      conditions.push(eq(agents.isMarketplace, filters.isMarketplace));
    }

    return this.db.select().from(agents).where(and(...conditions)).orderBy(desc(agents.createdAt));
  }

  async findOne(id: string) {
    const agent = await this.db.select().from(agents).where(eq(agents.id, id)).limit(1);
    if (!agent[0]) {
      throw new NotFoundException('Agent not found');
    }
    return agent[0];
  }

  async findBySlug(slug: string) {
    const agent = await this.db.select().from(agents).where(eq(agents.slug, slug)).limit(1);
    if (!agent[0]) {
      throw new NotFoundException('Agent not found');
    }
    return agent[0];
  }

  async update(id: string, updateAgentDto: Partial<typeof agents.$inferInsert>) {
    const updated = await this.db.update(agents)
      .set({
        ...updateAgentDto,
        updatedAt: new Date(),
      })
      .where(eq(agents.id, id))
      .returning();

    if (!updated[0]) {
      throw new NotFoundException('Agent not found');
    }

    return updated[0];
  }

  async remove(id: string) {
    const deleted = await this.db.delete(agents).where(eq(agents.id, id)).returning();
    if (!deleted[0]) {
      throw new NotFoundException('Agent not found');
    }
    return deleted[0];
  }

  async executeAgent(agentId: string, taskInput: any, workspaceId?: string, taskId?: string) {
    const agent = await this.findOne(agentId);

    // For now, simulate agent execution
    // In real implementation, this would call the actual AI agent
    console.log(`Executing agent ${agent.name} with input:`, taskInput);

    // Simulate agent thinking and steps
    if (workspaceId && taskId) {
      this.eventsGateway.emitAgentThinking(workspaceId, taskId, 'Analyzing input...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.eventsGateway.emitAgentStep(workspaceId, taskId, 1, 3, 'Processing data...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.eventsGateway.emitAgentStep(workspaceId, taskId, 2, 3, 'Generating response...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.eventsGateway.emitAgentStep(workspaceId, taskId, 3, 3, 'Finalizing output...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    return {
      output: {
        result: `Agent ${agent.name} processed: ${JSON.stringify(taskInput)}`,
        confidence: 0.95,
        tokensUsed: 150,
      },
      cost: 0.02,
      modelUsed: 'gpt-4',
    };
  }
}