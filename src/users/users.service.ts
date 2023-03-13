import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';
import { IUsersRepository } from './users.repository.interface';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IConfigService) private configService: IConfigService,
    @inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository,
  ) {}
  async createUser(dto: UserRegisterDto) {
    const user = new User(dto.email, dto.name);
    const salt = parseInt(this.configService.get('SALT') as string);
    await user.setPassword(dto.password, salt);
    const userModel = await this.usersRepository.find(dto.email);
    if (userModel) {
      return null;
    }

    return await this.usersRepository.create(user);
  }

  async validateUser(dto: UserLoginDto) {
    const userModel = await this.usersRepository.find(dto.email);
    if (!userModel) {
      return false;
    }

    const user = new User(userModel.email, userModel.name);
    const salt = parseInt(this.configService.get('SALT') as string);

    return await user.comparePassword(userModel.password, dto.password, salt);
  }
}
