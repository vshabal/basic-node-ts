import { NextFunction, Request, Response } from 'express';
import { Ilogger } from '../logger/logger.interface';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http-error';

export class ExceptionFilter implements IExceptionFilter {
    constructor(private logger: Ilogger) {
        this.logger = logger;
    }
    catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction) {
        if (err instanceof HTTPError) {
            this.catchHTTPError(err, req, res, next);
        } else {
            this.catchGenericError(err, req, res, next);           
        }
    }

    catchHTTPError(err: HTTPError, req: Request, res: Response, next: NextFunction) {
        this.logger.error(`[${err.context}] Error ${err.statusCode}: ${err.message}`);
        res.status(err.statusCode).send({ err: err.message });
    }

    catchGenericError(err: Error, req: Request, res: Response, next: NextFunction) {
        this.logger.error(err.message);
        res.status(500).send({ err: err.message });
    }
}