import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testUserQuery() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'hradmin@test.com' },
    });
    console.log('User found:', user);
  } catch (error) {
    console.error('Database query error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserQuery();
