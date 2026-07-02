"use client";

import { useEffect, useState } from "react";
import { FilterButtons } from "./FilterButtons";
import { fetchAllBooking, modifyBookingStatus } from "../actions/BookingController";
import { Booking } from "@/types";
import BookingRequestCard from "./BookingRequestCard";

export default function BookingList(){

    const [selectedDept, setSelectedDept] = useState("All");
    const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
    const [approvedBookings, setApprovedBookings] = useState<Booking[]>([]);
    const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
    const [rejectedBookings, setRejectedBookings] = useState<Booking[]>([]);
    const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([]);

    useEffect(() => {
        async function getList() {
            const list: Booking[] = await fetchAllBooking();
            if (!list) return;

            const now = new Date();
            const updatedList = await Promise.all(
                list.map(async (booking) => {
                    const endEndTime = new Date(booking.booking_end);

                    if (endEndTime < now) {
                        let newStatus = booking.booking_status;

                        if (booking.booking_status === "Check-in") {
                            newStatus = "Ended";
                        } else if (booking.booking_status !== "Ended" && booking.booking_status !== "Cancelled" && booking.booking_status !== "Rejected") {
                            // If it's past its time and wasn't checked-in, ended, or already cancelled, it becomes Cancelled
                            newStatus = "Cancelled";
                        }

                        // Only trigger an API call if the status actually needs changing
                        if (newStatus !== booking.booking_status) {
                            await modifyBookingStatus(booking.booking_id, newStatus);
                            return { ...booking, booking_status: newStatus };
                        }
                    }
                    return booking;
                })
            );

            const pending = updatedList.filter(b => (b.booking_status === "Awaiting Approval" || b.booking_status === "Pending Re-approval"));
            const approved = updatedList.filter(b => b.booking_status === "Booked" || b.booking_status === "Check-in");
            const completed = updatedList.filter(b => b.booking_status === "Ended");
            const rejected = updatedList.filter(b => b.booking_status === "Rejected");
            const cancelled = updatedList.filter(b => b.booking_status === "Cancelled");

            setPendingBookings(pending);
            setApprovedBookings(approved);
            setCompletedBookings(completed);
            setRejectedBookings(rejected);
            setCancelledBookings(cancelled);
        }

        getList();
    }, []);

    return(
        <div className="max-w-full min-h-screen">
            <FilterButtons onClickHandler={setSelectedDept} />
            <h1 className="mt-4">Pending Bookings:</h1>
            {
                
                pendingBookings.map((booking, index) => {
                    return(
                        <BookingRequestCard 
                            key={booking.booking_id || index}
                            booking_id={booking.booking_id} 
                            booking_status={booking.booking_status} 
                            booking_start={booking.booking_start}
                            booking_end={booking.booking_end}
                            userName={booking.booking_owner.name} 
                            userRole={booking.booking_owner.role} 
                            resource_id={booking.resource.resource_id}
                            resourceDepartment={booking.resource.resource_dept} 
                            resourceName={booking.resource.resource_name} 
                            userEmail={booking.booking_owner.email}
                            hidden={selectedDept !== "All" && selectedDept !== booking.resource.resource_dept}
                        />
                    )
                })
            }
            <div className="h-0.5 w-full bg-black mt-4 mb-4"></div>
            <h1>Approved Bookings:</h1>
            {
                
                approvedBookings.map((booking, index) => {
                    return(
                        <BookingRequestCard 
                            key={booking.booking_id || index}
                            booking_id={booking.booking_id} 
                            booking_status={booking.booking_status} 
                            booking_start={booking.booking_start}
                            booking_end={booking.booking_end}
                            userName={booking.booking_owner.name} 
                            userRole={booking.booking_owner.role} 
                            resource_id={booking.resource.resource_id}
                            resourceDepartment={booking.resource.resource_dept} 
                            resourceName={booking.resource.resource_name} 
                            userEmail={booking.booking_owner.email}
                            hidden={selectedDept !== "All" && selectedDept !== booking.resource.resource_dept}
                        />
                    )
                })
            }
            <div className="h-0.5 w-full bg-black mt-4 mb-4"></div>
            <h1>Completed Bookings:</h1>
            {
                
                completedBookings.map((booking, index) => {
                    return(
                        <BookingRequestCard 
                            key={booking.booking_id || index}
                            booking_id={booking.booking_id} 
                            booking_status={booking.booking_status} 
                            booking_start={booking.booking_start}
                            booking_end={booking.booking_end}
                            userName={booking.booking_owner.name} 
                            userRole={booking.booking_owner.role} 
                            resource_id={booking.resource.resource_id}
                            resourceDepartment={booking.resource.resource_dept} 
                            resourceName={booking.resource.resource_name} 
                            userEmail={booking.booking_owner.email}
                            hidden={selectedDept !== "All" && selectedDept !== booking.resource.resource_dept}
                        />
                    )
                })
            }
            <div className="h-0.5 w-full bg-black mt-4 mb-4"></div>
            <h1>Rejected Bookings:</h1>
            {
                
                rejectedBookings.map((booking, index) => {
                    return(
                        <BookingRequestCard 
                            key={booking.booking_id || index}
                            booking_id={booking.booking_id} 
                            booking_status={booking.booking_status} 
                            booking_start={booking.booking_start}
                            booking_end={booking.booking_end}
                            userName={booking.booking_owner.name} 
                            userRole={booking.booking_owner.role} 
                            resource_id={booking.resource.resource_id}
                            resourceDepartment={booking.resource.resource_dept} 
                            resourceName={booking.resource.resource_name} 
                            userEmail={booking.booking_owner.email}
                            hidden={selectedDept !== "All" && selectedDept !== booking.resource.resource_dept}
                        />
                    )
                })
            }
            <div className="h-0.5 w-full bg-black mt-4 mb-4"></div>
            <h1>Cancelled Bookings:</h1>
            {
                
                cancelledBookings.map((booking, index) => {
                    return(
                        <BookingRequestCard 
                            key={booking.booking_id || index}
                            booking_id={booking.booking_id} 
                            booking_status={booking.booking_status} 
                            booking_start={booking.booking_start}
                            booking_end={booking.booking_end}
                            userName={booking.booking_owner.name} 
                            userRole={booking.booking_owner.role} 
                            resource_id={booking.resource.resource_id}
                            resourceDepartment={booking.resource.resource_dept} 
                            resourceName={booking.resource.resource_name} 
                            userEmail={booking.booking_owner.email}
                            hidden={selectedDept !== "All" && selectedDept !== booking.resource.resource_dept}
                        />
                    )
                })
            }
            <div className="h-0.5 w-full bg-black mt-4 mb-4"></div>
        </div>
    )
}