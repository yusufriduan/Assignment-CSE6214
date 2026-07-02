"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { MdArrowBack } from "react-icons/md";
import { fetchBookingForEdit, editBooking } from "../../actions/BookingController";

interface EditBookingForm {
  booking_id: string;
  user_id: string;
  fullName: string;
  phone: string;
  email: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  purpose: string;
  venue: string;
  room: string;
  resource_id: string;
  equipments: { equipment_name: string; equipment_count: number }[];
  prev_booking: string | null;
}

export default function EditBookingsPage() {
  const router = useRouter();
  const { id: bookingId } = useParams<{ id: string }>();
  const { data: session, status } = useSession();
  
  const [form, setForm] = useState<EditBookingForm>({
    booking_id: "",
    user_id: "",
    fullName: "",
    phone: "",
    email: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    purpose: "",
    venue: "",
    room: "",
    resource_id: "",
    equipments: [],
    prev_booking: null,
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const minDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (bookingId) {
      loadBooking(bookingId);
    } else {
      setLoadingError("No booking ID provided");
      setLoading(false);
    }
  }, [bookingId]);

  const loadBooking = async (id: string) => {
    try {
      setLoading(true);
      setLoadingError(null);

      const result = await fetchBookingForEdit(id);
      
      if (result.error) {
        setLoadingError(result.error);
        setLoading(false);
        return;
      }

      if (result.success && result.data) {
        setForm(result.data);
      }
    } catch (err) {
      console.error("Error fetching booking:", err);
      setLoadingError("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof EditBookingForm, value: string) => {
    setFormError(null); // Clear validation errors on change
    setForm((prev) => {
      const newForm = { ...prev, [field]: value };

      // When start date changes, if end date is now invalid, reset it to the new start date.
      if (field === "startDate" && newForm.endDate && new Date(value) > new Date(newForm.endDate)) {
        newForm.endDate = value;
      }

      // When start time changes on the same day, if end time is now invalid, reset it.
      if (field === "startTime" && newForm.startDate === newForm.endDate && value > newForm.endTime) {
        newForm.endTime = value;
      }

      return newForm;
    });
  };

  const handleDiscard = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const startDateTime = new Date(`${form.startDate}T${form.startTime}`);
    const endDateTime = new Date(`${form.endDate}T${form.endTime}`);

    if (startDateTime < new Date()) {
      setFormError("Booking start time cannot be in the past.");
      return;
    }

    if (endDateTime <= startDateTime) {
      setFormError("Booking end time must be after the start time.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await editBooking({
        booking_id: form.booking_id,
        user_id: form.user_id,
        resource_id: form.resource_id,
        startDate: form.startDate,
        startTime: form.startTime,
        endDate: form.endDate,
        endTime: form.endTime,
        purpose: form.purpose,
        prev_booking: form.prev_booking || form.booking_id,
      });

      if (result.error) {
        setFormError(result.error);
        setIsSubmitting(false);
        return;
      }

      alert("Booking changes submitted for re-approval!");
      router.push("/dashboard?tab=bookings");
    } catch (err) {
      console.error("Error submitting edited booking:", err);
      setFormError("Failed to submit changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard?tab=bookings");
  };

  if (status === "loading" || loading) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="h-full bg-gray-50 flex flex-col">
        <div className="bg-white px-4 py-4 shadow-sm">
          <div className="max-w-lg mx-auto flex items-center justify-center relative">
            <button
              onClick={handleBack}
              className="absolute left-0 text-gray-600 hover:text-gray-900 transition"
            >
              <MdArrowBack size={22} />
            </button>
            <h1 className="text-base font-semibold text-gray-900">Edit Booking</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-red-500 font-semibold">{loadingError}</p>
            <button
              onClick={handleBack}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-xl"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="max-w-lg mx-auto flex items-center justify-center relative">
          <button
            onClick={handleBack}
            className="absolute left-0 text-gray-600 hover:text-gray-900 transition"
          >
            <MdArrowBack size={22} />
          </button>
          <h1 className="text-base font-semibold text-gray-900">Edit Booking</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-8">
        <div className="w-full max-w-lg mx-auto px-4 pt-4">
          {/* Info Card */}
          <div className="bg-yellow-50 rounded-2xl p-4 mb-4 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ Editing this booking will create a new request that requires 
              <span className="font-semibold"> re-approval</span> from the Resource Manager.
            </p>
          </div>

          {/* Form Validation Error */}
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative mb-4" role="alert">
              <span className="block sm:inline">{formError}</span>
            </div>
          )}

          <form className="space-y-4 pb-4" onSubmit={handleSubmit}>
            {/* User Info (Read-only) */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-xs font-medium text-gray-500 mb-1">Student ID / Staff ID</label>
              <p className="text-sm font-semibold text-gray-900">{form.user_id}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
              <p className="text-sm font-semibold text-gray-900">{form.fullName}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
              <p className="text-sm font-semibold text-gray-900">{form.phone}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <p className="text-sm font-semibold text-gray-900">{form.email}</p>
            </div>

            {/* Editable Fields */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Starting Booking Time <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  min={minDate}
                  value={form.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-200"
                  required
                />
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ending Booking Time <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  min={form.startDate || minDate}
                  disabled={!form.startDate}
                  value={form.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-200"
                  required
                />
                <input
                  type="time"
                  min={form.startDate === form.endDate ? form.startTime : undefined}
                  disabled={!form.endDate}
                  value={form.endTime}
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-200"
                  required
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Booking Purpose <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.purpose}
                onChange={(e) => handleChange("purpose", e.target.value)}
                placeholder="Enter booking purpose"
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Venue
              </label>
              <input
                type="text"
                value={form.venue}
                onChange={(e) => handleChange("venue", e.target.value)}
                placeholder="Venue name"
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Room
              </label>
              <input
                type="text"
                value={form.room}
                onChange={(e) => handleChange("room", e.target.value)}
                placeholder="Room number"
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Equipment List */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Resource Equipments
              </label>
              <div className="flex flex-wrap gap-2">
                {form.equipments && form.equipments.length > 0 ? (
                  form.equipments.map((equipment, index) => (
                    <span key={index} className="bg-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-700">
                      {equipment.equipment_name} ({equipment.equipment_count})
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No equipments listed</p>
                )}
              </div>
            </div>

            {/* Re-approval Warning */}
            <div className="rounded-2xl bg-blue-50 p-4 border border-blue-200">
              <p className="text-sm text-blue-800">
                📝 Your edited booking will be submitted for <span className="font-semibold">re-approval</span>. 
                The original booking will remain active until the new one is approved.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={handleDiscard}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-xl text-sm transition"
              >
                Discard Changes
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-semibold py-3 rounded-xl text-sm transition ${
                  isSubmitting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit for Re-approval"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}