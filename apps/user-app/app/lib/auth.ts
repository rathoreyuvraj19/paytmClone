import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { z } from "zod";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "xyz@example.com" },
        password: { lable: "Password", type: "password", required: "true" },
      },
      //TODO: DO OTP validation here
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;
        const userData = {
          email,
          password,
        };
        const zodSchema = z.object({
          email: z.string(),
          password: z.string().min(3),
        });
        try {
          const { success } = await zodSchema.safeParse(userData);

          if (success) {
            const user = await db.user.findUnique({
              where: {
                email,
              },
            });
            if (!user) {
              throw new Error("User NOT FOUND");
            }
            const compare = await bcrypt.compare(password!, user.password);

            if (compare) {
              return {
                id: user.id.toString(),
                email: user.email,
                name: user.name,
              };
            } else {
              throw new Error("Password Not Correct");
            }
          } else {
            throw new Error("Invalid Data");
          }
        } catch (error) {
          console.error("Validation error:", error);
        }
        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    // TODO: can u fix the type here? Using any is bad
    async session({ token, session }: any) {
      session.user.id = token.sub;
      return session;
    },
  },
};
