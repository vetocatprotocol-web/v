import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { workspaces, workspaceMembers } from '../../database/schema';
import { eq, and } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module';

@Injectable()
export class BillingService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: ReturnType<typeof drizzle>,
  ) {}

  private async ensureWorkspaceMember(workspaceId: string, userId: string) {
    const member = await this.db.select().from(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
      .limit(1);

    if (!member[0]) {
      throw new NotFoundException('Workspace access denied');
    }

    return member[0];
  }

  async getSubscription(workspaceId: string, userId: string) {
    await this.ensureWorkspaceMember(workspaceId, userId);
    const ws = await this.db.select().from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1);
    if (!ws[0]) {
      throw new NotFoundException('Workspace not found');
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

  async updateSubscription(workspaceId: string, userId: string, plan: string) {
    await this.ensureWorkspaceMember(workspaceId, userId);

    const validPlans = ['free', 'pro', 'enterprise'];
    if (!validPlans.includes(plan)) {
      throw new BadRequestException('Invalid plan');
    }

    const updated = await this.db.update(workspaces).set({ plan: plan as any, updatedAt: new Date() }).where(eq(workspaces.id, workspaceId)).returning();
    if (!updated[0]) {
      throw new NotFoundException('Workspace not found');
    }

    return this.getSubscription(workspaceId, userId);
  }

  async getUsage(workspaceId: string, userId: string, period?: string) {
    await this.ensureWorkspaceMember(workspaceId, userId);

    // period not used: stub from current state
    const ws = await this.db.select().from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1);
    if (!ws[0]) {
      throw new NotFoundException('Workspace not found');
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

  async setBudget(workspaceId: string, userId: string, limitUsd: number, alertThresholds?: number[], actionOnLimit?: string) {
    await this.ensureWorkspaceMember(workspaceId, userId);

    if (limitUsd < 0) {
      throw new BadRequestException('limit_usd must be >= 0');
    }

    await this.db.update(workspaces).set({
      billingBudgetUsd: limitUsd.toString(),
      billingAlertThresholds: alertThresholds || [50, 75, 90, 100],
      billingActionOnLimit: actionOnLimit || 'notify_only',
      updatedAt: new Date(),
    }).where(eq(workspaces.id, workspaceId));

    return { message: 'Budget updated' };
  }
}
