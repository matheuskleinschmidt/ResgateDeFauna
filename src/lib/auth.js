import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import { signInSchema } from "./zod";
import User from "@/app/api/models/users";

export const authOptions = {

  providers: [
    CredentialsProvider({
      name: "Credentials",
      //credentials: {},
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }
      
        try {
          const { email, password } = signInSchema.parse(credentials);
      
          const user = await User.findOne({ where: { email } });
      
          if (!user) {
            return null;
          }
      
          const isValidPassword = await bcrypt.compare(password, user.password);
      
          if (!isValidPassword) {
            return null;
          }
      
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Zod validation error:", error.errors);
            return null;
          } else {
            console.error("Authorization error:", error);
            return null;
          }
        }
      },      
    }),
  ],
    pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60, 
  },
  jwt: {
    maxAge: 3 * 24 * 60 * 60,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session && token) {
        session.user = session.user || {};
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
