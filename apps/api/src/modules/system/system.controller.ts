import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class SystemController {
  @Get()
  health() {
    return {
      status: 'ok',
      version: '1.0.0',
      uptime: process.uptime(),
      services: {
        database: 'ok',
        redis: 'unknown',
      },
    };
  }
}
