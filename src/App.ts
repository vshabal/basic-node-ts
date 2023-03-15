import 'reflect-metadata';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './errors/exception.filter';
import { Ilogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import bodyParser from 'body-parser';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';
import { IConfigService } from './config/config.service.interface';

@injectable()
export class App {
  private app: Express;

  private port: number;

  constructor(
    @inject(TYPES.ILogger) private logger: Ilogger,
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
    @inject(TYPES.PrismaService) private prismaService: PrismaService,
    @inject(TYPES.IConfigService) private configService: IConfigService,
  ) {
    this.app = express();
    this.port = 8000;
  }

  private useMiddlwares() {
    this.app.use(bodyParser.json());
    const authMiddleware = new AuthMiddleware(this.configService.get('SECRET') as string);
    this.app.use(authMiddleware.execute.bind(authMiddleware));
  }

  private useRoutes() {
    this.app.use('/users', this.userController.router);
  }

  private useExceptionFilters() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.useMiddlwares();
    this.useRoutes();
    this.useExceptionFilters();
    await this.prismaService.connect();
    this.app.listen(this.port);
    this.logger.log(`The server is running on http://localhost:${this.port}`);
  }
}
