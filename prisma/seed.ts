import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      permissions: ['READ', 'WRITE', 'DELETE'],
    },
  });
  const user = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: {
      name: 'User',
      permissions: ['READ', 'WRITE'],
    },
  });
  console.log({ admin, user });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
