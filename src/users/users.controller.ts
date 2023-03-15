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
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';

export class UserController extends BaseController {
  constructor(
    @inject(TYPES.ILogger) logger: Ilogger,
    @inject(TYPES.IUserService) private userService: UserService,
    @inject(TYPES.IConfigService) private configService: IConfigService,
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
      const secret = this.configService.get('SECRET') || '';
      const jwt = await this.signJWT(req.body.email, secret);

      return this.ok(res, { jwt });
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

  private async signJWT(email: string, secret: string) {
    return new Promise<Error | string>((resolve, reject) => {
      sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: 'HS256',
        },
        (err, token) => {
          if (err) {
            reject(err);
          }

          resolve(token as string);
        },
      );
    });
  }
}
