import { HttpModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { RasperryMonitoringService } from './rasperryMonitoring.service';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule.forRoot(), HttpModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, RasperryMonitoringService],
})
export class AppModule {}
