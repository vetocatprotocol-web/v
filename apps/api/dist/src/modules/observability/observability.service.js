"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservabilityService = void 0;
const common_1 = require("@nestjs/common");
let ObservabilityService = class ObservabilityService {
    constructor() {
        this.logs = [];
        this.metrics = {
            http_requests_total: 0,
            task_executions_total: 0,
            agent_executions_total: 0,
            errors_total: 0,
        };
    }
    log(level, message, details) {
        this.logs.unshift({ timestamp: new Date().toISOString(), level, message, details });
        if (this.logs.length > 500) {
            this.logs.pop();
        }
        if (level === 'error') {
            this.metrics.errors_total += 1;
        }
    }
    increment(metric, count = 1) {
        if (!(metric in this.metrics)) {
            this.metrics[metric] = 0;
        }
        this.metrics[metric] += count;
    }
    getLogs(limit = 100) {
        return this.logs.slice(0, limit);
    }
    getMetrics() {
        return this.metrics;
    }
};
exports.ObservabilityService = ObservabilityService;
exports.ObservabilityService = ObservabilityService = __decorate([
    (0, common_1.Injectable)()
], ObservabilityService);
//# sourceMappingURL=observability.service.js.map