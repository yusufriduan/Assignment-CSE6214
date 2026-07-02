"use client";

import { useState, useEffect } from "react";
import NavBar, { NavItem } from "../NavBar";
import { LuHouse, LuCalendarPlus, LuUsers } from "react-icons/lu";
import { MdOutlinePerson } from "react-icons/md";
import { useSearchParams, useRouter } from "next/navigation";
import HomeDashboard from "../HomeDashboard";
import PreBooking from "../preBooking";
import VenueBooking from "../VenueBooking";
import Profile from "../UserBoundary/Profile";
import EditProfile from "../UserBoundary/EditProfile";
import SettingsPage from "../settings";
import { UserProvider } from "../UserBoundary/UserContext";
import BookingSummary from "../BookingSummary";
// Don't import the page - we'll use router to navigate

interface StaffDashboardProp {
    default_sect: string | null
}

interface BookingData {
    userId: string;
    fullName: string;
    email: string;
    bookingStart: Date;
    bookingEnd: Date;
    bookingPurpose: string;
}

export default function Staff({ default_sect }: StaffDashboardProp) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab");

    const getStartingSection = () => {
        if (tabParam === "reports") return "profile-reports";
        if (tabParam === "bookings") return "profile";
        if (tabParam === "history") return "history";
        return default_sect || "home";
    };

    const [activeSection, setActiveSection] = useState(getStartingSection());
    const [previousSection, setPreviousSection] = useState("home");
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [settingsEntryPoint, setSettingsEntryPoint] = useState<string | null>(null);

    useEffect(() => {
        if (tabParam === "reports") setActiveSection("profile-reports");
        if (tabParam === "bookings") setActiveSection("profile");
        if (tabParam === "history") {
            // Navigate to the student-faculty-history page
            router.push("/student-faculty-history");
            return;
        }
    }, [tabParam]);

    const changeSection = (newSection: string) => {
        const isEnteringSettings = newSection === 'settings';
        const isLeavingSettingsSubPage = activeSection === 'edit-profile';

        if (isEnteringSettings && !isLeavingSettingsSubPage) {
            setSettingsEntryPoint(activeSection);
        }
        setPreviousSection(activeSection);
        setActiveSection(newSection);
        if (searchParams.get("tab")) {
            router.replace("/dashboard", { scroll: false }); 
        }
    };

    const staffNav: NavItem[] = [
        { id: "home", label: "Home", icon: LuHouse },
        { id: "booking", label: "Booking", icon: LuCalendarPlus },
        { id: "history", label: "History", icon: LuUsers },
        { id: "profile", label: "Profile", icon: MdOutlinePerson },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "home":
                return <HomeDashboard setActiveSection={setActiveSection} previousSection={previousSection} />;
            case "booking":
                return <PreBooking setActiveSection={setActiveSection} setBookingData={setBookingData} />;
            case "venue-booking":
                return <VenueBooking setActiveSection={setActiveSection} bookingData={bookingData} setBookingData={setBookingData} />;
            case "history":
                router.push("/student-faculty-history");
                return null;
            case "profile":
                return <Profile setActiveSection={changeSection} previousSection={previousSection} initialTab="bookings" />;
            case "edit-profile":
                return <EditProfile setActiveSection={setActiveSection} />;
            case "booking-summary":
                return <BookingSummary setActiveSection={setActiveSection} bookingData={bookingData} setBookingData={setBookingData} />
            case "profile-reports":
                return <Profile setActiveSection={changeSection} previousSection={previousSection} initialTab="reports" />
            case "settings":
                return <SettingsPage handleNavClick={changeSection} entryPoint={settingsEntryPoint || 'profile'} />;
            default:
                return <div>Section not found</div>;
        }
    };

    return (
        <UserProvider>
            <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
                <main className="flex-1 flex justify-center overflow-y-auto pb-32">
                    {renderContent()}
                </main>
                <div className="h-2"></div>
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] drop-shadow-2xl">
                    <NavBar 
                        items={staffNav} 
                        activeSection={activeSection.startsWith("profile") ? "profile" : activeSection} 
                        onSectionChange={changeSection} 
                    />
                </div>
            </div>
        </UserProvider>
    );
}