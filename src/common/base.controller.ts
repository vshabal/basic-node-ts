import 'reflect-metadata';
import { Response, Router } from 'express';
import { IControllerRoute } from './route.interface';
import { Ilogger } from '../logger/logger.interface';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: Ilogger) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  private send<T>(res: Response, code: number, message: T) {
    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message);
  }

  public created(res: Response) {
    return res.sendStatus(201);
  }

  protected bindRoutes(routes: IControllerRoute[]) {
    routes.forEach((route) => {
      this.logger.log(`Router for ${route.method} ${route.path} was registered`);
      const handler = route.func.bind(this);
      const middlewares = route.middlewares?.map((middleware) =>
        middleware.execute.bind(middleware),
      );
      const pipeline = middlewares ? [...middlewares, handler] : [handler];
      this.router[route.method](route.path, pipeline);
    });
  }
}
