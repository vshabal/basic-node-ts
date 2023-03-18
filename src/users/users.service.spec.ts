import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IUserService } from './user.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './users.service';
import { User } from './user.entity';

const ConfigServiceMock: IConfigService = {
  get: jest.fn(),
};
const UsersRepositoryMock: IUsersRepository = {
  create: jest.fn(),
  find: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
  container.bind<IUserService>(TYPES.IUserService).to(UserService);
  container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(ConfigServiceMock);
  container.bind<IUsersRepository>(TYPES.IUsersRepository).toConstantValue(UsersRepositoryMock);

  configService = container.get<IConfigService>(TYPES.IConfigService);
  usersRepository = container.get<IUsersRepository>(TYPES.IUsersRepository);
  usersService = container.get<IUserService>(TYPES.IUserService);
});

describe('User Service', () => {
  it('creates user', async () => {
    configService.get = jest.fn().mockReturnValueOnce('1');
    usersRepository.create = jest.fn().mockImplementationOnce((user: User) => ({
      name: user.name,
      email: user.email,
      password: user.password,
      id: 1,
    }));
    usersRepository.find = jest.fn().mockReturnValueOnce(null);

    const user = await usersService.createUser({
      email: 'tset@a.com',
      password: 'pass',
      name: 'name',
    });
    expect(user?.id).toEqual(1);
  });
});
