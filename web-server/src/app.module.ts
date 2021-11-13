import { HttpModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RasperryMonitoringService } from './rasperryMonitoring.service';
import { PostgresService } from './postgres.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PicturesService } from './pictures.service';
import { join } from 'path';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    HttpModule,
    ServeStaticModule.forRoot({
      serveRoot: '/pictures',
      rootPath: join(__dirname, '..', 'pictures'),
      serveStaticOptions: {
        redirect: false,
        index: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PostgresService,
    RasperryMonitoringService,
    PicturesService,
  ],
})
export class AppModule {}
