"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MdAnalytics } from "react-icons/md";
import { FaCalendarPlus, FaBookOpen } from "react-icons/fa";
import { FiAlertOctagon } from "react-icons/fi";
import NavBar, { NavItem } from "../../components/NavBar";
import BackButton from "../../components/BackButton";
import { fetchAllBooking, approveBooking, rejectBooking } from "../../actions/BookingController";
import { fetchResource } from "../../actions/ResourceController";
import { Booking } from "@/types";

interface ResourceDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetails({ params }: ResourceDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionTaken, setActionTaken] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isResourceManager = session?.user?.role?.toLowerCase() === "resource manager";

  useEffect(() => {
    if (id) {
      fetchBookingDetails(id);
    }
  }, [id]);

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching booking with ID:", bookingId);
      
      // Get all bookings
      const allBookings = await fetchAllBooking();
      console.log("All bookings:", allBookings);
      
      // Find the specific booking
      const foundBooking = allBookings?.find(b => b.booking_id === bookingId);
      console.log("Found booking:", foundBooking);
      
      if (!foundBooking) {
        setError("Booking not found");
        setLoading(false);
        return;
      }

      // Get resource equipments if available
      let equipments: any[] = [];
      const resourceId = foundBooking.resource?.resource_id;
      if (resourceId) {
        try {
          const resourceData = await fetchResource(resourceId);
          if (resourceData) {
            equipments = resourceData.equipments || [];
          }
        } catch (err) {
          console.error("Error fetching resource:", err);
        }
      }

      setBooking({
        ...foundBooking,
        resource_equipments: equipments
      });
    } catch (err) {
      console.error("Error fetching booking:", err);
      setError("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!booking || isProcessing) return;
    setIsProcessing(true);
    try {
      const result = await approveBooking(
        booking.booking_id,
        booking.booking_owner?.email || "",
        booking.booking_owner?.name || "User",
        booking.resource.resource_id || 0,
        booking.resource?.resource_name || "Resource",
        new Date(booking.booking_start),
        new Date(booking.booking_end)
      );
      if (result.success) {
        setActionTaken("approved");
      } else {
        alert("Failed to approve booking");
      }
    } catch (err) {
      console.error("Error approving:", err);
      alert("Error approving booking");
    }
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!booking || isProcessing) return;
    const reason = prompt("Please enter a reason for rejecting this booking:");
    if (reason === null) return;
    
    setIsProcessing(true);
    try {
      const result = await rejectBooking(
        booking.booking_id,
        booking.booking_owner?.email || "",
        reason || "No reason provided",
        booking.booking_owner?.name || "User",
        booking.resource?.resource_name || "Resource"
      );
      if (result.success) {
        setActionTaken("rejected");
      } else {
        alert("Failed to reject booking");
      }
    } catch (err) {
      console.error("Error rejecting:", err);
      alert("Error rejecting booking");
    }
    setIsProcessing(false);
  };

  const handleNavClick = (section: string) => {
    if (section === "booking") {
      router.push("/dashboard?tab=booking");
    } else if (section === "resources") {
      router.push("/dashboard?tab=manage_resource");
    } else if (section === "analytics") {
      router.push("/dashboard?tab=analytics");
    } else if (section === "reports") {
      router.push("/dashboard?tab=reports");
    }
  };

  const managerNavItems: NavItem[] = [
    { id: "booking", label: "Booking", icon: FaCalendarPlus },
    { id: "resources", label: "Resources", icon: FaBookOpen },
    { id: "analytics", label: "Analytics", icon: MdAnalytics },
    { id: "reports", label: "Reports", icon: FiAlertOctagon },
  ];

  // Loading state
  if (status === "loading" || loading) {
    return (
      <div className="h-full w-full max-w-lg mx-auto flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="h-full w-full max-w-lg mx-auto flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-lg text-red-500 font-semibold">{error || "Booking not found"}</p>
            <p className="text-sm text-gray-500 mt-2">Booking ID: {id}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-xl"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success/Approval state
  if (actionTaken) {
    return (
      <div className="h-full w-full max-w-lg mx-auto flex flex-col pb-32 bg-white">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-6xl mb-4">
            {actionTaken === "approved" ? "✅" : "❌"}
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">
            {actionTaken === "approved" ? "Booking Approved!" : "Booking Rejected!"}
          </h2>
          <p className="text-gray-600 text-center">
            {actionTaken === "approved"
              ? `The booking request has been approved.`
              : `The booking request has been rejected.`}
          </p>
          <button
            onClick={() => router.push("/dashboard?tab=booking")}
            className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-xl"
          >
            Back to Bookings
          </button>
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 drop-shadow-2xl">
          <NavBar
            items={managerNavItems}
            activeSection="booking"
            onSectionChange={handleNavClick}
          />
        </div>
      </div>
    );
  }

  // Format helper functions
  const formatDate = (date: any) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatTime = (date: any) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return "Invalid Time";
    }
  };

  // Get user data safely
  const user = booking.booking_owner || {};
  const resource = booking.resource || {};

  return (
    <div className="h-full w-full max-w-lg mx-auto flex flex-col pb-32 bg-white">
      <BackButton 
        buttonName="Back" 
        buttonDesc={`Booking Request for ${user.name || "Unknown"}`} 
      />

      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {/* User Details */}
        <div>
          <p className="text-sm font-bold text-black mb-1">Student ID / Staff ID</p>
          <p className="text-base font-semibold text-gray-800">{user.user_id || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm font-bold text-black mb-1">Full Name</p>
          <p className="text-base font-semibold text-gray-800">{user.name || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm font-bold text-black mb-1">Department</p>
          <p className="text-base font-semibold text-gray-800">{user.department || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm font-bold text-black mb-1">User Email</p>
          <p className="text-base font-semibold text-gray-800">{user.email || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm font-bold text-black mb-1">Contact Number</p>
          <p className="text-base font-semibold text-gray-800">{user.contact_number || "N/A"}</p>
        </div>

        {/* Booking Times */}
        <div>
          <p className="text-sm font-bold text-black mb-1">Starting Booking Time</p>
          <p className="text-base font-semibold text-gray-800">
            {formatDate(booking.booking_start)} {formatTime(booking.booking_start)}
          </p>
        </div>

        <div>
          <p className="text-sm font-bold text-black mb-1">Ending Booking Time</p>
          <p className="text-base font-semibold text-gray-800">
            {formatDate(booking.booking_end)} {formatTime(booking.booking_end)}
          </p>
        </div>

        {/* Booking Purpose */}
        <div>
          <p className="text-sm font-bold text-black mb-1">Booking Purpose</p>
          <p className="text-base font-semibold text-gray-800">{booking.booking_reason || "N/A"}</p>
        </div>

        {/* Venue and Room */}
        <div className="border-t border-gray-300 pt-4">
          <p className="text-sm text-gray-600">{resource.resource_dept || ""}</p>
          <p className="text-base font-bold text-black">{resource.resource_name || "Unknown Resource"}</p>
          <div className="mt-3 space-y-2">
            {booking.resource_equipments && booking.resource_equipments.length > 0 ? (
              booking.resource_equipments.map((equipment: any, index: number) => (
                <div key={index} className="rounded-3xl bg-white border border-gray-300 p-2 text-sm text-gray-700">
                  {equipment.equipment_name} (x{equipment.equipment_count})
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No equipment listed</p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            booking.booking_status === 'Booked' || booking.booking_status === 'Approved' ? 'bg-green-100 text-green-700' :
            booking.booking_status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
            booking.booking_status === 'Rejected' || booking.booking_status === 'Cancelled' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            Status: {booking.booking_status || "Unknown"}
          </span>
        </div>

        {/* Approval Section */}
        {isResourceManager && (booking.booking_status === "Awaiting Approval" || booking.booking_status === "Pending Re-approval") && (
          <div className="rounded-3xl bg-gray-200 p-4 mt-6">
            <p className="text-base font-bold text-black mb-3">
              This request is still pending for approval
            </p>
            <div className="border-b border-gray-400 mb-3"></div>
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className={`flex-1 bg-green-400 hover:bg-green-500 text-black font-bold py-3 rounded-full transition ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className={`flex-1 bg-red-400 hover:bg-red-500 text-black font-bold py-3 rounded-full transition ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing ? 'Processing...' : 'Reject'}
              </button>
            </div>
          </div>
        )}

        {isResourceManager && booking.booking_status !== "Awaiting Approval" && (
          <div className="rounded-3xl bg-gray-100 p-4 mt-6">
            <p className="text-base font-bold text-black mb-2">
              This request has been {booking.booking_status?.toLowerCase() || "processed"}
            </p>
            <button
              onClick={() => router.back()}
              className="w-full bg-blue-500 text-white font-bold py-3 rounded-full transition cursor-pointer"
            >
              Back to Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}