import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error';
import { Ilogger } from '../logger/logger.interface';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserService } from './users.service';
import { ValidateMiddleware } from '../common/validate.middleware';

export class UserController extends BaseController {
  constructor(
    @inject(TYPES.ILogger) logger: Ilogger,
    @inject(TYPES.IUserService) private userService: UserService,
  ) {
    super(logger);
    this.bindRoutes([
      {
        path: '/register',
        method: 'post',
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      {
        path: '/login',
        method: 'post',
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
    ]);
  }

  private async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction) {
    if (await this.userService.validateUser(req.body)) {
      return this.ok(res, 'ok');
    }
    next(new HTTPError(401, 'Auth error', 'login'));
  }

  private async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ) {
    const result = await this.userService.createUser(body);
    if (!result) {
      return next(new HTTPError(422, 'user already exists'));
    }

    this.ok(res, { email: result.email, id: result.id });
  }
}
