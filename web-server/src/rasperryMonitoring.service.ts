import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PostgresService } from './postgres.service';

interface RasperryData {
  fast: {
    windDirection: number;
    stateful: {
      windSpeed: number;
    };
  };
  slow?: {
    bme680: {
      humidity: number;
      pressure: number;
      temperature: number;
      gas: number;
    };
    stateful: {
      rain: number;
    };
  };
  timeStamp: string;
}

@Injectable()
export class RasperryMonitoringService implements OnModuleInit {
  constructor(
    private postgresService: PostgresService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.weatherStationUrl =
      this.configService.get<string>('WEATHERSTATION_URL');
  }

  async onModuleInit() {
    // Do an initial measurement to reset the state
    console.log('Flushing stale state');
    await this.httpService.get<Required<RasperryData>>(
      `${this.weatherStationUrl}/all`,
    );
  }

  private readonly weatherStationUrl: string;
  private counter = 0;

  private async saveToDatabase(data: RasperryData) {
    const {
      windDirection,
      stateful: { windSpeed },
    } = data.fast;

    const pool = this.postgresService.getPool();
    await pool.query(
      'INSERT INTO "RaspberryFastEntry"("windSpeed", "windDirection") VALUES($1, $2)',
      [windSpeed, windDirection],
    );

    if (!data.slow) {
      return;
    }

    const {
      bme680: { humidity, pressure, temperature, gas },
      stateful: { rain },
    } = data.slow;

    await pool.query(
      'INSERT INTO "RaspberrySlowEntry"("bme680Humidity", "bme680Pressure", "bme680Temperature", "bme680Gas", "rainfall") VALUES ($1, $2, $3, $4, $5)',
      [humidity, pressure, temperature, gas, rain],
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async measureRaspberry() {
    try {
      if (this.counter === 5) {
        const { data } = await this.httpService
          .get<Required<RasperryData>>(`${this.weatherStationUrl}/all`)
          .toPromise();
        await this.saveToDatabase(data);
      } else {
        const { data } = await this.httpService
          .get<RasperryData>(`${this.weatherStationUrl}/fast`)
          .toPromise();
        await this.saveToDatabase(data);
      }
    } catch (e) {
      console.log(e);
    }

    this.counter++;
    if (this.counter >= 6) {
      this.counter = 0;
    }
  }
}
