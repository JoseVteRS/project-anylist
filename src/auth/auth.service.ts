import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/inputs';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.userService.create(signupInput);
    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.userService.findOneByEmail(loginInput.email);

    if (!compareSync(loginInput.password, user.password))
      throw new BadRequestException('Credentials do not match');

    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.userService.findOneById(id);

    // Usually we use UnauthorizedException, following github way for its privates repositories
    if (!user.isActive) throw new NotFoundException('User not found');

    delete user.password;

    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }
}
