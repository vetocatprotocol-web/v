import { Controller, Get, Post, Param, Delete, Query, UseGuards, Request, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: any,
    @Request() req,
    @Query('workspaceId') workspaceId: string,
    @Query('tags') tags?: string,
    @Query('autoProcess') autoProcess?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!workspaceId) {
      throw new BadRequestException('workspaceId is required');
    }

    const parsedTags = tags ? tags.split(',').map(tag => tag.trim()) : [];
    const parsedAutoProcess = autoProcess === 'true';

    return this.filesService.create(file, workspaceId, req.user.userId, parsedTags, parsedAutoProcess);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('workspaceId') workspaceId: string,
    @Query('mimeType') mimeType: string,
    @Query('aiProcessed') aiProcessed: string,
    @Request() req,
  ) {
    const filters = {
      mimeType,
      aiProcessed: aiProcessed === 'true' ? true : aiProcessed === 'false' ? false : undefined,
    };

    return this.filesService.findAll(workspaceId, req.user.userId, filters);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.filesService.findOne(id, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.filesService.remove(id, req.user.userId);
  }

  @Post(':id/process')
  @UseGuards(JwtAuthGuard)
  processFile(@Param('id') id: string, @Request() req) {
    return this.filesService.processFile(id, req.user.userId);
  }

  @Get(':id/download')
  @UseGuards(JwtAuthGuard)
  async downloadFile(@Param('id') id: string, @Request() req) {
    const file = await this.filesService.findOne(id, req.user.userId);
    const stream = await this.filesService.getFileStream(id, req.user.userId);

    return {
      stream,
      file,
    };
  }
}