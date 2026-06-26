"use client";

import { useState } from "react";
import { MdHome, MdCalendarMonth, MdPerson } from "react-icons/md";

export default function FeedbackPage() {
  const [form, setForm] = useState({
    resourceName: "Central Lecture Complex (CLC)",
    bookingDate: "2026-05-29",
    comments: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (!form.comments.trim()) {
      alert("Please provide feedback comments.");
      return;
    }

    // Prepare data for Google Forms submission
    const googleFormData = {
      entry_1: form.resourceName,
      entry_2: form.bookingDate,
      entry_3: form.comments,
    };

    // Submit to Google Form (replace with actual google form later)
    const googleFormUrl =
      "";

    // Create form data
    const formData = new URLSearchParams(googleFormData as any);

    // Submit via fetch (CORS might be an issue, handled by Google)
    fetch(googleFormUrl, {
      method: "POST",
      body: formData,
      mode: "no-cors",
    })
      .then(() => {
        console.log("Feedback submitted successfully");
        setSubmitted(true);
        // Reset form after 2 seconds
        setTimeout(() => {
          setForm({
            resourceName: "Central Lecture Complex (CLC)",
            bookingDate: "2026-05-29",
            comments: "",
          });
          setSubmitted(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        alert("Error submitting feedback. Please try again.");
      });
  };

  if (submitted) {
    return (
      <div className="h-full w-full max-w-lg mx-auto flex flex-col pb-32 bg-white">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-black mb-2">
            Thank You for Your Feedback!
          </h2>
          <p className="text-gray-600 text-center">
            Your feedback has been submitted successfully and will help us improve our services.
          </p>
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 drop-shadow-2xl">
          <div className="w-fit bg-gray-300 rounded-full px-6 py-3 flex justify-center gap-8">
            <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-black">
              <MdHome size={24} />
              <span className="text-sm font-medium">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-black">
              <MdCalendarMonth size={24} />
              <span className="text-sm font-medium">Booking</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-black">
              <MdPerson size={24} />
              <span className="text-sm font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full max-w-lg mx-auto flex flex-col pb-32 bg-white">
      <div className="p-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-black">Feedback</h1>
        <p className="mt-2 text-sm text-gray-600">
          Help us improve by sharing your experience with the resource.
        </p>
      </div>

      <form className="p-6 space-y-5 flex-1" onSubmit={handleSubmit}>
        <div className="rounded-3xl bg-gray-100 p-4">
          <p className="text-base font-semibold text-black mb-3">Booking Details</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Resource</label>
              <p className="text-base font-semibold text-gray-800">
                {form.resourceName}
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Booking Date</label>
              <p className="text-base font-semibold text-gray-800">
                {form.bookingDate}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-base font-bold text-black mb-2">
            Your Feedback
          </label>
          <textarea
            value={form.comments}
            onChange={(e) => handleChange("comments", e.target.value)}
            placeholder="Please share your feedback, suggestions, or concerns..."
            className="w-full bg-gray-200 rounded-3xl px-4 py-3 text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows={5}
            required
          />
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition"
          >
            Submit Feedback
          </button>
          <p className="text-xs text-gray-500 text-center">
            Your feedback is important to us and will be kept confidential.
          </p>
        </div>
      </form>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 drop-shadow-2xl">
        <div className="w-fit bg-gray-300 rounded-full px-6 py-3 flex justify-center gap-8">
          <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-black">
            <MdHome size={24} />
            <span className="text-sm font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-black">
            <MdCalendarMonth size={24} />
            <span className="text-sm font-medium">Booking</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-black">
            <MdPerson size={24} />
            <span className="text-sm font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
