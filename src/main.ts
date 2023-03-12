import { Container } from 'inversify';
import { ContainerModule } from 'inversify/lib/container/container_module';
import { interfaces } from 'inversify/lib/interfaces/interfaces';
import { App } from './App';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { ExceptionFilter } from './errors/exception.filter';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { Ilogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { IUserService } from './users/user.service.interface';
import { UserController } from './users/users.controller';
import { UserService } from './users/users.service';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<Ilogger>(TYPES.ILogger).to(LoggerService);
  bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
  bind<UserController>(TYPES.UserController).to(UserController);
  bind<App>(TYPES.Application).to(App);
  bind<IUserService>(TYPES.IUserService).to(UserService);
  bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
});

function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);
  app.init();

  return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
