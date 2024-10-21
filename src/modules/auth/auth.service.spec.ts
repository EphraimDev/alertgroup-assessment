import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

dotenv.config();

const userServiceMock = {
  findOne: jest.fn(),
  create: jest.fn(),
};
const jwtServiceMock = {
  signAsync: jest.fn(),
};

const mockuser = {
  id: 1,
  email: 'testemail',
  firstName: 'testfirstname',
  lastName: 'testlastname',
  passwordHash: bcrypt.hashSync('password', Number(process.env.BCRYPT_SALT)),
};

const newUserPayload = {
  email: 'testemail',
  firstName: 'testfirstname',
  lastName: 'testlastname',
  password: 'Password1!',
  confirmPassword: 'Password1!',
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    userServiceMock.findOne.mockClear();
    userServiceMock.create.mockClear();
  });

  describe('Register', () => {
    it('should create a new user', async () => {
      userServiceMock.findOne.mockResolvedValue(null);

      const result = await authService.signUp(newUserPayload);
      expect(result).toEqual({
        message: 'Your account was created successfully',
      });
    });

    it('should throw BadRequestException if user with the email exist', async () => {
      userServiceMock.findOne.mockResolvedValue(mockuser);

      await expect(authService.signUp(newUserPayload)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if password does not match confirmPassword', async () => {
      userServiceMock.findOne.mockResolvedValue(mockuser);

      await expect(
        authService.signUp({ ...newUserPayload, confirmPassword: 'Password' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Login', () => {
    it('should login successfully', async () => {
      userServiceMock.findOne.mockResolvedValue(mockuser);
      jwtServiceMock.signAsync.mockResolvedValueOnce('token');

      const response = await authService.login({
        email: 'testemail',
        password: 'password',
      });

      expect(response).toEqual({ accessToken: 'token' });
    });

    it('should throw NotFoundException if user with the email does not exist', async () => {
      userServiceMock.findOne.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'doesnotexist', password: 'Password' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if wrong password', async () => {
      userServiceMock.findOne.mockResolvedValue(mockuser);

      await expect(
        authService.login({ email: 'testemail', password: 'Password' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
