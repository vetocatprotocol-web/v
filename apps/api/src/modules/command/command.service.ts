import { Injectable } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { AgentsService } from '../agents/agents.service';
import { FilesService } from '../files/files.service';

@Injectable()
export class CommandService {
  constructor(
    private tasksService: TasksService,
    private agentsService: AgentsService,
    private filesService: FilesService,
  ) {}

  async interpret(command: string, workspaceId: string, userId: string, mode: 'manual' | 'agent' | 'hybrid', agentId?: string) {
    // Simple command interpretation logic
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('buat') && lowerCommand.includes('tugas')) {
      // Create task command
      const title = this.extractTitle(command);
      const description = this.extractDescription(command);

      if (mode === 'agent' && agentId) {
        // Create agent task
        return this.tasksService.create({
          workspaceId,
          title: title || command,
          description: description || command,
          type: 'agent',
          priority: 'medium',
          agentId,
        }, userId);
      } else {
        // Create manual task
        return this.tasksService.create({
          workspaceId,
          title: title || command,
          description: description || command,
          type: 'manual',
          priority: 'medium',
        }, userId);
      }
    }

    if (lowerCommand.includes('upload') || lowerCommand.includes('unggah')) {
      // File upload command - this would need file handling
      throw new Error('File upload commands should use the file upload interface');
    }

    if (lowerCommand.includes('analisis') || lowerCommand.includes('analyze')) {
      // Analysis command
      const title = `Analisis: ${command}`;
      return this.tasksService.create({
        workspaceId,
        title,
        description: command,
        type: mode === 'agent' && agentId ? 'agent' : 'manual',
        priority: 'high',
        agentId: mode === 'agent' ? agentId : undefined,
      }, userId);
    }

    // Default: create a manual task
    return this.tasksService.create({
      workspaceId,
      title: command,
      description: command,
      type: 'manual',
      priority: 'medium',
    }, userId);
  }

  private extractTitle(command: string): string | null {
    // Simple extraction logic - can be enhanced with NLP
    const patterns = [
      /buat\s+tugas\s+(.+?)(?:\s+dengan|\s+untuk|$)/i,
      /create\s+task\s+(.+?)(?:\s+with|\s+for|$)/i,
    ];

    for (const pattern of patterns) {
      const match = command.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return null;
  }

  private extractDescription(command: string): string | null {
    // Extract description after certain keywords
    const descPatterns = [
      /(?:dengan|untuk|with|for)\s+(.+)/i,
    ];

    for (const pattern of descPatterns) {
      const match = command.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return null;
  }
}