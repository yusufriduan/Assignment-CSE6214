"use client";

import { useState } from "react";
import { use } from "react";
import { createBooking } from "@/app/actions/BookingController";
import { useSession } from "next-auth/react";
import Button from "../components/Button";

interface SummaryProps {
    bookingData: any;
    setBookingData: (data: any) => void; // Add this!
    setActiveSection: (section: string) => void;
}

export default function BookingSummary({ bookingData, setBookingData, setActiveSection }: SummaryProps) {

    const handleConfirm = async () => {
        try {
            // Use the createBooking server action you imported
            const response = await createBooking(bookingData);
            
            if (response.success) {
                alert("Booking successfully confirmed!");
                setActiveSection('home'); // Or whatever your success page is
            } else {
                alert("Error: " + response.message);
            }
        } catch (error) {
            console.error("Booking creation failed", error);
        }
    };

    const handleEdit = () => {
    // Use the function prop, not the data object
    setBookingData({
        ...bookingData,
        resourceId: undefined,
        resourceName: undefined,
        resource: undefined,
    });
    
    setActiveSection('venue-booking');
};

    const formatDateTime = (date: Date) => {
        return date.toLocaleString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });
    };

    const handleSubmit = async () => {
        const response = await createBooking(bookingData);
        if (response.success) {
            alert("Booking submitted!");
            setActiveSection('home');
        }
    };

    return (
        <div className="p-6 text-lg gap-2 w-full h-full max-w-lg mx-auto flex flex-col">
            {/* Back Button Header */}
            <header className="flex flex-col items-start gap-0">
                <h1 className="text-lg font-bold">
                    Booking for {bookingData.fullName}
                </h1>
                <p className="text-sm text-gray-600">{formatDateTime(bookingData.bookingStart)} to {formatDateTime(bookingData.bookingEnd)}</p>
            </header>

            {/* Main Content */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {/* User Details */}
                <div>
                <p className="text-base font-bold text-black mb-1">Student ID / Staff ID</p>
                <p className="text-base text-gray-800">{bookingData.userId}</p>
                </div>

                <div>
                <p className="text-base font-bold text-black mb-1">Full Name</p>
                <p className="text-base text-gray-800">{bookingData.fullName}</p>
                </div>

                <div>
                <p className="text-base font-bold text-black mb-1">Number Phone</p>
                <p className="text-base text-gray-800">{bookingData.phone}</p>
                </div>

                <div>
                <p className="text-base font-bold text-black mb-1">User Email</p>
                <p className="text-base text-gray-800">{bookingData.email}</p>
                </div>

                {/* Booking Times */}
                <div>
                <p className="text-base font-bold text-black mb-1">Starting Booking Time</p>
                <p className="text-base text-gray-800">
                    {bookingData.bookingStart?.toLocaleString()}
                </p>
                </div>

                <div>
                <p className="text-base font-bold text-black mb-1">Ending Booking Time</p>
                <p className="text-base text-gray-800">
                    {bookingData.bookingEnd?.toLocaleString()}
                </p>
                </div>

                {/* Booking Purpose */}
                <div>
                <p className="text-base font-bold text-black mb-1">Booking Purpose</p>
                <p className="text-base text-gray-800">{bookingData.bookingPurpose}</p>
                </div>

                {/* Venue and Room */}
                <div className="border-t border-gray-300 pt-4">
                    <p className="text-base text-gray-600">{bookingData.venue}</p>
                    <p className="text-base font-bold text-black">{bookingData.room}</p>
                    <div className="mt-3 space-y-2 rounded-3xl bg-white border border-gray-300 p-2 text-sm text-gray-700">
                        {bookingData.resourceName && (
                            <>
                                <div className="p-2">
                                    {bookingData.resourceName}
                                </div>
                                <div id="equipment-details-section" className="">
                                    <ul className="pl-10 font-normal list-disc text-sm text-gray-700">
                                        {bookingData.resource?.resource_equipments && bookingData.resource.resource_equipments.length > 0 ? (
                                            bookingData.resource.resource_equipments.map((equipment: any, index: number) => (
                                                <li key={index}>
                                                    {equipment.equipment_name} ({equipment.equipment_count} available)
                                                </li>
                                            ))
                                        ) : (
                                            <p className="italic text-gray-500">No equipment included</p>
                                        )}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Confirm or Edit Actions */}
                <div className="flex flex-row justify-center gap-6 mt-20">
                    <Button buttonText="Edit Booking" onClick={handleEdit} />
                    <Button buttonText="Confirm Booking" onClick={handleConfirm} />
                </div>
            </div>
        </div>
    );
}