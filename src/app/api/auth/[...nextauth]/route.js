

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { connect } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connect();

          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          // Find user (case-insensitive)
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          });
          
          if (!user) {
            throw new Error("No user found with this email");
          }

          // Check if password exists (Google users might not have password)
          if (!user.password) {
            throw new Error("Please sign in with Google");
          }

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            name: user.username,
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google sign-in
      if (account?.provider === "google") {
        try {
          await connect();
          
          const existingUser = await User.findOne({ 
            email: user.email.toLowerCase() 
          });
          
          if (!existingUser) {
            // Create new user for Google sign-in
            const newUser = await User.create({
              username: user.name,
              email: user.email.toLowerCase(),
              isVerified: true,
              googleId: account.providerAccountId,
            });
            console.log("✅ New Google user created:", newUser.email);
          } else {
            // Update googleId if not set
            if (!existingUser.googleId) {
              existingUser.googleId = account.providerAccountId;
              await existingUser.save();
            }
            console.log("✅ Existing Google user found:", existingUser.email);
          }
        } catch (error) {
          console.error("❌ Error in Google sign-in:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        // Fetch user from DB to get _id
        await connect();
        const dbUser = await User.findOne({ email: user.email.toLowerCase() });
        
        if (dbUser) {
          token._id = dbUser._id.toString();
          token.id = dbUser._id.toString();
          token.email = dbUser.email;
          token.name = dbUser.username;
          
          token.accessToken = jwt.sign(
            { id: dbUser._id.toString(), email: dbUser.email },
            process.env.TOKEN_SECRET,
            { expiresIn: "1d" }
          );
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id;
        session.user.id = token.id;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };