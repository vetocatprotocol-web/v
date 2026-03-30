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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const schema_1 = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../../database/database.module");
let BillingService = class BillingService {
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
    async getSubscription(workspaceId, userId) {
        await this.ensureWorkspaceMember(workspaceId, userId);
        const ws = await this.db.select().from(schema_1.workspaces).where((0, drizzle_orm_1.eq)(schema_1.workspaces.id, workspaceId)).limit(1);
        if (!ws[0]) {
            throw new common_1.NotFoundException('Workspace not found');
        }
        return {
            workspaceId: ws[0].id,
            plan: ws[0].plan,
            aiTasksToday: ws[0].aiTasksToday,
            billingBudgetUsd: Number(ws[0].billingBudgetUsd || 0),
            billingAlertThresholds: ws[0].billingAlertThresholds || [50, 75, 90, 100],
            billingActionOnLimit: ws[0].billingActionOnLimit || 'notify_only',
        };
    }
    async updateSubscription(workspaceId, userId, plan) {
        await this.ensureWorkspaceMember(workspaceId, userId);
        const validPlans = ['free', 'pro', 'enterprise'];
        if (!validPlans.includes(plan)) {
            throw new common_1.BadRequestException('Invalid plan');
        }
        const updated = await this.db.update(schema_1.workspaces).set({ plan: plan, updatedAt: new Date() }).where((0, drizzle_orm_1.eq)(schema_1.workspaces.id, workspaceId)).returning();
        if (!updated[0]) {
            throw new common_1.NotFoundException('Workspace not found');
        }
        return this.getSubscription(workspaceId, userId);
    }
    async getUsage(workspaceId, userId, period) {
        await this.ensureWorkspaceMember(workspaceId, userId);
        const ws = await this.db.select().from(schema_1.workspaces).where((0, drizzle_orm_1.eq)(schema_1.workspaces.id, workspaceId)).limit(1);
        if (!ws[0]) {
            throw new common_1.NotFoundException('Workspace not found');
        }
        return {
            workspaceId,
            period: period || new Date().toISOString().slice(0, 7),
            aiTasksUsed: Number(ws[0].aiTasksToday || 0),
            aiTaskLimit: ws[0].plan === 'enterprise' ? 2000 : ws[0].plan === 'pro' ? 200 : 20,
            costUsd: (Number(ws[0].aiTasksToday || 0) * 0.02).toFixed(2),
            budgetUsd: Number(ws[0].billingBudgetUsd || 0),
        };
    }
    async setBudget(workspaceId, userId, limitUsd, alertThresholds, actionOnLimit) {
        await this.ensureWorkspaceMember(workspaceId, userId);
        if (limitUsd < 0) {
            throw new common_1.BadRequestException('limit_usd must be >= 0');
        }
        await this.db.update(schema_1.workspaces).set({
            billingBudgetUsd: limitUsd.toString(),
            billingAlertThresholds: alertThresholds || [50, 75, 90, 100],
            billingActionOnLimit: actionOnLimit || 'notify_only',
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(schema_1.workspaces.id, workspaceId));
        return { message: 'Budget updated' };
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(database_module_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [void 0])
], BillingService);
//# sourceMappingURL=billing.service.js.map