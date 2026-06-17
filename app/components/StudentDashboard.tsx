"use client";
import { useState } from "react";
import Button from "./Button";
import NavBar, { NavItem } from "./NavBar";
import { MdHome, MdPerson } from "react-icons/md";
import { FaCalendarPlus } from "react-icons/fa";
import Input from "./input";

export default function StudentDashboard() {
    const [activeSection, setActiveSection] = useState("home");
    
    const studentNav : NavItem[] = [
        { id: "home", label: "Home", icon: MdHome },
        { id: "booking", label: "Booking", icon: FaCalendarPlus },
        { id: "profile", label: "Profile", icon: MdPerson },
    ];

    const mockEvents = [
    {
        id: 1,
        title: 'Ideabox 1',
        timeframe: '06/06/2026, 13:00 - 15:00',
        color: 'bg-[#a3f870]', // Light green
        eventDates: [6], 
    },
    {
        id: 2,
        title: 'CQAR 3025 - FAIE',
        timeframe: '17/06/2026 - 19/06/2026',
        color: 'bg-[#f6d765]', // Yellow
        eventDates: [17, 18, 19],
    },
    {
        id: 3,
        title: 'CQAR 2007 - FCI',
        timeframe: '30/06/2026, 11:00 - 13:00',
        color: 'bg-[#ff7b72]', // Red
        eventDates: [30],
    },
];

    function ShowMonth() {
        const dates = new Date();
        const month = dates.toLocaleString('default', { month: 'long' });
        const year = dates.getFullYear();
        return `${month} ${year}`;
    }

    const today = new Date().getDate();
    const daysInCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const daysInMonth = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    const hasEvent = (day: number) => {
        return mockEvents.some((event) => event.eventDates.includes(day));
    };

    const OpenReportNum = 5;
    const ClosedReportNum = 10;

    const renderContent = () => {
        switch (activeSection) {
            case "home":
                return <div className="p-4 md:p-10 h-full w-full max-w-lg mx-auto">
                    <header className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold mb-4">Hi, John!</h1>
                        <Button className="!w-10 !h-10 !p-2" buttonText="🔔" />
                    </header>

                    <div className="flex flex-col gap-4 w-full">
                        <div className="bg-background/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold mb-2">Calendar ({ShowMonth()})</h2>
                                <Button className="!p-1 !w-8 !h-8" buttonText='→' />
                            </div>
                            <div className="flex flex-row gap-4 w-full justify-between items-start">
                                <div className="grid w-1/2 grid-cols-7 gap-1">
                                    {daysOfWeek.map((day, idx) => (
                                    <div key={`header-${idx}`} className="flex justify-center font-bold text-sm mb-1">
                                        {day}
                                    </div>
                                    ))}
                                    {daysInMonth.map((day) => {
                                        const isToday = day === today;
                                        return (
                                            <div 
                                                key={`day-${day}`} 
                                                className={`flex flex-col items-center justify-start w-6 h-8 rounded-full mx-auto ${
                                                    isToday ? 'bg-black text-white font-bold' : ''
                                                }`}
                                        >
                                            <span>{day}</span>
                                            {hasEvent(day) && (
                                            <div className="w-1 h-1 bg-[#a3a3a3] rounded-full mt-0" />
                                            )}
                                        </div>
                                        );
                                    })}
                                </div>
                                <div className="flex flex-col gap-2 w-1/2 pl-2">
                                {mockEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className={`${event.color} rounded-4xl px-6 py-4 shadow-sm`}
                                >
                                    <h3 className="text-sm font-bold text-black leading-tight">{event.title}</h3>
                                    <p className="text-xs text-black/80 mt-0.5 leading-tight">{event.timeframe}</p>
                                </div>
                                ))}
                                
                                {/* Extra Events Counter */}
                                <div className="text-center mt-1 cursor-pointer hover:opacity-80">
                                <span className="text-sm font-bold">+ 7 events</span>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className="bg-background/20 z-50 backdrop-blur-md p-5 rounded-3xl shadow-md">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold mb-2">Reports</h2>
                                <Button className="!w-25 !h-10" buttonText='→' />
                            </div>
                            <div className="flex flex-col gap-6 w-full px-2">
                                <div className="flex flex-row items-end gap-4 w-full">
                                    <p className="text-5xl font-bold">{OpenReportNum}</p>
                                    <p className="text-lg font-semibold">Open Reports</p>
                                </div>
                                <div className="flex flex-row items-end gap-4 w-full">
                                    <p className="text-5xl font-bold">{ClosedReportNum}</p>
                                    <p className="text-lg font-semibold">Closed Reports</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>;
            case "booking":
                return <div className="p-4 text-2xl gap-2 w-full h-full max-w-lg mx-auto flex flex-col">
                    <header className="flex flex-col items-start gap-1">
                            <h1 className="text-2xl font-bold">Ready to Book!</h1>
                            <p className="text-sm text-gray-600">Verify your details first.</p>
                    </header>
                    <form className="mt-6 flex flex-col gap-8">
                        <Input key="student-id" label="Student ID" type="text" placeholder="Student ID" required />
                        <Input key="full-name" label="Full Name" type="text" placeholder="Full Name" disabled />
                        <Input key="student-email" label="Student Email" type="text" placeholder="Student Email" disabled />
                        <Input key="start-booking-date" label="Booking Date" type="datetime-local" placeholder="Booking Date" required />
                        <Input key="end-booking-date" label="End Booking Date" type="datetime-local" placeholder="End Booking Date" required />
                        <Input key="booking-purpose" label="Booking Purpose" type="text" placeholder="Booking Purpose" required />
                        <Button type="submit" className="!gap-3 !bg-blue-500 !text-white py-3 rounded-md !hover:bg-blue-600 !transition-colors" buttonText="+   Add Room" />
                    </form>
                </div>;
            case "profile":
                return <div className="p-10 text-2xl font-bold">Manage your Profile here.</div>;
            default:
                return <div>Section not found</div>;
        }
    };

    return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* The Dynamic Content Area */}
      <main className="flex-1 flex justify-center">
        {renderContent()}
      </main>
      
      {/* The Dynamic Navbar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] drop-shadow-2xl">
        <NavBar 
            items={studentNav} 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
        />
      </div>
    </div>
  );
}