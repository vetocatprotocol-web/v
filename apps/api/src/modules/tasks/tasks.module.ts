import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EventsModule } from '../events/events.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AgentsModule } from '../agents/agents.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [DatabaseModule, EventsModule, AgentsModule, WorkspacesModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}