import * as fs from 'fs';
import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config/configuration';
import { HealthModule } from './modules/health/health.module';
import { StopsModule } from './modules/stops';
import { SubscriptionsModule } from './modules/subscriptions';
import { NotificationsModule } from './modules/notifications';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbPath =
          configService.get<string>('database.path') ?? './data/busnoti.sqlite';
        const dbDir = path.dirname(dbPath);

        // Ensure database directory exists
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }

        return {
          type: 'better-sqlite3',
          database: dbPath,
          autoLoadEntities: true,
          synchronize: true, // For development only
        };
      },
    }),
    ScheduleModule.forRoot(),
    HealthModule,
    StopsModule,
    SubscriptionsModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
