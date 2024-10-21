import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signUp(payload: SignupDto) {
    const user = await this.userService.findOne({ email: payload.email });
    if (user)
      throw new BadRequestException('A user with this email already exist');

    await this.userService.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      passwordHash: bcrypt.hashSync(
        payload.password,
        Number(this.configService.getOrThrow('BCRYPT_SALT')),
      ),
    });
    return { message: 'Your account was created successfully' };
  }

  async login(payload: LoginDto) {
    const user = await this.userService.findOne({ email: payload.email });
    if (!user)
      throw new NotFoundException(
        'There is no account registered to this email',
      );
    if (!bcrypt.compareSync(payload.password, user.passwordHash))
      throw new BadRequestException(
        'Your password is incorrect. Please check and try again.',
      );
    const jwtpayload = { sub: user.id, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(jwtpayload),
    };
  }
}
