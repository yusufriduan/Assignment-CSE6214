"use client";
import { useState } from "react";
import NavBar, { NavItem } from "../NavBar";
import { MdHome, MdPerson } from "react-icons/md";
import { FaCalendarPlus } from "react-icons/fa";
import HomeDashboard from "../HomeDashboard";
import PreBooking from "../preBooking";
import Profile from "../Profile";
import EditProfile from "../EditProfile";

interface StudentDashboardProp {
    default_sect: string | null
}

export default function Student({ default_sect }: StudentDashboardProp) {
    const [activeSection, setActiveSection] = useState(default_sect || "home");

    const studentNav : NavItem[] = [
        { id: "home", label: "Home", icon: MdHome },
        { id: "booking", label: "Booking", icon: FaCalendarPlus },
        { id: "profile", label: "Profile", icon: MdPerson },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "home":
                return <HomeDashboard />;
            case "booking":
                return <PreBooking />;
            case "profile":
                return <Profile setActiveSection={setActiveSection} />;
            case "edit-profile":
                return <EditProfile setActiveSection={setActiveSection} />;
            default:
                return <div>Section not found</div>;
        }
    };

    return (
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
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
        />
      </div>
    </div>
  );
}