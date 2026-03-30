import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EventsModule } from '../events/events.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [DatabaseModule, EventsModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}