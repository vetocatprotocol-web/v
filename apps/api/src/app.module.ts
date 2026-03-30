import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { AgentsModule } from './modules/agents/agents.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    WorkspacesModule,
    TasksModule,
    AgentsModule,
  ],
})
export class AppModule {}