import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './roles.service';
import { PrismaService } from '../../../src/database/prisma.service';

const prismaMock = {
  role: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const newRole = {
  name: 'Admin',
  permissions: ['READ', 'WRITE', 'DELETE'],
};

const mockRole = {
  name: 'Admin',
  permissions: ['READ', 'WRITE', 'DELETE'],
  id: 1,
  createdAt: new Date(),
};

const updatedRole = {
  name: 'Admin',
  permissions: ['READ', 'WRITE', 'DELETE', 'UPDATE'],
  id: 1,
  createdAt: new Date(),
};

describe('RoleService', () => {
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    roleService = module.get<RoleService>(RoleService);

    prismaMock.role.findUnique.mockClear();
    prismaMock.role.findMany.mockClear();
    prismaMock.role.create.mockClear();
    prismaMock.role.update.mockClear();
    prismaMock.role.delete.mockClear();
  });

  it('should be create new role', async () => {
    prismaMock.role.create.mockResolvedValue(mockRole);
    const role = await roleService.create(newRole);
    expect(role).toEqual(mockRole);
  });

  it('should update role', async () => {
    prismaMock.role.update.mockResolvedValue(updatedRole);
    const role = await roleService.update({
      where: { id: mockRole.id },
      data: { permissions: ['READ', 'WRITE', 'DELETE', 'UPDATE'] },
    });
    expect(role).toEqual(updatedRole);
  });

  it('should get one role', async () => {
    prismaMock.role.findUnique.mockResolvedValue(mockRole);
    const role = await roleService.findOne({ id: mockRole.id });
    expect(role).toEqual(mockRole);
  });

  it('should get many roles', async () => {
    prismaMock.role.findMany.mockResolvedValue([mockRole]);
    const roles = await roleService.findAll();
    expect(roles).toEqual([mockRole]);
  });

  it('should delete one role', async () => {
    prismaMock.role.delete.mockResolvedValue(mockRole);
    const role = await roleService.delete({ id: mockRole.id });
    expect(role).toEqual(mockRole);
  });
});
