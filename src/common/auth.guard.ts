import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';

export class AuthGuard implements IMiddleware {
  execute(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  }
}
