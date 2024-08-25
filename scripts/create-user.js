import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createOrUpdateUser() {
  try {
    const email = 'hradmin@test.com';
    const hashedPassword = await bcrypt.hash('TestPass1234', 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'Admin',
      },
      create: {
        email,
        password: hashedPassword,
        role: 'Admin',
      },
    });

    console.log('User created or updated:', user);
  } catch (error) {
    console.error('Error creating or updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createOrUpdateUser();
