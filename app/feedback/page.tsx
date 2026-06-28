"use client";

import { useState } from "react";
import { MdHome, MdCalendarMonth, MdPerson } from "react-icons/md";
import { useUser } from "@/app/components/UserBoundary/UserContext";
import { submitFeedback } from "@/app/actions/FeedbackController";

export default function FeedbackPage() {
  const { user, isLoading } = useUser();
  const [form, setForm] = useState({
    resourceName: "",
    bookingDate: "",
    comments: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!form.comments.trim()) {
      alert("Please provide feedback comments.");
      return;
    }

    if (!user) {
      alert("You must be logged in to submit feedback.");
      return;
    }

    const response = await submitFeedback({
      user_id: user.user_id,
      user_name: user.name,
      user_email: user.email,
      department: user.department,
      resource_name: form.resourceName,
      booking_date: form.bookingDate,
      comments: form.comments,
    });

    if (response.success) {
      setSubmitted(true);
      setTimeout(() => {
        setForm({ resourceName: "", bookingDate: "", comments: "" });
        setSubmitted(false);
      }, 2000);
    } else {
      alert(response.message || "Error submitting feedback. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading user data...</div>;
  }

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
              <input
                value={form.resourceName}
                onChange={(e) => handleChange("resourceName", e.target.value)}
                placeholder="Booking resource name"
                className="w-full bg-white rounded-3xl px-4 py-3 text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Booking Date</label>
              <input
                type="date"
                value={form.bookingDate}
                onChange={(e) => handleChange("bookingDate", e.target.value)}
                className="w-full bg-white rounded-3xl px-4 py-3 text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
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
