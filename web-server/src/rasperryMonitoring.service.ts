import { HttpService, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PostgresService } from "./postgres.service";

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
export class RasperryMonitoringService {
  constructor(
    private postgresService: PostgresService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.weatherStationUrl =
      this.configService.get<string>('WEATHERSTATION_URL');

    // Do an initial measurement to reset the state
    this.httpService.get<Required<RasperryData>>(
      `${this.weatherStationUrl}/all`,
    );
  }

  private readonly weatherStationUrl: string;
  private counter = 0;

  private async getAllEntries() {
    const allEntries = await this.httpService
      .get<Required<RasperryData>>(`${this.weatherStationUrl}/all`)
      .toPromise();

    const {
      fast: {
        windDirection,
        stateful: { windSpeed },
      },
      slow: {
        bme680: { humidity, pressure, temperature, gas },
        stateful: { rain },
      },
    } = allEntries.data;

    console.log(allEntries.data);
  }

  private async getFastEntries() {
    const fastEntries = await this.httpService
      .get<RasperryData>(`${this.weatherStationUrl}/fast`)
      .toPromise();

    const {
      windDirection,
      stateful: { windSpeed },
    } = fastEntries.data.fast;

    console.log(fastEntries.data);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async measureRaspberry() {
    try {
      if (this.counter === 5) {
        await this.getAllEntries();
      } else {
        await this.getFastEntries();
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
