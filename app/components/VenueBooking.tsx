import BackButton from "./BackButton";
import { ResourceSelectDepartment } from "./ResourceSelectDepartment";
import { createBooking } from "../actions/BookingController"
import { DEPARTMENTS } from "../constants";
import { useEffect } from "react";
import Button from "./Button";
import React from "react";

interface bookingData {
    userId: string;
    fullName: string;
    email: string;
    bookingStart: Date;
    bookingEnd: Date;
    bookingPurpose: string;
    resourceId?: string;
    resourceName?: string;
    resource?: { 
        resource_equipments: { equipment_name: string; equipment_count: number }[] 
    };
    request_created_date?: Date; // Add the ? to make it optional
};

interface VenueBookingProps {
    setActiveSection: (section: string) => void;
    bookingData: bookingData | null;
    setBookingData: (data: bookingData) => void;
}

export default function VenueBooking({ setActiveSection, bookingData, setBookingData }: VenueBookingProps) {

    const formatDateTime = (date: Date) => {
        return date.toLocaleString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });
    };

    useEffect(() => {
        if (!bookingData) {
            // If there's no booking data, maybe the user refreshed the page.
            // It's better to send them back to the start of the booking process.
            setActiveSection('booking');
        }
    }, [bookingData, setActiveSection]);

    const handleVenueSelect = async (resourceId: string, resourceName: string, equipmentList: any[]) => {
        if (!bookingData) return;

        setBookingData({
            ...bookingData!,
            resourceId,
            resourceName,
            resource: {
                resource_equipments: equipmentList
            },
            request_created_date: new Date()
        })

        setActiveSection('booking-summary')
    };

    if (!bookingData) {
        return <div className="p-6">Loading booking details...</div>;
    }

    return (
        <div className="p-6 text-lg gap-2 w-full h-full max-w-lg mx-auto flex flex-col">
            <header className="flex flex-col items-start gap-0">
                <h1 className="text-lg font-bold">
                    Booking for {bookingData.fullName}
                </h1>
                <p className="text-sm text-gray-600">{formatDateTime(bookingData.bookingStart)} to {formatDateTime(bookingData.bookingEnd)}</p>
            </header>
            <p className="text-sm font-medium">Please select available venues</p>
            <div className="w-full h-0.5 bg-textbox my-2" />
            <div className="w-full h- flex flex-col gap-4">
            {
                [...DEPARTMENTS.entries()].map(([key, val]) => (
                    <React.Fragment key={`${key}-wrapper`}>
                        <ResourceSelectDepartment 
                            key={`${key}-dept`} 
                            department={key} 
                            onSelectResource={handleVenueSelect}
                        />
                    </React.Fragment>
                ))
            }
            </div>
        </div>
    );
}