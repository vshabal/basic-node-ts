import express, { Express } from 'express';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { userRouter } from './users/users';
import { UserController } from './users/users.controller';

export class App {
    private app: Express;

    private port: number;

    private logger: LoggerService;

    private userController: UserController;

    private exceptionFilter: ExceptionFilter;

    constructor(logger: LoggerService, userController: UserController, exceptionFilter: ExceptionFilter) {
        this.app = express();
        this.port = 8000;
        this.logger = logger;
        this.userController = userController;
        this.exceptionFilter = exceptionFilter;
    }

    private useRoutes() {
        this.app.use('/users', this.userController.router)
    }

    private useExceptionFilters() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init() {
        this.useRoutes();
        this.useExceptionFilters();
        this.app.listen(this.port);
        this.logger.log(`The server is running on http://localhost:${this.port}`);
    }
}