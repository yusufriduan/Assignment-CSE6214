"use client";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import BackButton from "../components/BackButton";

export default function CalendarPage(){
    const router = useRouter();
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
            timeframe: '24/06/2026, 11:00 - 13:00',
            color: 'bg-[#ff7b72]', // Red
            eventDates: [24],
        },
        {
            id: 4,
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

    return(
        <div className="p-6 h-full w-full max-w-lg mx-auto flex flex-col">
            <header className="w-full mb-8">
                <BackButton buttonName="Calendar" buttonDesc={ShowMonth()} />
            </header>
            <main className="flex-1 flex flex-col md:flex-row gap-8 w-full h-full mt-4">
                <div className="flex flex-col gap-4 w-full h-full justify-between">
                    <div className="grid grid-cols-7 gap-1 w-full">
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
                    <div className="flex flex-col gap-3 w-full bg-background/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                        <h2 className="text-xl font-bold mb-2">Events</h2>
                        <div className="flex flex-col gap-3 max-h-[35vh] overflow-y-auto pr-2">
                            {mockEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className={`${event.color} rounded-4xl px-6 py-4 shadow-sm shrink-0`}
                                >
                                    <h3 className="text-sm font-bold text-black leading-tight">{event.title}</h3>
                                    <p className="text-xs text-black/80 mt-0.5 leading-tight">{event.timeframe}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}