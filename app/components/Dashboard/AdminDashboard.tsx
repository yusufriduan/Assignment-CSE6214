"use client";

import { useState } from "react";
import NavBar, { NavItem } from "../NavBar";
import ManageUser from "../admin/ManageUser";
import UserDetails from "../admin/UserDetails";
import EditUser from "../admin/EditUser";
import RegisterStaff from "../admin/RegisterStaff";
import Feedbacks from "../admin/Feedbacks";
import SettingsPage from "../settings";
import EditProfile from "../UserBoundary/EditProfile";
import { MdOutlinePeople, MdOutlineAssignment } from "react-icons/md";
import { UserProvider } from "../UserBoundary/UserContext";
import { useSearchParams, useRouter } from "next/navigation";

interface ResourceManagerDashboardProp {
    default_sect: string | null
}

export default function AdminDashboard({ default_sect }: ResourceManagerDashboardProp) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab");
    const [activeSection, setActiveSection] = useState(default_sect || "manage-users");
    const [previousSection, setPreviousSection] = useState("manage-users");
    const [selectedUserId, setSelectedUserId] = useState("");
    const [settingsEntryPoint, setSettingsEntryPoint] = useState<string | null>(null);

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

    const adminNav: NavItem[] = [
        { id: "manage-users", label: "Users", icon: MdOutlinePeople },
        { id: "feedbacks", label: "Feedbacks", icon: MdOutlineAssignment },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "manage-users":
                return <ManageUser setActiveSection={handleNavClick} setSelectedUserId={setSelectedUserId} />;
            case "user-details":
                return <UserDetails userId={selectedUserId} setActiveSection={handleNavClick} />;
            case "edit-user":
                return <EditUser userId={selectedUserId} setActiveSection={handleNavClick} />;
            case "register-staff":
                return <RegisterStaff setActiveSection={handleNavClick} />;
            case "feedbacks":
                return <Feedbacks setActiveSection={handleNavClick} />;
            case "settings":
                return <SettingsPage handleNavClick={handleNavClick} entryPoint={settingsEntryPoint || 'manage-users'} />;
            case "edit-profile":
                return <EditProfile setActiveSection={handleNavClick} />;
            default:
                return <div>Section not found</div>;
        }
    };

    const showNavBar = activeSection === "manage-users" || activeSection === "feedbacks";

    return (
        <UserProvider>
            <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
                <main className="flex-1 flex justify-center overflow-y-auto pb-32">
                    {renderContent()}
                </main>
                <div className="h-2"></div>
                {showNavBar && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] drop-shadow-2xl">
                        <NavBar items={adminNav} activeSection={activeSection} onSectionChange={setActiveSection} />
                    </div>
                )}
            </div>
        </UserProvider>
    );
}
