"use client";

import { useState } from "react";
import { MdArrowBack, MdAnalytics } from "react-icons/md";
import { FaCalendarPlus, FaBookOpen } from "react-icons/fa";
import { FiAlertOctagon } from "react-icons/fi";
import { use } from "react";
import NavBar, { NavItem } from "@/app/components/NavBar";
import BackButton from "@/app/components/BackButton";

interface ResourceDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ResourceDetailsPage({ params }: ResourceDetailsPageProps) {
  const { id } = use(params);
  const [actionTaken, setActionTaken] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("booking");

  const managerNavItems: NavItem[] = [
    { id: "booking", label: "Booking", icon: FaCalendarPlus },
    { id: "resources", label: "Resources", icon: FaBookOpen },
    { id: "analytics", label: "Analytics", icon: MdAnalytics },
    { id: "reports", label: "Reports", icon: FiAlertOctagon },
  ];

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
  };

  const bookingData = {
    userName: "MUHAMMAD YUSUF",
    studentId: "251UC240TK",
    fullName: "MUHAMMAD YUSUF BIN RIDUAN",
    phone: "+601546821579",
    email: "MUHAMMAD.YUSUF.RIDUAN1@student.mmu.edu",
    startDate: "29/05/2026",
    startTime: "08:00",
    endDate: "01/06/2026",
    endTime: "18:00",
    purpose: "Annual General Meeting Chess Club",
    venue: "Central Lecture Complex (CLC)",
    room: "CNMX 1004",
    resources: [
      "Air Conditioner",
      "AV System",
      "Projector",
      "Computer",
      "150 Audience Seats",
      "Whiteboard",
    ],
  };

  const handleApprove = () => {
    setActionTaken("approved");
    alert("Booking approved successfully");
  };

  const handleReject = () => {
    setActionTaken("rejected");
    alert("Booking rejected successfully");
  };

  if (actionTaken) {
    return (
      <div className="h-full w-full max-w-lg mx-auto flex flex-col pb-32 bg-white">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-6xl mb-4">
            {actionTaken === "approved" ? "✓" : "✕"}
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">
            {actionTaken === "approved"
              ? "Booking Approved!"
              : "Booking Rejected!"}
          </h2>
          <p className="text-gray-600 text-center">
            {actionTaken === "approved"
              ? "The booking request has been approved."
              : "The booking request has been rejected."}
          </p>
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 drop-shadow-2xl">
          <NavBar
            items={managerNavItems}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full max-w-lg mx-auto flex flex-col pb-32 bg-white">
      {/* Back Button Header */}
      <BackButton buttonName="Back" buttonDesc={`Booking Request for ${bookingData.userName}`} />

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {/* User Details */}
        <div>
          <p className="text-base font-bold text-black mb-1">Student ID / Staff ID</p>
          <p className="text-base font-semibold text-gray-800">{bookingData.studentId}</p>
        </div>

        <div>
          <p className="text-base font-bold text-black mb-1">Full Name</p>
          <p className="text-base font-semibold text-gray-800">{bookingData.fullName}</p>
        </div>

        <div>
          <p className="text-base font-bold text-black mb-1">Number Phone</p>
          <p className="text-base font-semibold text-gray-800">{bookingData.phone}</p>
        </div>

        <div>
          <p className="text-base font-bold text-black mb-1">User Email</p>
          <p className="text-base font-semibold text-gray-800">{bookingData.email}</p>
        </div>

        {/* Booking Times */}
        <div>
          <p className="text-base font-bold text-black mb-1">Starting Booking Time</p>
          <p className="text-base font-semibold text-gray-800">
            {bookingData.startDate} {bookingData.startTime}
          </p>
        </div>

        <div>
          <p className="text-base font-bold text-black mb-1">Ending Booking Time</p>
          <p className="text-base font-semibold text-gray-800">
            {bookingData.endDate} {bookingData.endTime}
          </p>
        </div>

        {/* Booking Purpose */}
        <div>
          <p className="text-base font-bold text-black mb-1">Booking Purpose</p>
          <p className="text-base font-semibold text-gray-800">{bookingData.purpose}</p>
        </div>

        {/* Venue and Room */}
        <div className="border-t border-gray-300 pt-4">
          <p className="text-base text-gray-600">{bookingData.venue}</p>
          <p className="text-base font-bold text-black">{bookingData.room}</p>
          <div className="mt-3 space-y-2">
            {bookingData.resources.map((resource, index) => (
              <div key={index} className="rounded-3xl bg-white border border-gray-300 p-2 text-sm text-gray-700">
                {resource}
              </div>
            ))}
          </div>
        </div>

        {/* Approval Section */}
        <div className="rounded-3xl bg-gray-200 p-4 mt-6">
          <p className="text-base font-bold text-black mb-3">
            This request are still pending for approval
          </p>
          <div className="border-b border-gray-400 mb-3"></div>
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              className="flex-1 bg-green-400 hover:bg-green-500 text-black font-bold py-3 rounded-full transition"
            >
              Approve
            </button>
            <button
              onClick={handleReject}
              className="flex-1 bg-red-400 hover:bg-red-500 text-black font-bold py-3 rounded-full transition"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}