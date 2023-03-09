import 'reflect-metadata';
import { injectable } from 'inversify/lib/annotation/injectable';
import { Logger } from 'tslog';
import { Ilogger } from './logger.interface';

@injectable()
export class LoggerService implements Ilogger {
  private logger: Logger<{}>;

  constructor() {
    this.logger = new Logger();
  }

  log(...args: unknown[]) {
    this.logger.info(...args);
  }

  warn(...args: unknown[]) {
    this.logger.warn(...args);
  }

  error(...args: unknown[]) {
    this.logger.error(...args);
  }
}
