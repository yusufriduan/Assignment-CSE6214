import Button from "../Button";
import BookingCard from "../BookingCard";
import ReportCard from "../ReportCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Booking, MaintenanceRequest, User } from "@/types";
import { getStudentBookings } from "@/app/actions/BookingController";
import { getUserRequest } from "@/app/actions/MaintenanceController";
import { useUser } from "@/app/components/UserBoundary/UserContext";

interface ProfileProps {
    setActiveSection: (section: string) => void;
    initialTab?: "bookings" | "reports"
}

export default function Profile({ setActiveSection, initialTab = "bookings" }: ProfileProps) {
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState<"bookings" | "reports">(initialTab);
    const [myBooking, setMyBooking] = useState<Booking[]>([]);
    const [myReports, setMyReports] = useState<MaintenanceRequest[]>([]);
    const [upcomingIndex, setUpcomingIndex] = useState(0);
    const [pastIndex, setPastIndex] = useState(0);
    const { user: userProfile, isLoading: isUserLoading } = useUser();

    useEffect(() => {
        setCurrentTab(initialTab);
    }, [initialTab])

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (!userProfile?.user_id) {
                    return;
                }

                const [bookings, reports] = await Promise.all([
                    getStudentBookings(userProfile.user_id),
                    getUserRequest(userProfile.user_id),
                ]);

                if (bookings) setMyBooking(bookings);
                if (reports) setMyReports(reports);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, [userProfile]);

    const now = new Date();

    const upcomingEvents = myBooking.filter((event) => event.booking_start >= now);
    const pastEvents = myBooking.filter((event) => event.booking_start < now);

    return(
        <div className="p-6 h-full w-full max-w-lg mx-auto">
            <header className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h1 className="text-2xl font-bold truncate">
                        {isUserLoading ? 'Loading...' : userProfile?.name}
                    </h1>
                    <p className="text-sm truncate">{userProfile?.email}</p>
                </div>
                <div className="flex flex-row gap-3">
                    <Button className="!h-10" buttonText="Edit Profile" onClick={() => setActiveSection("edit-profile")} />
                    <Button className="!w-10 !h-10" buttonText="🚪" onClick={() => router.push('/login')} />
                </div>
            </header>
            <div className="flex flex-col gap-4 w-full">
                <div className="bg-background/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                    <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                    <div className="flex flex-col gap-1 w-full break-words">
                        <h1>Full name: {userProfile?.name}</h1>
                        <h1>Student ID: {userProfile?.user_id}</h1>
                        <h1>Email: {userProfile?.email}</h1>
                        <h1>Phone Number: {userProfile?.contact_number}</h1>
                    </div>
                </div>
                <div className="w-full h-1 bg-gray-300 rounded-full" />
                <div className="flex bg-white/40 p-1 rounded-xl backdrop-blur-md shadow-sm">
                    <button
                        onClick={() => setCurrentTab("bookings")}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:cursor-pointer ${
                            currentTab === "bookings" 
                            ? "bg-white shadow-md text-blue-600" 
                            : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                        }`}
                    >
                        My Bookings
                    </button>
                    <button
                        onClick={() => setCurrentTab("reports")}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:cursor-pointer ${
                            currentTab === "reports" 
                            ? "bg-white shadow-md text-blue-600" 
                            : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                        }`}
                    >
                        My Reports
                    </button>
                </div>

                {currentTab === "bookings" ? (
                <>
                    <div className="bg-background/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                        <h2 className="text-xl font-bold mb-4">Upcoming Bookings</h2>
                        <div className="flex flex-col gap-1 w-full">
                            {upcomingEvents.length === 0 ? (
                                <p className="text-gray-600">You have no upcoming bookings.</p>
                            ) : (
                                <div className="relative">
                                    <BookingCard
                                        key={upcomingEvents[upcomingIndex].booking_id}
                                        booking={upcomingEvents[upcomingIndex]}
                                        roomImage={upcomingEvents[upcomingIndex].resource.resource_img_url || "/path/to/room-image.jpg"}
                                    />
                                    {upcomingEvents.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setUpcomingIndex(prev => (prev - 1 + upcomingEvents.length) % upcomingEvents.length)}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors focus:outline-none"
                                            >
                                                &lt;
                                            </button>
                                            <button
                                                onClick={() => setUpcomingIndex(prev => (prev + 1) % upcomingEvents.length)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors focus:outline-none"
                                            >
                                                &gt;
                                            </button>
                                            <div className="text-center mt-2 text-sm text-gray-500 font-semibold">
                                                {upcomingIndex + 1} / {upcomingEvents.length}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-background/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                        <h2 className="text-xl font-bold mb-4">Past Bookings</h2>
                        <div className="flex flex-col gap-1 w-full">
                            {pastEvents.length === 0 ? (
                                <p className="text-gray-600">You have no past bookings.</p>
                            ) : (
                                <div className="relative">
                                    <BookingCard
                                        key={pastEvents[pastIndex].booking_id}
                                        booking={pastEvents[pastIndex]}
                                        roomImage={pastEvents[pastIndex].resource.resource_img_url || "/path/to/room-image.jpg"}
                                    />
                                    {pastEvents.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setPastIndex(prev => (prev - 1 + pastEvents.length) % pastEvents.length)}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors focus:outline-none"
                                            >
                                                &lt;
                                            </button>
                                            <button
                                                onClick={() => setPastIndex(prev => (prev + 1) % pastEvents.length)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors focus:outline-none"
                                            >
                                                &gt;
                                            </button>
                                            <div className="text-center mt-2 text-sm text-gray-500 font-semibold">
                                                {pastIndex + 1} / {pastEvents.length}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </>
                ) : (
                    <>
                        {myReports.length === 0 ? (
                            <>
                                <h2 className="text-xl font-bold mb-4">My Reports</h2>
                                <p className="text-gray-600">You have no reports yet.</p>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-3 w-full">
                                    {myReports.map((report) => (
                                        <ReportCard key={report.fault_id} request={report} hidden={false} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}