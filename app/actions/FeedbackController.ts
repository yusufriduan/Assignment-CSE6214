"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { Timestamp } from "firebase-admin/firestore";
import { Feedback } from "@/types";

export async function submitFeedback(feedbackData: Omit<Feedback, "created_at">) {
  try {
    await adminDb.collection("Feedback").add({
      ...feedbackData,
      created_at: Timestamp.now(),
    });
    return { success: true, message: "Feedback submitted successfully." };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unable to submit feedback" };
  }
}
