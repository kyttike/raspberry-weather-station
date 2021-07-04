import { Injectable } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { FastRaspberryDBEntry, SlowRaspberryDBEntry } from './types';

@Injectable()
export class AppService {
  constructor(private postgresService: PostgresService) {}

  private async getDataRangeFromDB(): Promise<
    [FastRaspberryDBEntry[], SlowRaspberryDBEntry[]]
  > {
    const pool = this.postgresService.getPool();
    const datasets = await Promise.all([
      pool.query<FastRaspberryDBEntry>(`
        SELECT *
        FROM "RaspberryFastEntry"
        WHERE "createdAt" BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW()
        ORDER BY "createdAt" ASC
      `),
      pool.query<SlowRaspberryDBEntry>(`
        SELECT *
        FROM "RaspberrySlowEntry"
        WHERE "createdAt" BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW()
        ORDER BY "createdAt" ASC
      `),
    ]);
    return [datasets[0].rows, datasets[1].rows];
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

  async getData() {
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
}
