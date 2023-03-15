import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import { IMiddleware } from './middleware.interface';

export class AuthMiddleware implements IMiddleware {
  constructor(private secret: string) {}
  execute(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      verify(token, this.secret, (err, payload) => {
        if (err) {
          next();
        } else if (payload) {
          const castedPayload = payload as JwtPayload;
          req.user = castedPayload.email;
          next();
        }
      });
    } else {
      next();
    }
  }
}
