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
exports.MarketplaceService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const schema_1 = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../../database/database.module");
let MarketplaceService = class MarketplaceService {
    constructor(db) {
        this.db = db;
    }
    async ensureWorkspaceMember(workspaceId, userId) {
        const member = await this.db.select().from(schema_1.workspaceMembers)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.workspaceMembers.workspaceId, workspaceId), (0, drizzle_orm_1.eq)(schema_1.workspaceMembers.userId, userId)))
            .limit(1);
        if (!member[0]) {
            throw new common_1.NotFoundException('Workspace access denied');
        }
        return member[0];
    }
    async getAgents(filters = {}) {
        const conditions = [(0, drizzle_orm_1.eq)(schema_1.agents.isMarketplace, true)];
        if (filters.category) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.agents.category, filters.category));
        }
        const page = Math.max(1, filters.page || 1);
        const perPage = Math.min(100, filters.perPage || 20);
        const skip = (page - 1) * perPage;
        const base = this.db.select().from(schema_1.agents).where((0, drizzle_orm_1.and)(...conditions));
        let query;
        switch (filters.sort) {
            case 'rating':
                query = base.orderBy((0, drizzle_orm_1.desc)(schema_1.agents.rating));
                break;
            case 'newest':
                query = base.orderBy((0, drizzle_orm_1.desc)(schema_1.agents.createdAt));
                break;
            case 'price':
                query = base.orderBy(schema_1.agents.pricePerExecution);
                break;
            default:
                query = base.orderBy((0, drizzle_orm_1.desc)(schema_1.agents.executionCount));
        }
        const items = await query.limit(perPage).offset(skip);
        return { data: items, page, perPage };
    }
    async installAgent(workspaceId, agentId, userId) {
        await this.ensureWorkspaceMember(workspaceId, userId);
        const agent = await this.db.select().from(schema_1.agents).where((0, drizzle_orm_1.eq)(schema_1.agents.id, agentId)).limit(1);
        if (!agent[0] || !agent[0].isMarketplace) {
            throw new common_1.NotFoundException('Agent not found in marketplace');
        }
        const existing = await this.db.select().from(schema_1.workspaceAgents)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.workspaceAgents.workspaceId, workspaceId), (0, drizzle_orm_1.eq)(schema_1.workspaceAgents.agentId, agentId)))
            .limit(1);
        if (existing[0]) {
            throw new common_1.BadRequestException('Agent already installed in workspace');
        }
        const installed = await this.db.insert(schema_1.workspaceAgents).values({
            workspaceId,
            agentId,
            installedBy: userId,
        }).returning();
        return installed[0];
    }
};
exports.MarketplaceService = MarketplaceService;
exports.MarketplaceService = MarketplaceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(database_module_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [void 0])
], MarketplaceService);
//# sourceMappingURL=marketplace.service.js.map