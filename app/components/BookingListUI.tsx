"use client";

import React from "react";
import { BookingRequestList } from "./BookingRequestList";

interface BookingListUIProps{
    pageType: "list" | "detail" | "edit";
    bookingId?: string;
}

export class BookingListUI extends React.Component<BookingListUIProps>{
    public static displayList(){
        return <BookingRequestList />;
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