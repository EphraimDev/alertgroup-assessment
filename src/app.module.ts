import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './database/prisma.module';
import { AllExceptionsFilter } from './helpers/exception.helper';
import { ResponseInterceptor } from './helpers/response.helper';
import { LoggerUtils } from './utils/logger.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    RolesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    LoggerUtils,
    AppService,
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionsFilter,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
