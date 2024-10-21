import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidatorPipe } from '../../../src/common/pipes/validation.pipes';
import { signUpBodySchema, SignupDto } from './dto/signup.dto';
import { loginBodySchema, LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'Sign up successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 422, description: 'Invalid input' })
  @ApiBody({
    type: SignupDto,
    description: 'User sign up data',
  })
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body(new ValidatorPipe<SignupDto>(signUpBodySchema)) body: SignupDto,
  ) {
    return await this.authService.signUp(body);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Not found exception' })
  @ApiResponse({ status: 422, description: 'Invalid input' })
  @ApiBody({
    type: LoginDto,
    description: 'User login data',
  })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ValidatorPipe<LoginDto>(loginBodySchema)) body: LoginDto,
  ) {
    return await this.authService.login(body);
  }
}
