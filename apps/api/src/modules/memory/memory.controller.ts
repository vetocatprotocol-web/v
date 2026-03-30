import { Controller, Get, Post, Delete, Query, Param, Body, UseGuards, Request } from '@nestjs/common';
import { MemoryService } from './memory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('memory')
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Request() req,
    @Query('workspaceId') workspaceId: string,
    @Query('type') type?: string,
    @Query('key') key?: string,
  ) {
    return { data: await this.memoryService.findAll(workspaceId, req.user.userId, type, key) };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req,
    @Query('workspaceId') workspaceId: string,
    @Body() body: { type: string; key: string; value: any },
  ) {
    const entry = await this.memoryService.create(workspaceId, req.user.userId, body);
    return { data: entry };
  }

  @Post('search')
  @UseGuards(JwtAuthGuard)
  async search(
    @Request() req,
    @Query('workspaceId') workspaceId: string,
    @Body() body: { query: string; limit?: number },
  ) {
    const results = await this.memoryService.search(workspaceId, req.user.userId, body.query, body.limit ?? 5);
    return { data: results };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    await this.memoryService.remove(id, req.user.userId);
    return { message: 'Memory entry deleted' };
  }
}
