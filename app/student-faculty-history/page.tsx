"use client";

import { useEffect, useState } from "react";
import { MdHome, MdCalendarMonth, MdPerson } from "react-icons/md";
import { fetchUsersBookingHistory } from "@/app/actions/userActions";

type BookingHistory = {
  booking_id: string;
  resource: {
    resource_name: string;
    resource_dept: string;
    resource_equipments: string[];
  };
  booking_start: string | Date;
  booking_end: string | Date;
  booking_status: string;
  booking_reason: string;
};

type UserHistory = {
  user_id: string;
  name: string;
  faculty: string;
  matric: string;
  role: string;
  bookings: BookingHistory[];
};

const parseDate = (value: string | Date) => {
  return typeof value === "string" ? new Date(value) : value;
};

export default function StudentFacultyHistoryPage() {
  const [students, setStudents] = useState<UserHistory[]>([]);
  const [selected, setSelected] = useState<UserHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await fetchUsersBookingHistory();
        setStudents(history);
      } catch (err) {
        console.error(err);
        setError("Unable to load booking history.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  return (
    <div className="h-full w-full max-w-lg mx-auto flex flex-col pb-32 bg-white">
      <div className="p-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-black">Students & Faculties</h1>
        <p className="mt-2 text-sm text-gray-600">View student and faculty booking history from the database.</p>
      </div>

      <div className="p-6 space-y-4 flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-600">Loading booking history...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : students.length === 0 ? (
          <div className="text-center text-gray-600">No booking history available.</div>
        ) : (
          students.map((student) => (
            <button
              key={student.user_id}
              onClick={() => setSelected(student)}
              className="w-full text-left bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col gap-1 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-base font-semibold text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.faculty}</p>
                </div>
                <div className="text-sm font-semibold text-gray-700">{student.matric}</div>
              </div>
            </button>
          ))
        )}

        {selected && (
          <div className="rounded-3xl bg-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-base font-semibold text-black">{selected.name}</p>
                <p className="text-sm text-gray-600">{selected.faculty} • {selected.matric}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-sm text-blue-600 font-medium"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-black">Booking History</h3>
              {selected.bookings.length === 0 ? (
                <p className="text-sm text-gray-600">No bookings found.</p>
              ) : (
                selected.bookings.map((booking) => {
                  const start = parseDate(booking.booking_start);
                  const end = parseDate(booking.booking_end);
                  const displayDate = `${start.toLocaleDateString()} • ${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
                  return (
                    <div key={booking.booking_id} className="bg-white rounded-xl border border-gray-200 p-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-semibold">{booking.resource.resource_name}</p>
                          <p className="text-xs text-gray-600">{booking.resource.resource_dept}</p>
                          <p className="text-xs text-gray-600">{displayDate}</p>
                        </div>
                        <div className={`text-sm font-semibold ${booking.booking_status === "Booked" ? "text-green-600" : booking.booking_status === "Cancelled" ? "text-red-500" : "text-gray-700"}`}>
                          {booking.booking_status}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
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
