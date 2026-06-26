"use client";

import React from "react";
import Button from "./Button";
import { MaintenanceRequestList } from "./MaintenanceRequestList";
import { BookingRequestList } from "./BookingRequestList";

interface BookingListUIProps{
    pageType: "list" | "detail" | "edit";
    bookingId?: string;
}

export class BookingListUI extends React.Component<BookingListUIProps>{
    public static displayList(){
        return(
            <div className="p-6 h-full w-full max-w-lg mx-auto">
                <header className="flex justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Hi, John!</h1>
                        <p>Manage Bookings</p>
                    </div>
                    
                    <Button className="!w-10 !h-10 !p-2" buttonText="🔔" />
                </header>
                <BookingRequestList />
            </div>                
        );
    }

    render() {

        const { pageType, bookingId } = this.props;

        return (
            <div>
                {pageType === "list" && BookingListUI.displayList()}
            </div>
        );
    }
}