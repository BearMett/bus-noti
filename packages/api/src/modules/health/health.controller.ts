import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  ready(): { status: string; timestamp: string } {
    // TODO: Add database connectivity check when needed
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
