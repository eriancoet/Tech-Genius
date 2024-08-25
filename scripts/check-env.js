import dotenv from 'dotenv';

dotenv.config();

console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('DISCORD_CLIENT_ID:', process.env.DISCORD_CLIENT_ID);
console.log('DISCORD_CLIENT_SECRET:', process.env.DISCORD_CLIENT_SECRET);
