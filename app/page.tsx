"use client";
import Login from "../app/login/page";

export default function page() {
  const isAuthenticated = true; // This would also come from your authentication logic
  
  if (isAuthenticated) {
    window.location.href = "/dashboard";
    return null; // Prevent rendering anything while redirecting
  } else {
    return <Login />;
  }
}