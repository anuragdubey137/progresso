
import CredentialsProvider from "next-auth/providers/credentials";
// @ts-ignore
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import { prismaClient } from "@/app/lib/db";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
         const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await prismaClient.user.findFirst ({
          where: {
            username: credentials.username,
          },
        });

        if (existingUser) {
          
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id,
              username: existingUser.username,
            };
          } else {
            return null;
          }
        } 
          try {
            const user = await prismaClient.user.create({
              data: {
                username: credentials.username,
                password: hashedPassword,
              },
            });

            return {
              id: user.id,
              username: user.username,
            };
          } catch (e) {
            console.log(e);
            console.error(e);
          }
          return null;
        
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});


export { handler as GET, handler as POST };
