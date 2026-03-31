import { Injectable } from '@nestjs/common';

@Injectable()
export class ObservabilityService {
  private logs: Array<{ timestamp: string; level: 'info' | 'warn' | 'error'; message: string; details?: any }> = [];
  private metrics: { [key: string]: number } = {
    http_requests_total: 0,
    task_executions_total: 0,
    agent_executions_total: 0,
    errors_total: 0,
  };

  log(level: 'info' | 'warn' | 'error', message: string, details?: any) {
    this.logs.unshift({ timestamp: new Date().toISOString(), level, message, details });
    if (this.logs.length > 500) {
      this.logs.pop();
    }

    if (level === 'error') {
      this.metrics.errors_total += 1;
    }
  }

  increment(metric: keyof ObservabilityService['metrics'], count = 1) {
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
}
