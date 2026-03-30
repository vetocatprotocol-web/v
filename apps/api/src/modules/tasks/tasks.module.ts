import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EventsModule } from '../events/events.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AgentsModule } from '../agents/agents.module';

@Module({
  imports: [DatabaseModule, EventsModule, AgentsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}