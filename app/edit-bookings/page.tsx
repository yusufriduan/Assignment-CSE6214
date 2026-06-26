"use client";

import { useState } from "react";
import { MdHome, MdCalendarMonth, MdPerson } from "react-icons/md";

export default function EditBookingsPage() {
  const [form, setForm] = useState({
    userId: "251UC240TK",
    fullName: "MUHAMMAD YUSUF BIN RIDUAN",
    phone: "+601546821579",
    email: "MUHAMMAD.YUSUF.RIDUAN1@student.mmu.edu",
    startDate: "2026-05-29",
    startTime: "08:00",
    endDate: "2026-06-01",
    endTime: "18:00",
    purpose: "Annual General Meeting Chess Club",
    venue: "Central Lecture Complex (CLC)",
    room: "CNMX 1004",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDiscard = () => {
    setForm({
      userId: "251UC240TK",
      fullName: "MUHAMMAD YUSUF BIN RIDUAN",
      phone: "+601546821579",
      email: "MUHAMMAD.YUSUF.RIDUAN1@student.mmu.edu",
      startDate: "2026-05-29",
      startTime: "08:00",
      endDate: "2026-06-01",
      endTime: "18:00",
      purpose: "Annual General Meeting Chess Club",
      venue: "Central Lecture Complex (CLC)",
      room: "CNMX 1004",
    });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log("Booking form submitted", form);
    alert("Booking changes saved.");
  };

  return (
    <div className="h-full w-full max-w-lg mx-auto flex flex-col pb-32 bg-white">
      <div className="p-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-black">Edit Booking</h1>
        <p className="mt-2 text-sm text-gray-600">Update your booking details before saving.</p>
      </div>

      <form className="p-6 space-y-5 flex-1" onSubmit={handleSubmit}>
        <div>
          <label className="block text-base font-bold text-black mb-2">Student ID / Staff ID</label>
          <p className="text-base font-semibold text-gray-800">{form.userId}</p>
        </div>

        <div>
          <label className="block text-base font-bold text-black mb-2">Full Name</label>
          <p className="text-base font-semibold text-gray-800">{form.fullName}</p>
        </div>

        <div>
          <label className="block text-base font-bold text-black mb-2">Number Phone</label>
          <p className="text-base font-semibold text-gray-800">{form.phone}</p>
        </div>

        <div>
          <label className="block text-base font-bold text-black mb-2">User Email</label>
          <p className="text-base font-semibold text-gray-800">{form.email}</p>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="block text-base font-bold text-black mb-2">Starting Booking Time</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full bg-gray-300 rounded-full px-4 py-3 text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                className="w-full bg-gray-300 rounded-full px-4 py-3 text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-bold text-black mb-2">Ending Booking Time</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full bg-gray-300 rounded-full px-4 py-3 text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                className="w-full bg-gray-300 rounded-full px-4 py-3 text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-base font-bold text-black mb-2">Booking Purpose</label>
          <input
            type="text"
            value={form.purpose}
            onChange={(e) => handleChange("purpose", e.target.value)}
            placeholder="Annual General Meeting Chess Club"
            className="w-full bg-gray-300 rounded-full px-4 py-3 text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-base font-bold text-black mb-2">Venue</label>
          <input
            type="text"
            value={form.venue}
            onChange={(e) => handleChange("venue", e.target.value)}
            placeholder="Central Lecture Complex (CLC)"
            className="w-full bg-gray-300 rounded-full px-4 py-3 text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-base font-bold text-black mb-2">Room</label>
          <input
            type="text"
            value={form.room}
            onChange={(e) => handleChange("room", e.target.value)}
            placeholder="CNMX 1004"
            className="w-full bg-gray-300 rounded-full px-4 py-3 text-base text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="rounded-3xl bg-gray-200 p-4">
          <p className="text-base font-semibold text-black mb-2">Resource Details</p>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="rounded-3xl bg-white p-3">Air Conditioner</div>
            <div className="rounded-3xl bg-white p-3">AV System</div>
            <div className="rounded-3xl bg-white p-3">Projector</div>
            <div className="rounded-3xl bg-white p-3">Computer</div>
            <div className="rounded-3xl bg-white p-3">150 Audience Seats</div>
            <div className="rounded-3xl bg-white p-3">Whiteboard</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleDiscard}
            className="w-full bg-gray-300 hover:bg-gray-350 text-black font-semibold py-3 rounded-full transition"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition"
          >
            Save Changes
          </button>
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
