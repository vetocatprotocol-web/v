import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ObservabilityService } from './observability.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('observability')
export class ObservabilityController {
  constructor(private readonly observabilityService: ObservabilityService) {}

  @Get('logs')
  @UseGuards(JwtAuthGuard)
  getLogs(@Query('limit') limit = 100) {
    return {
      data: this.observabilityService.getLogs(Number(limit)),
    };
  }

  @Get('metrics')
  @UseGuards(JwtAuthGuard)
  getMetrics() {
    return {
      data: this.observabilityService.getMetrics(),
    };
  }
}
