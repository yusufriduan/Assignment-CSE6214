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
            setBookingList(bookings);
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
                <div className="w-full overflow-hidden flex justify-center flex-col items-center">
                    {
                        bookingList ? 
                        bookingList.map((booking, index) => {
                            return (
                                <BookingRequestCard key={index} hidden={selectedDept !== "All" && selectedDept !== booking.resource.resource_dept} booking_id={booking.booking_id} booking_status={booking.booking_status} userName={booking.booking_owner.name} userRole={booking.booking_owner.role} resourceDepartment={booking.resource.resource_dept} resourceName={booking.resource.resource_name} userEmail={booking.booking_owner.email}/>
                            )
                        })
                        :
                        <p>No Bookings</p>
                    }
                </div>
            }
        </div>
    )
}