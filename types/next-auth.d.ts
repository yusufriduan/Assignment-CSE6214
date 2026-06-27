import type { DefaultSession } from "next-auth";
import type { DefaultUser } from "next-auth";

import type { User as AppUser } from "@/types";

declare module "next-auth" {
  interface Session {
    user: AppUser & DefaultSession["user"];
  }

  interface User extends AppUser, DefaultUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: AppUser;
  }
}