"use client";
import { useState, useEffect } from "react";
import NavBar, { NavItem } from "../NavBar";
import { LuHouse, LuCalendarPlus } from "react-icons/lu";
import { MdOutlinePerson } from "react-icons/md";
import { useSearchParams, useRouter } from "next/navigation";
import HomeDashboard from "../HomeDashboard";
import PreBooking from "../preBooking";
import VenueBooking from "../VenueBooking";
import BookingSummary from "../BookingSummary";
import Profile from "../UserBoundary/Profile";
import EditProfile from "../UserBoundary/EditProfile";
import SettingsPage from "../settings"; 
import { UserProvider } from "../UserBoundary/UserContext";

interface StudentDashboardProp {
    default_sect: string | null
}

interface BookingData {
    userId: string;
    fullName: string;
    email: string;
    bookingStart: Date;
    bookingEnd: Date;
    bookingPurpose: string;
    resourceId?: string;
    resourceName?: string;
    request_created_date?: Date; 
}

export default function Student({ default_sect }: StudentDashboardProp) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab"); // grabs "reports" from the URL

    const getStartingSection = () => {
        if (tabParam === "reports") return "profile-reports";
        if (tabParam === "bookings") return "profile";
        return default_sect || "home";
    };

    const [activeSection, setActiveSection] = useState(getStartingSection());
    const [previousSection, setPreviousSection] = useState("profile");
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [settingsEntryPoint, setSettingsEntryPoint] = useState<string | null>(null);

    useEffect(() => {
        if (tabParam === "reports") setActiveSection("profile-reports");
        if (tabParam === "bookings") setActiveSection("profile");
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

    const studentNav : NavItem[] = [
        { id: "home", label: "Home", icon: LuHouse },
        { id: "booking", label: "Booking", icon: LuCalendarPlus },
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
            case "booking-summary":
                return <BookingSummary setActiveSection={setActiveSection} bookingData={bookingData} setBookingData={setBookingData} />
            case "profile":
                return <Profile setActiveSection={changeSection} previousSection={previousSection} initialTab="bookings" />;
            case "edit-profile":
                return <EditProfile setActiveSection={setActiveSection} />;
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
            {/* The Dynamic Content Area */}
            <main className="flex-1 flex justify-center overflow-y-auto pb-32">
                {renderContent()}
        </main>
            <div className="h-2"></div> {/* Spacer for the fixed navbar */}
            {/* The Dynamic Navbar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] drop-shadow-2xl">
                <NavBar 
                    items={studentNav} 
                    activeSection={activeSection.startsWith("profile") ? "profile" : activeSection} 
                    onSectionChange={changeSection} 
                />
            </div>
            </div>
        </UserProvider>
    );
};