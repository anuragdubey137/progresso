import CredentialsProvider from "next-auth/providers/credentials";
//@ts-ignore
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import { prismaClient } from "@/app/lib/db";
import { z } from "zod";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
  interface User {
    id: string;
    username: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    password?: string;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    id: string;
    username: string;
    name?: string | null;
    image?: string | null;
    password?: string;
  }
}

const credentialSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { 
          label: "Username", 
          type: "text", 
          placeholder: "Enter your username" 
        },
        password: { 
          label: "Password", 
          type: "password",
          placeholder: "Enter your password"
        },
      },
      
      async authorize(credentials: any) {
        // Validate credentials format
        const parsedCredentials = credentialSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error("Invalid credentials format:", parsedCredentials.error.errors);
          return null; // Don't use alert in server-side code
        }

        if (!credentials?.username || !credentials?.password) {
          console.error("Missing username or password");
          return null;
        }

        try {
          // Check if user exists
          const existingUser = await prismaClient.user.findFirst({
            where: {
              username: credentials.username,
            },
          });

          if (existingUser) {
            // User exists, verify password
            const passwordValidation = await bcrypt.compare(
              credentials.password,
              existingUser.password
            );
            
            if (passwordValidation) {
              return {
                id: existingUser.id,
                username: existingUser.username,
                name: existingUser.name || existingUser.username, // Add name field
              };
            } else {
              console.error("Invalid password for user:", credentials.username);
              return null;
            }
          } else {
            // User doesn't exist, create new user
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            
            const newUser = await prismaClient.user.create({
              data: {
                username: credentials.username,
                password: hashedPassword,
              },
            });

            return {
              id: newUser.id,
              username: newUser.username,
              name: newUser.name || newUser.username,
            };
          }
        } catch (error) {
          console.error("Database error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks:{
    async session({session, token}){
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async jwt({token, user}){
      if(user){
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
      }
      return token;
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };