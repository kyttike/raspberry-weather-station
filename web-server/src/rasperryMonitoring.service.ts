import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PostgresService } from './postgres.service';
import { FastRaspberrySensorData, SlowRaspberrySensorData } from './types';

interface RasperryData {
  fast: FastRaspberrySensorData;
  slow?: SlowRaspberrySensorData;
  timeStamp: string;
}

@Injectable()
export class RasperryMonitoringService implements OnModuleInit {
  private readonly shouldSkipMonitoring: boolean = false;

  constructor(
    private postgresService: PostgresService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.weatherStationUrl =
      this.configService.get<string>('WEATHERSTATION_URL');

    if (this.weatherStationUrl.length === 0) {
      this.shouldSkipMonitoring = true;
    }
  }

  async onModuleInit() {
    if (this.shouldSkipMonitoring) {
      return;
    }

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
      [windSpeed ?? null, windDirection ?? null],
    );

    if (!data.slow) {
      return;
    }

    const {
      bme680: { humidity, pressure, temperature, gas },
      sht20: { humidity: sht20Humidity, temperature: sht20Temperature },
      door,
      stateful: { rain },
    } = data.slow;

    await pool.query(
      'INSERT INTO "RaspberrySlowEntry"("bme680Humidity", "bme680Pressure", "bme680Temperature", "bme680Gas", "rainfall", "sht20Humidity", "sht20Temperature", "doorSensor") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        humidity ?? null,
        pressure ?? null,
        temperature ?? null,
        gas ?? null,
        rain ?? null,
        sht20Humidity ?? null,
        sht20Temperature ?? null,
        door ?? null,
      ],
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async measureRaspberry() {
    if (this.shouldSkipMonitoring) {
      return;
    }

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
