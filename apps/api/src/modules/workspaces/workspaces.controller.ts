import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createWorkspaceDto: { name: string; slug?: string }, @Request() req) {
    return this.workspacesService.create({
      ...createWorkspaceDto,
      ownerId: req.user.userId,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.workspacesService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findByUser(@Request() req) {
    return this.workspacesService.findByUser(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.workspacesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateWorkspaceDto: any) {
    return this.workspacesService.update(id, updateWorkspaceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.workspacesService.remove(id);
  }

  @Post(':id/members')
  @UseGuards(JwtAuthGuard)
  addMember(@Param('id') id: string, @Body() body: { userId: string; role?: string }) {
    return this.workspacesService.addMember(id, body.userId, body.role);
  }

  @Delete(':id/members/:userId')
  @UseGuards(JwtAuthGuard)
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.workspacesService.removeMember(id, userId);
  }
}