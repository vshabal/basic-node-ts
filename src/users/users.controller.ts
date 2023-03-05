import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error';
import { Ilogger } from '../logger/logger.interface';

export class UserController extends BaseController {
    constructor(logger: Ilogger) {
        super(logger);
        this.bindRoutes([
            {
                path: '/register',
                method: 'post',
                func: this.register,
            },
            {
                path: '/login',
                method: 'post',
                func: this.login,
            }
        ])
    }

    private login(req: Request, res: Response, next: NextFunction) {
        next(new HTTPError(401, "Auth error", 'login'));
        // this.ok(res, 'Logged in');
    }

    private register(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'Registered');
    }
}