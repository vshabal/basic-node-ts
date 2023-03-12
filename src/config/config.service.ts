import { IConfigService } from './config.service.interface';
import { config, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { Ilogger } from '../logger/logger.interface';

@injectable()
export class ConfigService implements IConfigService {
  private config?: DotenvParseOutput;

  constructor(@inject(TYPES.ILogger) private logger: Ilogger) {
    const result = config();
    if (result.error) {
      this.logger.error(result.error);
    } else {
      this.logger.log('Dotenv config loaded');
      this.config = result.parsed;
    }
  }

  get(key: string) {
    if (this.config) {
      return this.config[key];
    }
  }
}
