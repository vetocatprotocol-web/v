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
exports.IntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const schema_1 = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../../database/database.module");
let IntegrationsService = class IntegrationsService {
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
    async list(workspaceId, userId) {
        await this.ensureWorkspaceMember(workspaceId, userId);
        return this.db.select().from(schema_1.integrations).where((0, drizzle_orm_1.eq)(schema_1.integrations.workspaceId, workspaceId)).orderBy((0, drizzle_orm_1.desc)(schema_1.integrations.createdAt));
    }
    async connect(workspaceId, userId, provider) {
        await this.ensureWorkspaceMember(workspaceId, userId);
        const state = `${workspaceId}:${provider}:${Math.random().toString(36).slice(2)}`;
        const oauthUrl = `https://oauth.example.com/${provider}?client_id=fake-client-id&state=${encodeURIComponent(state)}`;
        const existing = await this.db.select().from(schema_1.integrations)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.integrations.workspaceId, workspaceId), (0, drizzle_orm_1.eq)(schema_1.integrations.provider, provider)))
            .limit(1);
        if (!existing[0]) {
            await this.db.insert(schema_1.integrations).values({
                workspaceId,
                provider: provider,
                status: 'disconnected',
                syncStatus: 'disconnected',
            });
        }
        return { oauth_url: oauthUrl, state };
    }
    async callback(workspaceId, userId, provider, code, state) {
        await this.ensureWorkspaceMember(workspaceId, userId);
        const integration = await this.db.select().from(schema_1.integrations)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.integrations.workspaceId, workspaceId), (0, drizzle_orm_1.eq)(schema_1.integrations.provider, provider)))
            .limit(1);
        if (!integration[0]) {
            throw new common_1.NotFoundException('Integration not found');
        }
        const accessToken = `access-${provider}-${code}`;
        const refreshToken = `refresh-${provider}-${code}`;
        const updated = await this.db.update(schema_1.integrations).set({
            status: 'connected',
            config: { provider },
            accessToken,
            refreshToken,
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(schema_1.integrations.id, integration[0].id)).returning();
        return updated[0];
    }
    async triggerSync(integrationId, userId) {
        const integration = await this.db.select().from(schema_1.integrations).where((0, drizzle_orm_1.eq)(schema_1.integrations.id, integrationId)).limit(1);
        if (!integration[0]) {
            throw new common_1.NotFoundException('Integration not found');
        }
        await this.ensureWorkspaceMember(integration[0].workspaceId, userId);
        await this.db.update(schema_1.integrations).set({
            syncStatus: 'syncing',
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(schema_1.integrations.id, integrationId));
        setTimeout(async () => {
            await this.db.update(schema_1.integrations).set({
                syncStatus: 'connected',
                lastSyncedAt: new Date(),
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(schema_1.integrations.id, integrationId));
        }, 1000);
        return { message: 'Sync queued' };
    }
    async disconnect(integrationId, userId) {
        const integration = await this.db.select().from(schema_1.integrations).where((0, drizzle_orm_1.eq)(schema_1.integrations.id, integrationId)).limit(1);
        if (!integration[0]) {
            throw new common_1.NotFoundException('Integration not found');
        }
        await this.ensureWorkspaceMember(integration[0].workspaceId, userId);
        await this.db.delete(schema_1.integrations).where((0, drizzle_orm_1.eq)(schema_1.integrations.id, integrationId));
        return { message: 'Integration disconnected' };
    }
};
exports.IntegrationsService = IntegrationsService;
exports.IntegrationsService = IntegrationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(database_module_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [void 0])
], IntegrationsService);
//# sourceMappingURL=integrations.service.js.map