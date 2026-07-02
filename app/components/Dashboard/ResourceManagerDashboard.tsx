"use client";
import { useState, useEffect } from "react";
import NavBar, { NavItem } from "../NavBar";
import { LuCalendarPlus, LuBookPlus } from "react-icons/lu";
import { MdOutlineMonitorHeart, MdOutlineReportGmailerrorred } from "react-icons/md";
import { BookingUI } from "../BookingUI";
import { useRouter, useSearchParams } from "next/navigation";
import { ResourceUI } from "../ResourceUI";
import { AnalyticsUI } from "../AnalyticsUI";
import { MaintenanceUI } from "../MaintenanceUI";
import Button from "../Button";
import { useSession } from "next-auth/react";
import SettingsPage from "../settings";
import EditProfile from "../UserBoundary/EditProfile"



export default function ResourceManager() {
    const router = useRouter();
    const {data:session, status} = useSession();


    const searchParams = useSearchParams();
    
    const tabParam = searchParams.get("tab"); 
    
    const [activeSection, setActiveSection] = useState(tabParam || "manage-booking");
    const [previousSection, setPreviousSection] = useState("manage-booking");
    const [settingsEntryPoint, setSettingsEntryPoint] = useState<string | null>(null);

    useEffect(() => {
        if (tabParam) setActiveSection(tabParam);
    }, [tabParam]);

    const handleNavClick = (newSection: string) => {
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

    const resourceManagerNav : NavItem[] = [
        { id: "manage-booking", label: "Booking", icon: LuCalendarPlus },
        { id: "manage-resources", label: "Resources", icon: LuBookPlus },
        { id: "analytics", label: "Analytics", icon: MdOutlineMonitorHeart },
        { id: "reports", label: "Maintenance", icon: MdOutlineReportGmailerrorred },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "manage-booking":
                return (
                    <div className="p-4 h-full max-w-full mx-auto " >
                        <header className="flex justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold mb-4">Hi, {session?.user.name || "user"}!</h1>
                                <p>Manage Pending Bookings</p>
                            </div>
                            
                            <Button className="!w-10 !h-10 !p-2" buttonText="🔔" onClick={() => {router.push('/notification')}} />
                            <Button className="!w-10 !h-10 !p-2 ml-2" buttonText="⚙️" onClick={() => handleNavClick('settings')} />
                        </header>
                        <BookingUI pageType="request_list" />
                    </div>
                );
            case "manage-resources":
                return (
                    <div className="max-w-full flex flex-col p-4 overflow-x-hidden">
                        <header className="flex justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold mb-4">Hi, {session?.user.name || "user"}!</h1>
                                <p>Resource List</p>
                            </div>
                            
                            <Button className="!w-10 !h-10 !p-2" buttonText="🔔" onClick={() => {router.push('/notification')}} />
                            <Button className="!w-10 !h-10 !p-2 ml-2" buttonText="⚙️" onClick={() => handleNavClick('settings')} />
                        </header>
                        <ResourceUI pageType="list" />
                    </div>
                    
                );
            case "analytics":
                return (
                    <div className="w-max-w-full flex flex-col p-4 overflow-x-hidden">
                        <header className="flex justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold mb-4">Hi, {session?.user.name || "user"}!</h1>
                                <p>Analytics (Within this past week)</p>
                            </div>
                            
                            <Button className="!w-10 !h-10 !p-2" buttonText="🔔" onClick={() => {router.push('/notification')}} />
                            <Button className="!w-10 !h-10 !p-2 ml-2" buttonText="⚙️" onClick={() => handleNavClick('settings')} />
                        </header>
                        <AnalyticsUI />
                    </div>
                    
                );
            case "reports":
                return (
                    <div className="p-4 h-full max-w-full mx-auto">
                        <header className="flex justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold mb-4">Hi, {session?.user.name || "user"}!</h1>
                                <p>Maintenance Request List</p>
                            </div>
                            <Button className="!w-10 !h-10 !p-2" buttonText="🔔" onClick={() => {router.push('/notification')}} />
                            <Button className="!w-10 !h-10 !p-2 ml-2" buttonText="⚙️" onClick={() => handleNavClick('settings')} />
                        </header>
                        <MaintenanceUI pageType="list" />;
                    </div>
                )
            case "settings":
                return <SettingsPage handleNavClick={handleNavClick} entryPoint={settingsEntryPoint || 'manage-booking'} />;
            case "edit-profile":
                return <EditProfile setActiveSection={handleNavClick} />;
            default:
                return <div>Section not found</div>;
        }
    };

    if(status === "loading"){
        return(<p>Loading</p>)
    }

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
            items={resourceManagerNav} 
            activeSection={activeSection.startsWith("profile") ? "profile" : activeSection} 
            onSectionChange={handleNavClick} 
        />
      </div>
    </div>
  );
}