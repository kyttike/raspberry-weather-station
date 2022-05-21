import { Injectable } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { ApiData, FastRaspberryDBEntry, SlowRaspberryDBEntry } from './types';

@Injectable()
export class AppService {
  private lastPublicQueryTimestamp: Date = null;
  private cachedPublicData: ApiData = null;

  private lastGreenhouseQueryTimestamp: Date = null;
  private cachedGreenhouseData: SlowRaspberryDBEntry[] = null;

  constructor(private postgresService: PostgresService) {}

  private async getDataRangeFromDB(): Promise<ApiData> {
    const pool = this.postgresService.getPool();
    const datasets = await Promise.all([
      pool.query<FastRaspberryDBEntry>(`
        SELECT *
        FROM "RaspberryFastEntry"
        WHERE "createdAt" BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW()
        ORDER BY "createdAt" ASC
      `),

      pool.query<SlowRaspberryDBEntry>(`
        SELECT "bme680Temperature", "bme680Pressure", "bme680Humidity", "bme680Gas", "rainfall", "createdAt"
        FROM "RaspberrySlowEntry"
        WHERE "createdAt" BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW()
        ORDER BY "createdAt" ASC
      `),
    ]);
    return [datasets[0].rows, datasets[1].rows];
  }

  private async getGreenhouseDataFromDB(): Promise<SlowRaspberryDBEntry[]> {
    const pool = this.postgresService.getPool();
    const data = await pool.query<SlowRaspberryDBEntry>(`
        SELECT "sht20Temperature", "sht20Humiditiy", "doorSensor", "createdAt"
        FROM "RaspberrySlowEntry"
        WHERE "createdAt" BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW()
        ORDER BY "createdAt" ASC
      `);
    return data.rows;
  }

  private getAverageSpeed(speeds: number[]) {
    return speeds.reduce((sum, curr) => sum + curr / speeds.length, 0);
  }

  // https://www.wxforum.net/index.php?topic=8660.msg82636#msg82636
  private getAverageDirection(angles: number[]) {
    const anglesAsRadians = angles.map((angle) => (angle / 180) * Math.PI);
    const NStotal = anglesAsRadians.reduce(
      (sum, angle) => sum + Math.cos(angle),
      0,
    );
    const EWtotal = anglesAsRadians.reduce(
      (sum, angle) => sum + Math.sin(angle),
      0,
    );
    const result = (Math.atan2(NStotal, EWtotal) * 180) / Math.PI;
    return result >= 0 ? result : result + 360;
  }

  private async getDatabaseData(): Promise<ApiData> {
    const [fastData, slowData] = await this.getDataRangeFromDB();
    const concentratedFastData: FastRaspberryDBEntry[] = [];
    let buffer: FastRaspberryDBEntry[] = [];
    let currentDate: Date;
    for (const fastDatum of fastData) {
      const parsedDate = new Date(fastDatum.createdAt);
      if (
        !currentDate ||
        currentDate.getMinutes() !== parsedDate.getMinutes()
      ) {
        currentDate = parsedDate;
        if (buffer.length) {
          const concentratedEntry: FastRaspberryDBEntry = {
            windDirection: this.getAverageDirection(
              buffer.map((item) => item.windDirection),
            ),
            windSpeed: this.getAverageSpeed(
              buffer.map((item) => item.windSpeed),
            ),
            createdAt: currentDate.toISOString(),
          };
          concentratedFastData.push(concentratedEntry);
          buffer = [];
        }
      }
      buffer.push(fastDatum);
    }
    return [concentratedFastData, slowData];
  }

  async getPublicData() {
    let shouldGetNewData = false;
    if (
      this.cachedPublicData === null ||
      this.lastPublicQueryTimestamp === null ||
      Date.now() - this.lastPublicQueryTimestamp.getTime() > 60 * 1000
    ) {
      shouldGetNewData = true;
    }

    if (shouldGetNewData) {
      this.cachedPublicData = await this.getDatabaseData();
      this.lastPublicQueryTimestamp = new Date();
    }
    return this.cachedPublicData;
  }

  async getGreenhouseData() {
    let shouldGetNewData = false;
    if (
      this.cachedGreenhouseData === null ||
      this.lastGreenhouseQueryTimestamp === null ||
      Date.now() - this.lastGreenhouseQueryTimestamp.getTime() > 60 * 1000
    ) {
      shouldGetNewData = true;
    }

    if (shouldGetNewData) {
      this.cachedGreenhouseData = await this.getGreenhouseDataFromDB();
      this.lastGreenhouseQueryTimestamp = new Date();
    }
    return this.cachedGreenhouseData;
  }
}
