import { PrismaClient } from '@prisma/client'; // Import PrismaClient

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

// Test connection when running this file directly
if (require.main === module) {
  testConnection();
}

export { db }; // Ensure db is exported
