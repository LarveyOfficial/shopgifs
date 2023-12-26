import NextAuth from "next-auth";
import { connectToDatabase } from "../lib/database";
import GoogleProvider from "next-auth/providers/google";


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secrete: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/panel",
  },
  callbacks: {
    async signIn({account, profile}) {
      const db = await connectToDatabase();
      const collection = await db.collection("authorizedUsers");
      const data = await collection.distinct("email");
      return data.includes(profile?.email)
    }
  }
};

export default NextAuth(authOptions);
