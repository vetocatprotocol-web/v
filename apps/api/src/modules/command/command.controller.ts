import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommandService } from './command.service';

@Controller('command')
@UseGuards(JwtAuthGuard)
export class CommandController {
  constructor(private commandService: CommandService) {}

  @Post('interpret')
  async interpret(
    @Body() body: { command: string; workspaceId: string; mode: 'manual' | 'agent' | 'hybrid'; agentId?: string },
    @Request() req,
  ) {
    return this.commandService.interpret(
      body.command,
      body.workspaceId,
      req.user.userId,
      body.mode,
      body.agentId,
    );
  }
}