import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    roleWhereUniqueInput: Prisma.RoleWhereUniqueInput,
  ): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: roleWhereUniqueInput,
    });
    return role;
  }
  async findAll() {
    const roles = await this.prisma.role.findMany();
    return roles;
  }

  async create(data: Prisma.RoleCreateInput): Promise<Role> {
    const role = await this.prisma.role.create({
      data,
    });
    return role;
  }

  async update(params: {
    where: Prisma.RoleWhereUniqueInput;
    data: Prisma.RoleUpdateInput;
  }): Promise<Role> {
    const role = await this.prisma.role.update({
      where: params.where,
      data: params.data,
    });
    return role;
  }

  async delete(where: Prisma.RoleWhereUniqueInput): Promise<Role> {
    const role = await this.prisma.role.delete({
      where,
    });
    return role;
  }
}
