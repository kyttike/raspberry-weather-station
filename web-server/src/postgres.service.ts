import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class PostgresService implements OnModuleInit, OnModuleDestroy {
  private readonly postgresPool: Pool;

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>('DATABASE_URL');
    this.postgresPool = new Pool({ connectionString });
  }
  async onModuleInit() {
    await this.postgresPool.connect();
  }

  async onModuleDestroy() {
    await this.postgresPool.end();
  }

  public getPool(): Pool {
    return this.postgresPool;
  }
}
