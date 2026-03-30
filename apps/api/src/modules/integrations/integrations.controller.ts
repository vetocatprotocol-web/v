import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Query('workspaceId') workspaceId: string, @Request() req) {
    return { data: await this.integrationsService.list(workspaceId, req.user.userId) };
  }

  @Post(':provider/connect')
  @UseGuards(JwtAuthGuard)
  async connect(@Param('provider') provider: string, @Query('workspaceId') workspaceId: string, @Request() req) {
    return { data: await this.integrationsService.connect(workspaceId, req.user.userId, provider) };
  }

  @Post(':provider/callback')
  @UseGuards(JwtAuthGuard)
  async callback(@Param('provider') provider: string, @Query('workspaceId') workspaceId: string, @Body() body: { code: string; state: string }, @Request() req) {
    return { data: await this.integrationsService.callback(workspaceId, req.user.userId, provider, body.code, body.state) };
  }

  @Post(':integrationId/sync')
  @UseGuards(JwtAuthGuard)
  async sync(@Param('integrationId') integrationId: string, @Request() req) {
    return this.integrationsService.triggerSync(integrationId, req.user.userId);
  }

  @Delete(':integrationId')
  @UseGuards(JwtAuthGuard)
  async disconnect(@Param('integrationId') integrationId: string, @Request() req) {
    return this.integrationsService.disconnect(integrationId, req.user.userId);
  }
}
