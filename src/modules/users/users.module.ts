import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { PrismaModule } from 'src/database/prisma.module';
import { RolesModule } from '../roles/roles.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
  imports: [PrismaModule, RolesModule, JwtModule]
})
export class UsersModule {}
