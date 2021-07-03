import { Injectable } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { FastRaspberryDBEntry, SlowRaspberryDBEntry } from './types';

@Injectable()
export class AppService {
  constructor(private postgresService: PostgresService) {}

  private async getDataRangeFromDB(): Promise<[FastRaspberryDBEntry[], SlowRaspberryDBEntry[]]> {
    const pool = this.postgresService.getPool();
    const datasets = await Promise.all([
      pool.query<FastRaspberryDBEntry>(`
        SELECT *
        FROM "RaspberryFastEntry"
        WHERE "createdAt" BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW()
        ORDER BY "createdAt" DESC
      `),
      pool.query<SlowRaspberryDBEntry>(`
        SELECT *
        FROM "RaspberrySlowEntry"
        WHERE "createdAt" BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW()
        ORDER BY "createdAt" DESC
      `),
    ]);
    return [datasets[0].rows, datasets[1].rows];
  }

  async getData() {
    return await this.getDataRangeFromDB();
  }
}
