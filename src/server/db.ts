import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function testConnection() {
  try {
    await db.$connect();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await db.$disconnect();
  }
}

testConnection();

export { db };
