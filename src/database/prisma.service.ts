import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { Ilogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
  private client: PrismaClient;

  constructor(@inject(TYPES.ILogger) private logger: Ilogger) {
    this.client = new PrismaClient();
  }

  async connect() {
    await this.client.$connect();
    this.logger.log('Connected to db');
  }

  async disconnect() {
    await this.client.$disconnect();
  }
}
