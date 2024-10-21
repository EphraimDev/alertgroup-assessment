import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/database/prisma.service';
import { UsersService } from './users.service';
import { RoleService } from '../roles/roles.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const prismaMock = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const roleServiceMock = {
  findOne: jest.fn(),
};

const mockuser = {
  id: 1,
  email: 'testemail',
  firstName: 'testfirstname',
  lastName: 'testlastname',
  passwordHash: 'hashedPassword',
  roleId: 1,
};

const newUserPayload = {
  email: 'testemail',
  firstName: 'testfirstname',
  lastName: 'testlastname',
  passwordHash: 'hashedPassword',
};

const mockRole = {
  name: 'Admin',
  permissions: ['READ', 'WRITE', 'DELETE'],
  id: 1,
  createdAt: new Date(),
};

describe('UsersService', () => {
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: RoleService,
          useValue: roleServiceMock,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);

    prismaMock.user.findUnique.mockClear();
    prismaMock.user.findMany.mockClear();
    prismaMock.user.create.mockClear();
    prismaMock.user.update.mockClear();
    prismaMock.user.delete.mockClear();
  });

  it('should create new user', async () => {
    prismaMock.user.create.mockResolvedValue(mockuser);
    const user = await userService.create(newUserPayload);
    expect(user).toEqual(mockuser);
  });

  it('should update user', async () => {
    prismaMock.user.update.mockResolvedValue(mockuser);
    const user = await userService.update({
      where: { id: mockuser.id },
      data: { firstName: 'Name' },
    });
    expect(user).toEqual(mockuser);
  });

  it('should get one user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockuser);
    const user = await userService.findOne({ id: mockuser.id });
    expect(user).toEqual(mockuser);
  });

  it('should get many users', async () => {
    prismaMock.user.findMany.mockResolvedValue([mockuser]);
    const users = await userService.findMany({});
    expect(users).toEqual([mockuser]);
  });

  it('should delete one user', async () => {
    prismaMock.user.delete.mockResolvedValue(mockuser);
    const user = await userService.delete({ id: mockuser.id });
    expect(user).toEqual(mockuser);
  });

  it('should assign role', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockuser);
    roleServiceMock.findOne.mockResolvedValue(mockRole);
    prismaMock.user.update.mockResolvedValue(mockuser);
    const response = await userService.assignRole({
      userId: mockuser.id,
      roleId: 2,
    });
    expect(response).toEqual({ message: 'Your request was successful' });
  });

  it('should fail if the role has already been assigned to the user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockuser);
    await expect(
      userService.assignRole({
        userId: mockuser.id,
        roleId: mockuser.roleId,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should fail if the role does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockuser);
    roleServiceMock.findOne.mockResolvedValue(null);
    await expect(
      userService.assignRole({
        userId: mockuser.id,
        roleId: 2,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should fail if user does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(
      userService.assignRole({
        userId: mockuser.id,
        roleId: 2,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should fetch all users', async () => {
    prismaMock.user.findMany.mockResolvedValue([mockuser]);
    const users = await userService.fetchAllUsers();
    expect(users).toEqual([mockuser]);
  });

  it('should delete user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockuser);
    const response = await userService.deleteUser(mockuser.id);
    expect(response).toEqual({ message: 'User deleted successfully' });
  });

  it('should fail to delete user if user does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(userService.deleteUser(mockuser.id)).rejects.toThrow(NotFoundException);
  });
});
