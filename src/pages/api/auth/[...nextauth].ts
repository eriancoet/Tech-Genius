import NextAuth, { NextAuthOptions, Session, User as DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/server/db";
import bcrypt from "bcrypt";
import { JWT as NextAuthJWT } from "next-auth/jwt";

// Define a User type that includes role as a string
interface UserWithRole extends DefaultUser {
  role: string;
}

// Extend the JWT interface to include role as a string
interface JWTWithRole extends NextAuthJWT {
  role?: string; 
}

export default NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing credentials');
          }

          const user = await db.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error('User not found');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
          } as UserWithRole;
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWTWithRole }) {
      try {
        if (token.role) {
          (session.user as UserWithRole).role = token.role;
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
    async jwt({ token, user }: { token: JWTWithRole; user?: UserWithRole }) {
      try {
        if (user) {
          token.role = user.role; // Attach role to the token
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
    async redirect({ url, baseUrl }) {
      // Redirect users to the employee list page 
      if (url === baseUrl || url.startsWith(`${baseUrl}/create-employee`) || url.startsWith(`${baseUrl}/other-page`)) {
        return baseUrl + '/employees';
      }
      return url;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
} as NextAuthOptions);
