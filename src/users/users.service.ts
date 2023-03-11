import { injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
  async createUser(dto: UserRegisterDto) {
    const user = new User(dto.email, dto.name);
    await user.setPassword(dto.password);
    // check the user exists
    // if exists return null
    // if does not exist, create
    return null;
  }

  async validateUser(dto: UserLoginDto) {
    return true;
  }
}
