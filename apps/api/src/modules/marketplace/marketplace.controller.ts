import { Controller, Get, Post, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('agents')
  @UseGuards(JwtAuthGuard)
  async listAgents(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('category') category?: string,
    @Query('sort') sort?: string,
  ) {
    return this.marketplaceService.getAgents({ page, perPage, category, sort });
  }

  @Post('agents/:agentId/install')
  @UseGuards(JwtAuthGuard)
  async installAgent(@Param('agentId') agentId: string, @Query('workspaceId') workspaceId: string, @Request() req) {
    const installed = await this.marketplaceService.installAgent(workspaceId, agentId, req.user.userId);
    return { data: installed };
  }
}
