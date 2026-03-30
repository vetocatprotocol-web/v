"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const schema_1 = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const agents_service_1 = require("../agents/agents.service");
const events_gateway_1 = require("../events/events.gateway");
const database_module_1 = require("../../database/database.module");
let TasksService = class TasksService {
    constructor(db, agentsService, eventsGateway) {
        this.db = db;
        this.agentsService = agentsService;
        this.eventsGateway = eventsGateway;
    }
    async create(createTaskDto, userId) {
        const member = await this.db.select()
            .from(schema_1.workspaceMembers)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.workspaceMembers.workspaceId, createTaskDto.workspaceId), (0, drizzle_orm_1.eq)(schema_1.workspaceMembers.userId, userId)))
            .limit(1);
        if (!member[0]) {
            throw new common_1.NotFoundException('Access denied to workspace');
        }
        const newTask = await this.db.insert(schema_1.tasks).values({
            workspaceId: createTaskDto.workspaceId,
            title: createTaskDto.title,
            description: createTaskDto.description,
            type: createTaskDto.type || 'manual',
            priority: createTaskDto.priority || 'medium',
            input: createTaskDto.input || {},
            agentId: createTaskDto.agentId || null,
            assignedTo: createTaskDto.assignedTo,
            createdBy: userId,
        }).returning();
        console.log('Created task:', newTask[0]);
        return newTask[0];
    }
    async findAll(workspaceId, userId) {
        const conditions = [];
        if (workspaceId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.tasks.workspaceId, workspaceId));
        }
        if (userId) {
            const userWorkspaces = await this.db.select({ id: schema_1.workspaces.id })
                .from(schema_1.workspaces)
                .innerJoin(schema_1.workspaceMembers, (0, drizzle_orm_1.eq)(schema_1.workspaces.id, schema_1.workspaceMembers.workspaceId))
                .where((0, drizzle_orm_1.eq)(schema_1.workspaceMembers.userId, userId));
            const workspaceIds = userWorkspaces.map(w => w.id);
            if (workspaceIds.length > 0) {
                conditions.push((0, drizzle_orm_1.inArray)(schema_1.tasks.workspaceId, workspaceIds));
            }
            else {
                return [];
            }
        }
        return this.db.select().from(schema_1.tasks).where((0, drizzle_orm_1.and)(...conditions)).orderBy((0, drizzle_orm_1.desc)(schema_1.tasks.createdAt));
    }
    async findOne(id, userId) {
        const task = await this.db.select()
            .from(schema_1.tasks)
            .where((0, drizzle_orm_1.eq)(schema_1.tasks.id, id))
            .limit(1);
        if (!task[0]) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (userId) {
            const member = await this.db.select()
                .from(schema_1.workspaceMembers)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.workspaceMembers.workspaceId, task[0].workspaceId), (0, drizzle_orm_1.eq)(schema_1.workspaceMembers.userId, userId)))
                .limit(1);
            if (!member[0]) {
                throw new common_1.NotFoundException('Access denied');
            }
        }
        return task[0];
    }
    async update(id, updateTaskDto, userId) {
        const task = await this.findOne(id, userId);
        const updated = await this.db.update(schema_1.tasks)
            .set({
            ...updateTaskDto,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.tasks.id, id))
            .returning();
        if (!updated[0]) {
            throw new common_1.NotFoundException('Task not found');
        }
        return updated[0];
    }
    async remove(id, userId) {
        const task = await this.findOne(id, userId);
        const deleted = await this.db.delete(schema_1.tasks)
            .where((0, drizzle_orm_1.eq)(schema_1.tasks.id, id))
            .returning();
        if (!deleted[0]) {
            throw new common_1.NotFoundException('Task not found');
        }
        return deleted[0];
    }
    async executeTask(id, userId) {
        const task = await this.findOne(id, userId);
        await this.update(id, {
            status: 'running',
            startedAt: new Date(),
        });
        this.eventsGateway.emitTaskStatusChanged(task.workspaceId, id, 'running', task.status);
        try {
            let result;
            if (task.type === 'agent' && task.agentId) {
                this.eventsGateway.emitAgentStarted(task.workspaceId, id, task.agentId);
                result = await this.agentsService.executeAgent(task.agentId, task.input, task.workspaceId, id);
                this.eventsGateway.emitAgentCompleted(task.workspaceId, id, task.agentId, result.output);
            }
            else {
                this.eventsGateway.emitTaskProgress(task.workspaceId, id, 50, 'Processing manual task...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                result = {
                    output: { result: 'Manual task completed successfully' },
                    cost: 0,
                    modelUsed: null,
                };
            }
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
            this.eventsGateway.emitTaskCompleted(task.workspaceId, id, result.output, result.cost);
            return { message: 'Task completed successfully', result };
        }
        catch (error) {
            await this.update(id, {
                status: 'failed',
                error: { message: error.message },
            });
            this.eventsGateway.emitTaskFailed(task.workspaceId, id, error);
            throw error;
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_module_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [void 0, agents_service_1.AgentsService,
        events_gateway_1.EventsGateway])
], TasksService);
//# sourceMappingURL=tasks.service.js.map