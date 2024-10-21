import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RoleService } from './roles.service';
import { PrismaModule } from '../../../src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RolesController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RolesModule {}
