import Button from "./Button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getDashboardSummary } from "@/app/actions/dashboardActions";
import { Booking } from "@/types";
import { useUser } from "@/app/components/UserBoundary/UserContext";

interface HomeProps {
    setActiveSection: (section: string) => void;
}

export default function HomeDashboard({ setActiveSection }: HomeProps) {
    const router = useRouter();
    const { user, isLoading: isUserLoading } = useUser();
    const [summary, setSummary] = useState({
        openReportsCount: 0,
        closedReportsCount: 0,
        upcomingEvents: [] as Booking[],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSummary() {
            try {
                if (!user?.user_id) return;
                const data = await getDashboardSummary(user.user_id);
                setSummary(data);
            } catch (error) {
                console.error("Error fetching dashboard summary:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSummary();
    }, [user]);

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

    const upcomingEvents = mockEvents.filter((event) => {
        return event.eventDates.some((date) => date >= today);
    });

    const OpenReportNum = 5;
    const ClosedReportNum = 10;
    return (
        <div className="p-6 h-full w-full max-w-lg mx-auto">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-4">
                    {isUserLoading ? 'Loading...' : `Hi, ${user?.name?.split(' ')[0] || 'User'}!`}
                </h1>
                <Button className="!w-10 !h-10 !p-2" buttonText="🔔" onClick={() => {router.push('/notification')}} />
            </header>

            <div className="flex flex-col gap-4 w-full">
                <div className="bg-background/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold mb-2">Calendar ({ShowMonth()})</h2>
                        <Button className="!p-1 !w-8 !h-8" buttonText='→' onClick={() => {router.push('/calendar')}} />
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
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className={`${event.color} rounded-2xl px-5 py-4 shadow-sm transition-transform hover:-translate-y-1 cursor-pointer`}
                                        onClick={() => {router.push(`/bookingdetail/${event.id}`)}}
                                    >
                                        <h3 className="text-sm font-bold text-black leading-tight">{event.title}</h3>
                                        <p className="text-xs text-black/70 mt-1 font-medium leading-tight">{event.timeframe}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center bg-white/50 rounded-2xl border border-dashed border-gray-300">
                                    <span className="text-2xl block mb-2">🎉</span>
                                    <p className="text-sm font-bold text-gray-600">Your schedule is clear!</p>
                                </div>
                            )}
                        </div>
                        {upcomingEvents.length > 3 ? (
                            <div className="text-sm text-gray-500 mt-2">+{upcomingEvents.length - 3} more</div>
                        ) : null
                        }
                    </div>
                </div>

                <div className="bg-background/20 z-50 backdrop-blur-md p-5 rounded-3xl shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold mb-2">Reports</h2>
                        <Button className="!w-25 !h-10 font-bold" buttonText='→' onClick={() => setActiveSection('profile-reports')} />
                    </div>
                    <div className="flex flex-col gap-6 w-full px-2">
                        <div className="flex flex-row items-end gap-4 w-full">
                            <p className="text-5xl font-bold">{summary.openReportsCount}</p>
                            <p className="text-lg font-semibold">Open Reports</p>
                        </div>
                        <div className="flex flex-row items-end gap-4 w-full">
                            <p className="text-5xl font-bold">{summary.closedReportsCount}</p>
                            <p className="text-lg font-semibold">Closed Reports</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}