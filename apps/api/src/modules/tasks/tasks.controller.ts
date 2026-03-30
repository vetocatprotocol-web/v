import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTaskDto: any, @Request() req) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('workspaceId') workspaceId: string, @Request() req) {
    return this.tasksService.findAll(workspaceId, req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTaskDto: any, @Request() req) {
    return this.tasksService.update(id, updateTaskDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(id, req.user.userId);
  }

  @Post(':id/execute')
  @UseGuards(JwtAuthGuard)
  execute(@Param('id') id: string, @Request() req) {
    return this.tasksService.executeTask(id, req.user.userId);
  }
}