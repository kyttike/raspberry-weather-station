import { HttpModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RasperryMonitoringService } from './rasperryMonitoring.service';
import { PostgresService } from './postgres.service';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule.forRoot(), HttpModule],
  controllers: [AppController],
  providers: [AppService, PostgresService, RasperryMonitoringService],
})
export class AppModule {}
