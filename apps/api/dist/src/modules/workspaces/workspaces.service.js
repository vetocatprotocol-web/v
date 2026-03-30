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
exports.WorkspacesService = void 0;
const common_1 = require("@nestjs/common");
const schema_1 = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../../database/database.module");
let WorkspacesService = class WorkspacesService {
    constructor(db) {
        this.db = db;
    }
    async findAll() {
        return this.db.select().from(schema_1.workspaces);
    }
    async findOne(id) {
        const workspace = await this.db.select().from(schema_1.workspaces).where((0, drizzle_orm_1.eq)(schema_1.workspaces.id, id)).limit(1);
        if (!workspace[0]) {
            throw new common_1.NotFoundException('Workspace not found');
        }
        return workspace[0];
    }
    async findByUser(userId) {
        const members = await this.db.select({
            workspace: schema_1.workspaces,
            role: schema_1.workspaceMembers.role,
        })
            .from(schema_1.workspaceMembers)
            .innerJoin(schema_1.workspaces, (0, drizzle_orm_1.eq)(schema_1.workspaceMembers.workspaceId, schema_1.workspaces.id))
            .where((0, drizzle_orm_1.eq)(schema_1.workspaceMembers.userId, userId));
        return members.map(m => ({ ...m.workspace, role: m.role }));
    }
    async create(createWorkspaceDto) {
        const slug = createWorkspaceDto.slug || createWorkspaceDto.name.toLowerCase().replace(/\s+/g, '-');
        const newWorkspace = await this.db.insert(schema_1.workspaces).values({
            name: createWorkspaceDto.name,
            slug,
            ownerId: createWorkspaceDto.ownerId,
        }).returning();
        await this.db.insert(schema_1.workspaceMembers).values({
            workspaceId: newWorkspace[0].id,
            userId: createWorkspaceDto.ownerId,
            role: 'owner',
        });
        return newWorkspace[0];
    }
    async update(id, updateData) {
        const updated = await this.db.update(schema_1.workspaces).set(updateData).where((0, drizzle_orm_1.eq)(schema_1.workspaces.id, id)).returning();
        if (!updated[0]) {
            throw new common_1.NotFoundException('Workspace not found');
        }
        return updated[0];
    }
    async remove(id) {
        const deleted = await this.db.delete(schema_1.workspaces).where((0, drizzle_orm_1.eq)(schema_1.workspaces.id, id)).returning();
        if (!deleted[0]) {
            throw new common_1.NotFoundException('Workspace not found');
        }
        return deleted[0];
    }
    async addMember(workspaceId, userId, role = 'editor') {
        return this.db.insert(schema_1.workspaceMembers).values({
            workspaceId,
            userId,
            role: role,
        }).returning();
    }
    async listMembers(workspaceId) {
        return this.db.select({ member: schema_1.workspaceMembers, user: schema_1.users })
            .from(schema_1.workspaceMembers)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.workspaceMembers.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.eq)(schema_1.workspaceMembers.workspaceId, workspaceId));
    }
    async removeMember(workspaceId, userId) {
        return this.db.delete(schema_1.workspaceMembers)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.workspaceMembers.workspaceId, workspaceId), (0, drizzle_orm_1.eq)(schema_1.workspaceMembers.userId, userId)))
            .returning();
    }
    async incrementAiTasks(workspaceId, count = 1) {
        const workspace = await this.findOne(workspaceId);
        const updated = await this.db.update(schema_1.workspaces).set({
            aiTasksToday: Number(workspace.aiTasksToday || 0) + count,
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(schema_1.workspaces.id, workspaceId)).returning();
        return updated[0];
    }
    async resetAiTasksIfNeeded(workspaceId) {
        const workspace = await this.findOne(workspaceId);
        const now = new Date();
        if (!workspace.aiTasksResetAt || new Date(workspace.aiTasksResetAt).getTime() <= now.getTime()) {
            const nextReset = new Date(now);
            nextReset.setUTCDate(nextReset.getUTCDate() + 1);
            nextReset.setUTCHours(0, 0, 0, 0);
            await this.db.update(schema_1.workspaces).set({
                aiTasksToday: 0,
                aiTasksResetAt: nextReset,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(schema_1.workspaces.id, workspaceId));
        }
    }
    async getAiQuotaLimit(plan) {
        const limits = {
            free: 20,
            pro: 200,
            enterprise: 2000,
        };
        return plan && limits[plan] ? limits[plan] : limits.free;
    }
    async ensureAiTaskAllowed(workspaceId) {
        await this.resetAiTasksIfNeeded(workspaceId);
        const workspace = await this.findOne(workspaceId);
        const limit = await this.getAiQuotaLimit(workspace.plan);
        const usage = Number(workspace.aiTasksToday || 0);
        if (usage >= limit) {
            throw new common_1.BadRequestException(`AI task quota exceeded for plan ${workspace.plan} (limit ${limit} per day)`);
        }
        return { usage, limit };
    }
};
exports.WorkspacesService = WorkspacesService;
exports.WorkspacesService = WorkspacesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_module_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [void 0])
], WorkspacesService);
//# sourceMappingURL=workspaces.service.js.map