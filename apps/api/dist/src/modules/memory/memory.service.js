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
exports.MemoryService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const schema_1 = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../../database/database.module");
let MemoryService = class MemoryService {
    constructor(db) {
        this.db = db;
    }
    async ensureWorkspaceMember(workspaceId, userId) {
        const member = await this.db.select()
            .from(schema_1.workspaceMembers)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.workspaceMembers.workspaceId, workspaceId), (0, drizzle_orm_1.eq)(schema_1.workspaceMembers.userId, userId)))
            .limit(1);
        if (!member[0]) {
            throw new common_1.NotFoundException('Workspace access denied');
        }
        return member[0];
    }
    async findAll(workspaceId, userId, type, key) {
        await this.ensureWorkspaceMember(workspaceId, userId);
        const conditions = [(0, drizzle_orm_1.eq)(schema_1.memory.workspaceId, workspaceId)];
        if (type)
            conditions.push((0, drizzle_orm_1.eq)(schema_1.memory.type, type));
        if (key)
            conditions.push((0, drizzle_orm_1.eq)(schema_1.memory.key, key));
        return this.db.select().from(schema_1.memory).where((0, drizzle_orm_1.and)(...conditions)).orderBy((0, drizzle_orm_1.desc)(schema_1.memory.createdAt));
    }
    async create(workspaceId, userId, data) {
        if (!data.type || !data.key || data.value === undefined || data.value === null) {
            throw new common_1.BadRequestException('type, key, and value are required');
        }
        await this.ensureWorkspaceMember(workspaceId, userId);
        const existing = await this.db.select().from(schema_1.memory).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.memory.workspaceId, workspaceId), (0, drizzle_orm_1.eq)(schema_1.memory.key, data.key), (0, drizzle_orm_1.eq)(schema_1.memory.userId, userId))).limit(1);
        if (existing[0]) {
            const updated = await this.db.update(schema_1.memory).set({
                value: data.value,
                type: data.type,
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(schema_1.memory.id, existing[0].id)).returning();
            return updated[0];
        }
        const newEntry = await this.db.insert(schema_1.memory).values({
            workspaceId,
            userId,
            type: data.type,
            key: data.key,
            value: data.value,
            source: 'explicit',
        }).returning();
        return newEntry[0];
    }
    async search(workspaceId, userId, query, limit = 5) {
        await this.ensureWorkspaceMember(workspaceId, userId);
        if (!query || !query.trim()) {
            throw new common_1.BadRequestException('Query is required');
        }
        const entries = await this.db.select().from(schema_1.memory)
            .where((0, drizzle_orm_1.eq)(schema_1.memory.workspaceId, workspaceId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.memory.updatedAt));
        const normalized = query.toLowerCase();
        const matched = entries.filter(entry => {
            const keyMatch = entry.key.toLowerCase().includes(normalized);
            const valueMatch = JSON.stringify(entry.value).toLowerCase().includes(normalized);
            return keyMatch || valueMatch;
        });
        return matched.slice(0, limit);
    }
    async remove(memoryId, userId) {
        const entry = await this.db.select().from(schema_1.memory).where((0, drizzle_orm_1.eq)(schema_1.memory.id, memoryId)).limit(1);
        if (!entry[0]) {
            throw new common_1.NotFoundException('Memory entry not found');
        }
        await this.ensureWorkspaceMember(entry[0].workspaceId, userId);
        await this.db.delete(schema_1.memory).where((0, drizzle_orm_1.eq)(schema_1.memory.id, memoryId));
        return { message: 'Memory entry deleted' };
    }
};
exports.MemoryService = MemoryService;
exports.MemoryService = MemoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(database_module_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [void 0])
], MemoryService);
//# sourceMappingURL=memory.service.js.map