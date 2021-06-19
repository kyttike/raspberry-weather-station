import { HttpService, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';

interface RasperryData {
  bme680: {
    humidity: number;
    pressure: number;
    temperature: number;
  };
  stateful: {
    rain: number;
    wind: number;
  };
}

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.weatherStationUrl =
      this.configService.get<string>('WEATHERSTATION_URL');
  }

  private readonly weatherStationUrl: string;
  private counter = 0;

  @Cron(CronExpression.EVERY_10_SECONDS)
  async measureRaspberry() {
    try {
      const rasperryData = await this.httpService
        .get<RasperryData>(this.weatherStationUrl)
        .toPromise();
      console.log(rasperryData);
    } catch (e) {
      console.log(e);
    }
  }
}
