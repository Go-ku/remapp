import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "../db";
import User from "../models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Custom role-based redirect
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      const roleRedirectMap = {
        admin: "/dashboard/admin",
        landlord: "/dashboard/landlord",
        tenant: "/dashboard/tenant",
      };

      try {
        const sessionRes = await fetch(`${baseUrl}/api/auth/session`);
        const session = await sessionRes.json();
        const role = session?.user?.role;

        return `${baseUrl}${roleRedirectMap[role] || "/dashboard"}`;
      } catch (error) {
        return `${baseUrl}/dashboard`;
      }
    },
  },
};
