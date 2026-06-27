"use server";

import crypto from "crypto";

import bcrypt from "bcrypt";
import { Timestamp } from "firebase-admin/firestore";

import { registerUser, loginUser, verifyEmail, resetPassword } from "@/app/actions/UserController";
import { adminDb } from "@/lib/DatabaseInitializer";
import { transporter } from "@/lib/EmailInitializer";
import { TWO_FACTOR_CHALLENGES_COLLECTION } from "@/auth";
import type { User } from "@/types";

export type AuthActionUser = Pick<
  User,
  "user_id" | "name" | "email" | "department" | "role" | "account_status" | "two_factor_enabled"
>;

export type HandleLoginResponse =
  | {
      success: true;
      message?: string;
      user?: AuthActionUser;
      requiresTwoFactor?: false;
      challengeId?: undefined;
    }
  | {
      success: true;
      message?: string;
      user?: AuthActionUser;
      requiresTwoFactor: true;
      challengeId: string;
    }
  | {
      success: false;
      message: string;
      user?: AuthActionUser;
    };

function toSafeUser(user: User): AuthActionUser {
  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    department: user.department,
    role: user.role,
    account_status: user.account_status,
    two_factor_enabled: user.two_factor_enabled,
  };
}

async function createTwoFactorChallenge(user: User) {
  const challengeRef = adminDb.collection(TWO_FACTOR_CHALLENGES_COLLECTION).doc();
  const code = crypto.randomInt(100000, 1000000).toString();
  const codeHash = await bcrypt.hash(code, 10);

  await challengeRef.set({
    user_id: user.user_id,
    code_hash: codeHash,
    attempts: 0,
    created_at: Timestamp.now(),
    expires_at: Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000)),
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: user.email,
    subject: "Your login verification code",
    text: `Your login verification code is ${code}. It expires in 10 minutes.`,
  });

  return challengeRef.id;
}

export async function handleRegistration(formData: FormData) {
  const user_id = formData.get("student-id") as string;
  const name = formData.get("full-name") as string;
  const email = formData.get("student-email") as string;
  const password = formData.get("password") as string;
  const phone_number = formData.get("contact-number") as string;
  const department = formData.get("department") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  return registerUser({
    user_id,
    name,
    email,
    password,
    contact_number: phone_number,
    department,
  });
}

export async function handleLogin(formData: FormData): Promise<HandleLoginResponse> {
  const user_id = formData.get("user-id") as string;
  const password = formData.get("password") as string;

  if (!user_id || !password) {
    return { success: false, message: "Student ID and password are required" };
  }

  const response = await loginUser(user_id, password);

  if (!response.success) {
    return {
      success: false,
      message: response.message || "Invalid username or password",
    };
  }

  const user = response.user as User;

  if (user.two_factor_enabled) {
    const challengeId = await createTwoFactorChallenge(user);

    return {
      success: true,
      message: "Two-factor authentication required",
      user: toSafeUser(user),
      requiresTwoFactor: true,
      challengeId,
    };
  }

  return {
    success: true,
    message: "Login successful",
    user: toSafeUser(user),
  };
}

export async function handleVerifyEmail(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) return { success: false, message: "Email is required" };

  return verifyEmail(email);
}

export async function handleResetPassword(formData: FormData) {
  const user_id = formData.get("user-id") as string;
  const newPassword = formData.get("new-password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  if (!user_id) {
    return { success: false, message: "User ID is required" };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  return resetPassword(user_id, newPassword);
}
