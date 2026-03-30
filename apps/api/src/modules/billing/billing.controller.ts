import { Controller, Get, Put, Body, Query, UseGuards, Request } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  async getSubscription(@Query('workspaceId') workspaceId: string, @Request() req) {
    return { data: await this.billingService.getSubscription(workspaceId, req.user.userId) };
  }

  @Put('subscription')
  @UseGuards(JwtAuthGuard)
  async updateSubscription(@Query('workspaceId') workspaceId: string, @Body() body: { plan: string }, @Request() req) {
    return { data: await this.billingService.updateSubscription(workspaceId, req.user.userId, body.plan) };
  }

  @Get('usage')
  @UseGuards(JwtAuthGuard)
  async getUsage(@Query('workspaceId') workspaceId: string, @Query('period') period: string, @Request() req) {
    return { data: await this.billingService.getUsage(workspaceId, req.user.userId, period) };
  }

  @Put('budget')
  @UseGuards(JwtAuthGuard)
  async setBudget(@Query('workspaceId') workspaceId: string, @Body() body: { limit_usd: number; alert_thresholds?: number[]; action_on_limit?: string }, @Request() req) {
    return { data: await this.billingService.setBudget(workspaceId, req.user.userId, body.limit_usd, body.alert_thresholds, body.action_on_limit) };
  }
}
