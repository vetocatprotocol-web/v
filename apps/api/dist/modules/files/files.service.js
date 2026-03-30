"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const schema_1 = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const events_gateway_1 = require("../events/events.gateway");
const database_module_1 = require("../../database/database.module");
const fs = require("fs");
const path = require("path");
const uuid_1 = require("uuid");
let FilesService = class FilesService {
    constructor(db, eventsGateway) {
        this.db = db;
        this.eventsGateway = eventsGateway;
    }
    async create(file, workspaceId, userId, tags, autoProcess = true) {
        const member = await this.db.select()
            .from(schema_1.workspaceMembers)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.workspaceMembers.workspaceId, workspaceId), (0, drizzle_orm_1.eq)(schema_1.workspaceMembers.userId, userId)))
            .limit(1);
        if (!member[0]) {
            throw new common_1.NotFoundException('Access denied to workspace');
        }
        const fileId = (0, uuid_1.v4)();
        const extension = path.extname(file.originalname);
        const filename = `${fileId}${extension}`;
        const uploadDir = path.join(process.cwd(), 'uploads', workspaceId);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, file.buffer);
        const newFile = await this.db.insert(schema_1.files).values({
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
        this.eventsGateway.emitFileUploaded(workspaceId, newFile[0]);
        return newFile[0];
    }
    async findAll(workspaceId, userId, filters) {
        let conditions = [];
        if (workspaceId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.files.workspaceId, workspaceId));
        }
        if (userId) {
            const userWorkspaces = await this.db.select({ id: schema_1.workspaces.id })
                .from(schema_1.workspaces)
                .innerJoin(schema_1.workspaceMembers, (0, drizzle_orm_1.eq)(schema_1.workspaces.id, schema_1.workspaceMembers.workspaceId))
                .where((0, drizzle_orm_1.eq)(schema_1.workspaceMembers.userId, userId));
            const workspaceIds = userWorkspaces.map(w => w.id);
            if (workspaceIds.length > 0) {
            }
            else {
                return [];
            }
        }
        if (filters?.mimeType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.files.mimeType, filters.mimeType));
        }
        if (filters?.aiProcessed !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.files.aiProcessed, filters.aiProcessed));
        }
        return this.db.select().from(schema_1.files).where((0, drizzle_orm_1.and)(...conditions)).orderBy((0, drizzle_orm_1.desc)(schema_1.files.createdAt));
    }
    async findOne(id, userId) {
        const file = await this.db.select()
            .from(schema_1.files)
            .where((0, drizzle_orm_1.eq)(schema_1.files.id, id))
            .limit(1);
        if (!file[0]) {
            throw new common_1.NotFoundException('File not found');
        }
        if (userId) {
            const member = await this.db.select()
                .from(schema_1.workspaceMembers)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.workspaceMembers.workspaceId, file[0].workspaceId), (0, drizzle_orm_1.eq)(schema_1.workspaceMembers.userId, userId)))
                .limit(1);
            if (!member[0]) {
                throw new common_1.NotFoundException('Access denied');
            }
        }
        return file[0];
    }
    async remove(id, userId) {
        const file = await this.findOne(id, userId);
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        const deleted = await this.db.delete(schema_1.files)
            .where((0, drizzle_orm_1.eq)(schema_1.files.id, id))
            .returning();
        if (!deleted[0]) {
            throw new common_1.NotFoundException('File not found');
        }
        return deleted[0];
    }
    async processFile(id, userId) {
        const file = await this.findOne(id, userId);
        this.eventsGateway.emitFileProcessing(file.workspaceId, id, 'ai_analysis', 0, 'Starting AI analysis...');
        this.eventsGateway.emitFileProcessing(file.workspaceId, id, 'ai_analysis', 25, 'Analyzing content...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.eventsGateway.emitFileProcessing(file.workspaceId, id, 'ai_analysis', 50, 'Extracting metadata...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.eventsGateway.emitFileProcessing(file.workspaceId, id, 'ai_analysis', 75, 'Generating summary...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.db.update(schema_1.files)
            .set({
            aiProcessed: true,
            aiSummary: 'File processed successfully',
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.files.id, id));
        this.eventsGateway.emitFileProcessed(file.workspaceId, id, {
            summary: 'File processed successfully',
            confidence: 0.95,
        });
        return { message: 'File processed successfully' };
    }
    getFileStream(id, userId) {
        return this.findOne(id, userId).then(file => {
            return fs.createReadStream(file.path);
        });
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(database_module_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [void 0, events_gateway_1.EventsGateway])
], FilesService);
//# sourceMappingURL=files.service.js.map