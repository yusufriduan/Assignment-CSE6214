import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Timestamp } from "firebase-admin/firestore";

import { adminDb } from "@/lib/DatabaseInitializer";
import type { User as AppUser } from "@/types";

export const TWO_FACTOR_CHALLENGES_COLLECTION = "LoginTwoFactorChallenges";

export interface AuthSessionUser {
  user_id: string;
  name: string;
  email: string;
  contact_number: string;
  department: string;
  role: AppUser["role"];
  account_status: AppUser["account_status"];
  two_factor_enabled: boolean;
}

type TwoFactorChallengeRecord = {
  user_id: string;
  code_hash: string;
  created_at: Timestamp;
  expires_at: Timestamp;
  attempts: number;
};

async function verifyTwoFactorChallenge(userId: string, challengeId: string, code: string) {
  const challengeRef = adminDb.collection(TWO_FACTOR_CHALLENGES_COLLECTION).doc(challengeId);
  const challengeSnapshot = await challengeRef.get();

  if (!challengeSnapshot.exists) {
    throw new Error("Two-factor challenge not found");
  }

  const challenge = challengeSnapshot.data() as TwoFactorChallengeRecord;

  if (challenge.user_id !== userId) {
    throw new Error("Two-factor challenge does not belong to this user");
  }

  if (challenge.expires_at.toDate() < new Date()) {
    await challengeRef.delete();
    throw new Error("Two-factor code expired");
  }

  const codeMatches = await bcrypt.compare(code, challenge.code_hash);

  if (!codeMatches) {
    await challengeRef.update({ attempts: (challenge.attempts ?? 0) + 1 });
    throw new Error("Invalid two-factor code");
  }

  await challengeRef.delete();
}

const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        user_id: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" },
        challenge_id: { label: "Two-factor challenge", type: "text" },
        two_factor_code: { label: "Two-factor code", type: "text" },
      },
      authorize: async (credentials) => {
        const userId = credentials?.user_id?.toString().trim() ?? "";
        const password = credentials?.password?.toString() ?? "";
        const challengeId = credentials?.challenge_id?.toString().trim() ?? "";
        const twoFactorCode = credentials?.two_factor_code?.toString().trim() ?? "";

        if (!userId || !password) {
          throw new Error("User ID and password are required");
        }

        const userRef = adminDb.collection("Users").doc(userId);
        const userSnapshot = await userRef.get();

        if (!userSnapshot.exists) {
          throw new Error("Invalid user ID or password");
        }

        const userData = userSnapshot.data() as AppUser;

        if (userData.account_status === "Blocked") {
          throw new Error("Account is blocked");
        }

        const passwordMatches = await bcrypt.compare(password, userData.password || "");

        if (!passwordMatches) {
          throw new Error("Invalid user ID or password");
        }

        if (userData.two_factor_enabled) {
          if (!challengeId || !twoFactorCode) {
            throw new Error("Two-factor code required");
          }

          await verifyTwoFactorChallenge(userId, challengeId, twoFactorCode);
        }

        const user: AuthSessionUser = {
          user_id: userData.user_id,
          name: userData.name,
          email: userData.email,
          contact_number: userData.contact_number,
          department: userData.department,
          role: userData.role,
          account_status: userData.account_status,
          two_factor_enabled: userData.two_factor_enabled,
        };

        return {
          id: user.user_id,
          ...user,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as unknown as AuthSessionUser & { id?: string };
        token.sub = authUser.user_id ?? authUser.id ?? token.sub;
        token.name = authUser.name ?? token.name;
        token.email = authUser.email ?? token.email;
        (token as typeof token & { user?: AuthSessionUser }).user = {
          user_id: authUser.user_id,
          name: authUser.name,
          email: authUser.email,
          contact_number: authUser.contact_number,
          department: authUser.department,
          role: authUser.role,
          account_status: authUser.account_status,
          two_factor_enabled: authUser.two_factor_enabled,
        };
      }

      return token;
    },
    async session({ session, token }) {
      const authUser = (token as typeof token & { user?: AuthSessionUser }).user;

      if (authUser) {
        session.user = {
          ...(session.user ?? {}),
          id: authUser.user_id,
          user_id: authUser.user_id,
          name: authUser.name ?? session.user?.name,
          email: authUser.email ?? session.user?.email,
          emailVerified: null,
          image: null,
          contact_number: authUser.contact_number,
          department: authUser.department ?? "",
          role: authUser.role ?? "Student",
          account_status: authUser.account_status ?? "Active",
          two_factor_enabled: authUser.two_factor_enabled ?? false,
        } as unknown as typeof session.user;
      }

      return session;
    },
  },
});

export { handlers, auth, signIn, signOut };
