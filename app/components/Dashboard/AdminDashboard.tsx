"use client";

import { useState } from "react";
import NavBar, { NavItem } from "../NavBar";
import ManageUser from "../admin/ManageUser";
import UserDetails from "../admin/UserDetails";
import EditUser from "../admin/EditUser";
import RegisterStaff from "../admin/RegisterStaff";
import Feedbacks from "../admin/Feedbacks";
import { MdOutlinePeople, MdOutlineAssignment } from "react-icons/md";
import { UserProvider } from "../UserBoundary/UserContext";

interface ResourceManagerDashboardProp {
    default_sect: string | null
}

export default function AdminDashboard({ default_sect }: ResourceManagerDashboardProp) {
    const [activeSection, setActiveSection] = useState(default_sect || "manage-users");
    const [selectedUserId, setSelectedUserId] = useState("");

    const adminNav: NavItem[] = [
        { id: "manage-users", label: "Users", icon: MdOutlinePeople },
        { id: "feedbacks", label: "Feedbacks", icon: MdOutlineAssignment },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "manage-users":
                return <ManageUser setActiveSection={setActiveSection} setSelectedUserId={setSelectedUserId} />;
            case "user-details":
                return <UserDetails userId={selectedUserId} setActiveSection={setActiveSection} />;
            case "edit-user":
                return <EditUser userId={selectedUserId} setActiveSection={setActiveSection} />;
            case "register-staff":
                return <RegisterStaff setActiveSection={setActiveSection} />;
            case "feedbacks":
                return <Feedbacks />;
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
