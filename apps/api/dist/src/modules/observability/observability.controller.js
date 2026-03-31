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
exports.ObservabilityController = void 0;
const common_1 = require("@nestjs/common");
const observability_service_1 = require("./observability.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ObservabilityController = class ObservabilityController {
    constructor(observabilityService) {
        this.observabilityService = observabilityService;
    }
    getLogs(limit = 100) {
        return {
            data: this.observabilityService.getLogs(Number(limit)),
        };
    }
    getMetrics() {
        return {
            data: this.observabilityService.getMetrics(),
        };
    }
};
exports.ObservabilityController = ObservabilityController;
__decorate([
    (0, common_1.Get)('logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ObservabilityController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)('metrics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ObservabilityController.prototype, "getMetrics", null);
exports.ObservabilityController = ObservabilityController = __decorate([
    (0, common_1.Controller)('observability'),
    __metadata("design:paramtypes", [observability_service_1.ObservabilityService])
], ObservabilityController);
//# sourceMappingURL=observability.controller.js.map