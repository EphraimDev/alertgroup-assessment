import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/modules/auth/auth.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('AuthModule', () => {
  let app: INestApplication;
  let token = '';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideProvider(AuthService)
      // .useValue(mockAuthService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    await prisma.$queryRaw`TRUNCATE TABLE public."User" CASCADE;`;
  });

  describe('POST: auth/register', () => {
    it('should fail if firstName is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .expect(422, { message: 'First name is required' });
    });

    it('should fail if lastName is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ firstName: 'Ephraim' })
        .expect(422, { message: 'Last name is required' });
    });

    it('should fail if email is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ firstName: 'Ephraim', lastName: 'Aigbefo' })
        .expect(422, { message: 'Email is required' });
    });

    it('should fail if email is wrong', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          firstName: 'Ephraim',
          lastName: 'Aigbefo',
          email: 'aigbefoephraim',
        })
        .expect(422, { message: 'Please enter a valid email' });
    });

    it('should fail if password is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          firstName: 'Ephraim',
          lastName: 'Aigbefo',
          email: 'aigbefoephraim@yahoo.com',
        })
        .expect(422, { message: 'Password is required' });
    });

    it('should fail if password is not strong', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          firstName: 'Ephraim',
          lastName: 'Aigbefo',
          email: 'aigbefoephraim@yahoo.com',
          password: 'Password',
        })
        .expect(422, {
          message:
            'Your password must contain at least eight characters, one uppercase letter, one lowercase letter, one digit and one special character.',
        });
    });

    it('should fail if confirm password is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          firstName: 'Ephraim',
          lastName: 'Aigbefo',
          email: 'aigbefoephraim@yahoo.com',
          password: 'Password1!',
        })
        .expect(422, { message: 'Confirm password is required' });
    });

    it('should fail if confirm password is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          firstName: 'Ephraim',
          lastName: 'Aigbefo',
          email: 'aigbefoephraim@yahoo.com',
          password: 'Password1!',
          confirmPassword: 'Password',
        })
        .expect(422, {
          message: 'Confirm password must be the same as password.',
        });
    });

    it('should return OK', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          firstName: 'Ephraim',
          lastName: 'Aigbefo',
          email: 'aigbefoephraim@yahoo.com',
          password: 'Password1!',
          confirmPassword: 'Password1!',
        })
        .expect(201, { message: 'Your account was created successfully' });
    });

    it('should fail if email already exist', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          firstName: 'Ephraim',
          lastName: 'Aigbefo',
          email: 'aigbefoephraim@yahoo.com',
          password: 'Password1!',
          confirmPassword: 'Password1!',
        })
        .expect(400, { message: 'A user with this email already exist' });
    });
  });

  describe('POST: auth/login', () => {
    it('should fail if email is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .expect(422, { message: 'Email is required' });
    });

    it('should fail if email is wrong', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'aigbefoephraim',
        })
        .expect(422, { message: 'Please enter a valid email' });
    });

    it('should fail if password is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'aigbefoephraim@yahoo.com',
        })
        .expect(422, { message: 'Password is required' });
    });

    it('should return OK', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'aigbefoephraim@yahoo.com',
          password: 'Password1!',
        })
        .expect(200)
        .then((data) => {
          token = data.body.accessToken;
        });
    });

    it('should fail if email does not exist', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'aigbefoephraim1@yahoo.com',
          password: 'Password1!',
        })
        .expect(404, {
          message: 'There is no account registered to this email',
        });
    });

    it('should fail if password is wrong', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'aigbefoephraim@yahoo.com',
          password: 'Password1',
        })
        .expect(400, {
          message: 'Your password is incorrect. Please check and try again.',
        });
    });
  });
});
