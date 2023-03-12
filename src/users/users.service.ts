import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
  constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {}
  async createUser(dto: UserRegisterDto) {
    const user = new User(dto.email, dto.name);
    const salt = parseInt(this.configService.get('SALT') as string);
    await user.setPassword(dto.password, salt);
    // check the user exists
    // if exists return null
    // if does not exist, create
    return null;
  }

  async validateUser(dto: UserLoginDto) {
    return true;
  }
}
