import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../../src/database/prisma.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RoleService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RoleService,
  ) {}

  async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: { role: true },
    });
    return user;
  }
  async findMany(query: Prisma.UserWhereInput, skip?: number, take?: number) {
    const users = await this.prisma.user.findMany({
      where: query,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        role: { select: { name: true, permissions: true } },
      },
      skip,
      take,
    });
    return users;
  }

  async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
    const user = await this.prisma.user.create({
      data,
    });
    return user;
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUncheckedUpdateInput;
  }) {
    const user = await this.prisma.user.update({
      where: params.where,
      data: params.data,
    });
    return user;
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.delete({
      where,
    });
    return user;
  }

  async assignRole(payload: AssignRoleDto) {
    const user = await this.findOne({
      id: payload.userId,
    });
    if (!user) throw new NotFoundException('User does not exist');
    if (user.roleId === payload.roleId)
      throw new BadRequestException(
        'The selected role is already assigned to the user',
      );

    const role = await this.roleService.findOne({
      id: payload.roleId,
    });
    if (!role) throw new NotFoundException('Role does not exist');

    await this.update({
      where: { id: user.id },
      data: { roleId: role.id },
    });
    return { message: 'Your request was successful' };
  }

  async fetchAllUsers() {
    const users = await this.findMany({});
    return users;
  }

  async deleteUser(id: number) {
    const user = await this.findOne({
      id,
    });
    if (!user) throw new NotFoundException('User does not exist');

    await this.delete({
      id,
    });
    return { message: 'User deleted successfully' };
  }
}
