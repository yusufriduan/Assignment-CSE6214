"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../components/BackButton";
import { useUser, UserProvider } from "../components/UserBoundary/UserContext";
import { getStudentBookings } from "../actions/BookingController";
import { Booking } from "@/types";

function CalendarView() {
    const router = useRouter();
    const { user, isLoading: isUserLoading } = useUser();
    const [myBookings, setMyBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!isUserLoading && user?.user_id) {
                try {
                    const bookings = await getStudentBookings(user.user_id);
                    setMyBookings(bookings);
                } catch (error) {
                    console.error("Failed to fetch bookings:", error);
                } finally {
                    setIsLoading(false);
                }
            } else if (!isUserLoading && !user) {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [user, isUserLoading]);

    function ShowMonth() {
        const dates = new Date();
        const month = dates.toLocaleString('default', { month: 'long' });
        const year = dates.getFullYear();
        return `${month} ${year}`;
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const todayDate = today.getDate();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInMonth = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    const hasEvent = (day: number) => {
        return myBookings.some((event) => {
            const eventDate = new Date(event.booking_start);
            return eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonth && eventDate.getDate() === day;
        });
    };

    const eventsThisMonth = myBookings.filter(event => {
        const eventDate = new Date(event.booking_start);
        return eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonth;
    }).sort((a, b) => a.booking_start.getTime() - b.booking_start.getTime());

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
                            const isToday = day === todayDate;
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
                            {isLoading ? (
                                <p>Loading events...</p>
                            ) : eventsThisMonth.length > 0 ? (
                                eventsThisMonth.map((booking) => {
                                    const timeframe = `${booking.booking_start.toLocaleDateString([], {day: '2-digit', month: '2-digit', year: 'numeric'})}, ${booking.booking_start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${booking.booking_end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                                    
                                    const statusColor = 
                                        booking.booking_status === "Booked" ? "bg-green-400" :
                                        booking.booking_status === "Awaiting Approval" ? "bg-yellow-400" :
                                        booking.booking_status === "Rejected" ? "bg-red-400" :
                                        booking.booking_status === "Check-in" ? "bg-blue-400" :
                                        "bg-gray-200";

                                    return (
                                        <div
                                            key={booking.booking_id}
                                            className={`${statusColor} rounded-2xl px-5 py-4 shadow-sm shrink-0 cursor-pointer`}
                                            onClick={() => router.push(`/dashboard?tab=bookings`)}
                                        >
                                            <h3 className="text-sm font-bold text-black leading-tight">{booking.resource.resource_name}</h3>
                                            <p className="text-xs text-black/80 mt-0.5 leading-tight">{timeframe}</p>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-gray-500">No events this month.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function CalendarPage() {
    return (
        <UserProvider>
            <CalendarView />
        </UserProvider>
    );
}