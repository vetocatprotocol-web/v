import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createAgentDto: any, @Request() req) {
    return this.agentsService.create(createAgentDto, req.user.userId);
  }

  @Get()
  findAll(@Query() query: { type?: string; category?: string; isMarketplace?: string }) {
    const filters = {
      ...query,
      isMarketplace: query.isMarketplace === 'true',
    };
    return this.agentsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.agentsService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateAgentDto: any) {
    return this.agentsService.update(id, updateAgentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }

  @Post(':id/execute')
  @UseGuards(JwtAuthGuard)
  execute(@Param('id') id: string, @Body() taskInput: any) {
    return this.agentsService.executeAgent(id, taskInput);
  }
}