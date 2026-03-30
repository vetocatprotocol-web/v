import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { files, workspaces, workspaceMembers } from '../../database/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { EventsGateway } from '../events/events.gateway';
import { DATABASE_CONNECTION } from '../../database/database.module';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: ReturnType<typeof drizzle>,
    private eventsGateway: EventsGateway,
  ) {}

  async create(
    file: any,
    workspaceId: string,
    userId: string,
    tags?: string[],
    autoProcess: boolean = true,
  ) {
    // Check workspace access
    const member = await this.db.select()
      .from(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
      .limit(1);

    if (!member[0]) {
      throw new NotFoundException('Access denied to workspace');
    }

    // Generate unique filename
    const fileId = uuidv4();
    const extension = path.extname(file.originalname);
    const filename = `${fileId}${extension}`;
    const uploadDir = path.join(process.cwd(), 'uploads', workspaceId);

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);

    // Save file to disk
    fs.writeFileSync(filePath, file.buffer);

    // Save to database
    const newFile = await this.db.insert(files).values({
      workspaceId,
      name: filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      path: filePath,
      url: `/api/v1/files/${fileId}/download`,
      tags: tags || [],
      uploadedBy: userId,
    }).returning();

    // Emit file uploaded event
    this.eventsGateway.emitFileUploaded(workspaceId, newFile[0]);

    // TODO: Trigger AI processing if autoProcess is true

    return newFile[0];
  }

  async findAll(workspaceId?: string, userId?: string, filters?: {
    mimeType?: string;
    aiProcessed?: boolean;
  }) {
    let conditions = [];

    if (workspaceId) {
      conditions.push(eq(files.workspaceId, workspaceId));
    }

    if (userId) {
      // Only show files from workspaces user is member of
      const userWorkspaces = await this.db.select({ id: workspaces.id })
        .from(workspaces)
        .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
        .where(eq(workspaceMembers.userId, userId));

      const workspaceIds = userWorkspaces.map(w => w.id);
      if (workspaceIds.length > 0) {
        conditions.push(inArray(files.workspaceId, workspaceIds));
      } else {
        return [];
      }
    }

    if (filters?.mimeType) {
      conditions.push(eq(files.mimeType, filters.mimeType));
    }

    if (filters?.aiProcessed !== undefined) {
      conditions.push(eq(files.aiProcessed, filters.aiProcessed));
    }

    if (conditions.length > 0) {
      return this.db.select().from(files).where(and(...conditions)).orderBy(desc(files.createdAt));
    }

    return this.db.select().from(files).orderBy(desc(files.createdAt));
  }

  async findOne(id: string, userId?: string) {
    const file = await this.db.select()
      .from(files)
      .where(eq(files.id, id))
      .limit(1);

    if (!file[0]) {
      throw new NotFoundException('File not found');
    }

    if (userId) {
      // Check access
      const member = await this.db.select()
        .from(workspaceMembers)
        .where(and(eq(workspaceMembers.workspaceId, file[0].workspaceId), eq(workspaceMembers.userId, userId)))
        .limit(1);

      if (!member[0]) {
        throw new NotFoundException('Access denied');
      }
    }

    return file[0];
  }

  async remove(id: string, userId?: string) {
    const file = await this.findOne(id, userId);

    // Delete from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete from database
    const deleted = await this.db.delete(files)
      .where(eq(files.id, id))
      .returning();

    if (!deleted[0]) {
      throw new NotFoundException('File not found');
    }

    return deleted[0];
  }

  async processFile(id: string, userId?: string) {
    const file = await this.findOne(id, userId);

    // Emit processing started
    this.eventsGateway.emitFileProcessing(file.workspaceId, id, 'ai_analysis', 0, 'Starting AI analysis...');

    // TODO: Implement AI processing logic
    // This would integrate with AI services to analyze the file

    // Simulate processing steps
    this.eventsGateway.emitFileProcessing(file.workspaceId, id, 'ai_analysis', 25, 'Analyzing content...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.eventsGateway.emitFileProcessing(file.workspaceId, id, 'ai_analysis', 50, 'Extracting metadata...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.eventsGateway.emitFileProcessing(file.workspaceId, id, 'ai_analysis', 75, 'Generating summary...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For now, just mark as processed
    await this.db.update(files)
      .set({
        aiProcessed: true,
        aiSummary: 'File processed successfully',
        updatedAt: new Date(),
      })
      .where(eq(files.id, id));

    // Emit processing completed
    this.eventsGateway.emitFileProcessed(file.workspaceId, id, {
      summary: 'File processed successfully',
      confidence: 0.95,
    });

    return { message: 'File processed successfully' };
  }

  getFileStream(id: string, userId?: string) {
    return this.findOne(id, userId).then(file => {
      return fs.createReadStream(file.path);
    });
  }
}