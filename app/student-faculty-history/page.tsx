"use client";

import { useState } from "react";
import { MdHome, MdCalendarMonth, MdPerson } from "react-icons/md";

interface Booking {
  id: string;
  resource: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface Student {
  id: string;
  name: string;
  faculty: string;
  matric: string;
  bookings: Booking[];
}

const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Aisha Binti Khalid",
    faculty: "Faculty of Computing Informatics",
    matric: "251UC240AA",
    bookings: [
      { id: "b1", resource: "CLC - CNMX1004", date: "2026-05-29", startTime: "08:00", endTime: "10:00", status: "Completed" },
      { id: "b2", resource: "Library Room 2", date: "2026-06-05", startTime: "14:00", endTime: "16:00", status: "Cancelled" },
    ],
  },
  {
    id: "s2",
    name: "Muhammad Yusuf Bin Riduan",
    faculty: "Faculty of Computing Informatics",
    matric: "251UC240TK",
    bookings: [
      { id: "b3", resource: "CLC - CNMX1004", date: "2026-05-29", startTime: "08:00", endTime: "18:00", status: "Completed" },
      { id: "b4", resource: "Lab A", date: "2026-03-10", startTime: "09:00", endTime: "12:00", status: "Completed" },
    ],
  },
  {
    id: "s3",
    name: "Siti Nur",
    faculty: "Faculty of Computing Informatics",
    matric: "251UC240BB",
    bookings: [
      { id: "b5", resource: "Seminar Hall", date: "2026-04-20", startTime: "10:00", endTime: "12:00", status: "Completed" },
    ],
  },
];

export default function StudentFacultyHistoryPage() {
  const [students] = useState<Student[]>(mockStudents);
  const [selected, setSelected] = useState<Student | null>(null);

  return (
    <div className="h-full w-full max-w-lg mx-auto flex flex-col pb-32 bg-white">
      <div className="p-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-black">Students & Faculties</h1>
        <p className="mt-2 text-sm text-gray-600">View students and their booking history.</p>
      </div>

      <div className="p-6 space-y-4 flex-1 overflow-y-auto">
        {students.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s)}
            className="w-full text-left bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col gap-1 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-base font-semibold text-gray-900">{s.name}</p>
                <p className="text-sm text-gray-600">{s.faculty}</p>
              </div>
              <div className="text-sm font-semibold text-gray-700">{s.matric}</div>
            </div>
          </button>
        ))}

        {selected ? (
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
                selected.bookings.map((b) => (
                  <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-semibold">{b.resource}</p>
                        <p className="text-xs text-gray-600">{b.date} • {b.startTime} - {b.endTime}</p>
                      </div>
                      <div className={`text-sm font-semibold ${b.status === 'Completed' ? 'text-green-600' : b.status === 'Cancelled' ? 'text-red-500' : 'text-gray-700'}`}>
                        {b.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}

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
