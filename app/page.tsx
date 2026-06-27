"use client";
import Login from "@/app/login/page";
import { redirect } from "next/navigation";

export default function page() {
  const isAuthenticated = true; // This would also come from your authentication logic
  
  if (isAuthenticated) {
    redirect("/dashboard");
    return null; // Prevent rendering anything while redirecting
  } else {
    return <Login />;
  }
}