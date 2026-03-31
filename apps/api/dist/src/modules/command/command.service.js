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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandService = void 0;
const common_1 = require("@nestjs/common");
const tasks_service_1 = require("../tasks/tasks.service");
const agents_service_1 = require("../agents/agents.service");
const files_service_1 = require("../files/files.service");
let CommandService = class CommandService {
    constructor(tasksService, agentsService, filesService) {
        this.tasksService = tasksService;
        this.agentsService = agentsService;
        this.filesService = filesService;
    }
    async interpret(command, workspaceId, userId, mode, agentId) {
        const lowerCommand = command.toLowerCase();
        if (lowerCommand.includes('buat') && lowerCommand.includes('tugas')) {
            const title = this.extractTitle(command);
            const description = this.extractDescription(command);
            if (mode === 'agent' && agentId) {
                return this.tasksService.create({
                    workspaceId,
                    title: title || command,
                    description: description || command,
                    type: 'agent',
                    priority: 'medium',
                    agentId,
                }, userId);
            }
            else {
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
            throw new Error('File upload commands should use the file upload interface');
        }
        if (lowerCommand.includes('analisis') || lowerCommand.includes('analyze')) {
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
        return this.tasksService.create({
            workspaceId,
            title: command,
            description: command,
            type: 'manual',
            priority: 'medium',
        }, userId);
    }
    extractTitle(command) {
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
    extractDescription(command) {
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
};
exports.CommandService = CommandService;
exports.CommandService = CommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tasks_service_1.TasksService,
        agents_service_1.AgentsService,
        files_service_1.FilesService])
], CommandService);
//# sourceMappingURL=command.service.js.map