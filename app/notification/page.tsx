"use client";
import { Notification } from "@/types";
import { useState } from "react";
import { useRouter } from"next/navigation";
import BackButton from "../components/BackButton";
import Button from "../components/Button";

interface NotificationsProps {
    setActiveSection: (section: string) => void;
}

export default function NotificationPage() {
    const router = useRouter();
    const [showNotification, setShowNotification] = useState(false);
    const [mockNotifications, setMockNotifications] = useState([
        { 
            id: 1, 
            title: "Maintenance Updated", 
            message: "Your report for Room 101 has been resolved by the technician. Please verify if the issue is completely fixed.", 
            isRead: false, 
            time: "2 mins ago",
            type: "report"
        },
        { 
            id: 2, 
            title: "Booking Approved", 
            message: "Your booking for Ideabox 1 on 06/06/2026 is confirmed. Please remember to scan the QR code upon entry.", 
            isRead: false, 
            time: "1 hour ago",
            type: "booking"
        },
        { 
            id: 3, 
            title: "System Alert", 
            message: "FCI servers will be down for scheduled maintenance tonight from 12:00 AM to 4:00 AM.", 
            isRead: true, 
            time: "Yesterday",
            type: "system"
        },
    ]);

    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const markAsRead = (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents the accordion from closing when clicking the button
        setMockNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setExpandedId(null); // Auto-close after reading
    };

    return (
        <div className="p-6 h-full w-full max-w-lg mx-auto">
            <header className="flex justify-between items-center mb-6">
                <BackButton buttonName="Return to Dashboard" buttonDesc={mockNotifications.length === 0 ? "No notifications to display" : `You have ${mockNotifications.length} notifications`} />
                <Button className="!w-fit !h-10 !p-4 !absolute right-5 top-4" buttonText="Mark All as Read" onClick={() => {
                    // Implement the logic to mark all notifications as read
                    console.log("Marking all notifications as read");
                }} />
            </header>

            <div className="relative top-5 flex flex-col gap-4 w-full">
                {mockNotifications.length === 0 ? (
                    <div className="bg-background/20 backdrop-blur-md p-8 rounded-3xl shadow-md text-center">
                        <span className="text-4xl mb-4 block">📭</span>
                        <h2 className="text-xl font-bold text-gray-800">All caught up!</h2>
                        <p className="text-sm text-gray-600 mt-2">You have no new notifications.</p>
                    </div>
                ) : (
                    mockNotifications.map((notif) =>(
                        <div
                            key={notif.id}
                            className={`flex flex-col gap-2 p-4 backdrop-blur-md rounded-2xl shadow-sm border transition-all duration-300 ${
                                notif.isRead
                                ? "bg-white/40 border-white/20"
                                : "bg-white/80 borer-blue-200 shadow-md"
                            }`}
                        >
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-3">
                                    {!notif.isRead && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0" />}
                                    <h3 className={`font-bold ${notif.isRead ? "text-gray-600" : "text-gray-900"}`}>
                                        {notif.title}
                                    </h3>
                                </div>
                                <span className="text-xs font-medium text-gray-500 shrink-0">{notif.time}</span>
                            </div>
                            <div className="mt-2 pt-3 border-t border-gray-200/50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                        {notif.message}
                                    </p>
                                    <div className="flex justify-end gap-2">
                                        {!notif.isRead && (
                                            <Button 
                                                className="!h-8 !px-4 !text-xs !bg-blue-600 !text-white" 
                                                buttonText="Mark as Read" 
                                                onClick={(e) => markAsRead(notif.id, e)} 
                                            />
                                        )}
                                        {notif.type === "report" && (
                                            <Button 
                                                className="!h-8 !px-4 !text-xs !bg-gray-200 !text-black" 
                                                buttonText="View Report" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push("/dashboard?tab=reports");
                                                }} 
                                            />
                                        )}
                                    </div>
                                </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}