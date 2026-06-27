import { FilterButtons } from "./FilterButtons";
import { useState, useEffect } from "react";
import BookingCard from "./BookingCard";
import BookingRequestCard from "./BookingRequestCard";
import { fetchAllBooking } from "../actions/BookingController";
import { Booking } from "@/types";

export function BookingRequestList(){

    const [selectedDept, setSelectedDept] = useState("All");
    const [loading, setLoading] = useState(true);
    const [bookingList, setBookingList] = useState<Booking[] | null>(null);

    useEffect(() => {
        async function getBookingList(){
            const bookings = await fetchAllBooking();
            const pending = bookings.filter(booking => booking.booking_status === "Awaiting Approval");
            setBookingList(pending);
        }

        getBookingList();
        setLoading(false);
    }, [])

    return(
        <div className="w-full min-h-full">
            <FilterButtons onClickHandler={setSelectedDept}/>
            {
                loading ?
                <div className="w-full flex justify-center items-center">
                    <p>Loading</p>
                </div>
                :
                <div className="w-full overflow-hidden flex justify-center flex-col items-center mt-4">
                    {(() => {
                        // filter the list based on status and department first
                        const filteredBookings = (bookingList || []).filter(booking => {
                            const matchesStatus = booking.booking_status === "Awaiting Approval";
                            const matchesDept = selectedDept === "All" || selectedDept === booking.resource.resource_dept;
                            return matchesStatus && matchesDept;
                        });

                        // render based on whether the filtered list has items
                        return filteredBookings.length > 0 ? (
                            filteredBookings.map((booking: Booking, index) => (
                                <BookingRequestCard 
                                    key={booking.booking_id || index} // Best practice: use unique ID instead of index if possible
                                    booking_id={booking.booking_id} 
                                    booking_status={booking.booking_status} 
                                    userName={booking.booking_owner.name} 
                                    userRole={booking.booking_owner.role} 
                                    resourceDepartment={booking.resource.resource_dept} 
                                    resourceName={booking.resource.resource_name} 
                                    userEmail={booking.booking_owner.email}
                                />
                            ))
                        ) : (
                            <p>No Bookings</p>
                        );
                    })()}
                </div>
            }
        </div>
    )
}