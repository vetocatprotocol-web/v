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
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const schema_1 = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../../database/database.module");
let AgentsService = class AgentsService {
    constructor(db) {
        this.db = db;
    }
    async create(createAgentDto, creatorId) {
        const slug = createAgentDto.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const newAgent = await this.db.insert(schema_1.agents).values({
            name: createAgentDto.name,
            slug,
            description: createAgentDto.description,
            type: createAgentDto.type || 'custom',
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
    async findAll(filters) {
        const conditions = [];
        if (filters?.type) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.agents.type, filters.type));
        }
        if (filters?.category) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.agents.category, filters.category));
        }
        if (filters?.isMarketplace !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.agents.isMarketplace, filters.isMarketplace));
        }
        return this.db.select().from(schema_1.agents).where((0, drizzle_orm_1.and)(...conditions)).orderBy((0, drizzle_orm_1.desc)(schema_1.agents.createdAt));
    }
    async findOne(id) {
        const agent = await this.db.select().from(schema_1.agents).where((0, drizzle_orm_1.eq)(schema_1.agents.id, id)).limit(1);
        if (!agent[0]) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return agent[0];
    }
    async findBySlug(slug) {
        const agent = await this.db.select().from(schema_1.agents).where((0, drizzle_orm_1.eq)(schema_1.agents.slug, slug)).limit(1);
        if (!agent[0]) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return agent[0];
    }
    async update(id, updateAgentDto) {
        const updated = await this.db.update(schema_1.agents)
            .set({
            ...updateAgentDto,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.agents.id, id))
            .returning();
        if (!updated[0]) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return updated[0];
    }
    async remove(id) {
        const deleted = await this.db.delete(schema_1.agents).where((0, drizzle_orm_1.eq)(schema_1.agents.id, id)).returning();
        if (!deleted[0]) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return deleted[0];
    }
    async executeAgent(agentId, taskInput) {
        const agent = await this.findOne(agentId);
        console.log(`Executing agent ${agent.name} with input:`, taskInput);
        await new Promise(resolve => setTimeout(resolve, 3000));
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
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_module_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [void 0])
], AgentsService);
//# sourceMappingURL=agents.service.js.map