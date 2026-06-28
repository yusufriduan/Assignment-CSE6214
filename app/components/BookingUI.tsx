"use client";

import React from "react";
import { BookingRequestList } from "./BookingRequestList";

interface BookingUIProps{
    pageType: "list" | "request_list" | "detail" | "edit";
    bookingId?: string;
}

export class BookingUI extends React.Component<BookingUIProps>{
    public static displayRequests(){
        return (
            <div className="p-4 h-full max-w-screen mx-auto">
                <BookingRequestList />
            </div>
        );
    }

    render() {

        const { pageType, bookingId } = this.props;

        return (
            <div>
                {pageType === "request_list" && BookingUI.displayRequests()}
            </div>
        );
    }
}