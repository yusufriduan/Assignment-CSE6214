"use client";
import { useState, useEffect } from "react";
import NavBar, { NavItem } from "../NavBar";
import { LuHouse, LuCalendarPlus } from "react-icons/lu";
import { MdOutlinePerson } from "react-icons/md";
import { useSearchParams, useRouter } from "next/navigation";
import HomeDashboard from "../HomeDashboard";
import PreBooking from "../preBooking";
import VenueBooking from "../VenueBooking";
import Profile from "../UserBoundary/Profile";
import EditProfile from "../UserBoundary/EditProfile";
import { UserProvider } from "../UserBoundary/UserContext";

interface StudentDashboardProp {
    default_sect: string | null
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

    useEffect(() => {
        if (tabParam === "reports") setActiveSection("profile-reports");
        if (tabParam === "bookings") setActiveSection("profile");
    }, [tabParam]);

    const handleNavClick = (newSection: string) => {
        setActiveSection(newSection); // 1. Change the UI
        
        // 2. If the URL is poisoned with '?tab=reports', wipe it back to the clean dashboard!
        if (searchParams.get("tab")) {
            // NOTE: Change "/dashboard" if your main page is named something else
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
                return <HomeDashboard setActiveSection={setActiveSection} />;
            case "booking":
                return <PreBooking setActiveSection={setActiveSection} />;
            case "venue-booking":
                return <VenueBooking setActiveSection={setActiveSection} />;
            case "profile":
                return <Profile setActiveSection={setActiveSection} initialTab="bookings" />;
            case "edit-profile":
                return <EditProfile setActiveSection={setActiveSection} />;
            case "profile-reports":
                return <Profile setActiveSection={setActiveSection} initialTab="reports" />
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
                    onSectionChange={handleNavClick} 
                />
            </div>
            </div>
        </UserProvider>
    );
};