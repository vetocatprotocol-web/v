import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { CommandController } from './command.controller';
import { TasksModule } from '../tasks/tasks.module';
import { AgentsModule } from '../agents/agents.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TasksModule, AgentsModule, FilesModule],
  providers: [CommandService],
  controllers: [CommandController],
})
export class CommandModule {}