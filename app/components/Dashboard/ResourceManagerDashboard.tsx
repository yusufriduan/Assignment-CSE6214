"use client";
import { useState, useEffect } from "react";
import NavBar, { NavItem } from "../NavBar";
import { LuCalendarPlus, LuBookPlus } from "react-icons/lu";
import { MdOutlineMonitorHeart, MdOutlineReportGmailerrorred } from "react-icons/md";
import { useRouter } from "next/navigation";
import { BookingListUI } from "../BookingListUI";
import { ResourceUI } from "../ResourceUI";
import { AnalyticsUI } from "../AnalyticsUI";
import { MaintenanceUI } from "../MaintenanceUI";

interface StudentDashboardProp {
    default_sect: string | null
}

export default function Student({ default_sect }: StudentDashboardProp) {
    const router = useRouter();

    const [activeSection, setActiveSection] = useState("manage-booking");

    const handleNavClick = (newSection: string) => {
        setActiveSection(newSection); // 1. Change the UI
    };

    const studentNav : NavItem[] = [
        { id: "manage-booking", label: "Booking", icon: LuCalendarPlus },
        { id: "manage-resources", label: "Resources", icon: LuBookPlus },
        { id: "analytics", label: "Analytics", icon: MdOutlineMonitorHeart },
        { id: "maintenance", label: "Maintenance", icon: MdOutlineReportGmailerrorred },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "manage-booking":
                return <BookingListUI pageType="list" />;
            case "manage-resources":
                return <ResourceUI pageType="list" />;
            case "analytics":
                return <AnalyticsUI />;
            case "maintenance":
                return <MaintenanceUI pageType="list" />;
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
            activeSection={activeSection.startsWith("profile") ? "profile" : activeSection} 
            onSectionChange={handleNavClick} 
        />
      </div>
    </div>
  );
}