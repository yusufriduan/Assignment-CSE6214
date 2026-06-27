"use client";

import React from "react";
import Button from "./Button";

interface AnalyticsUIProp{}

interface AnalyticsUIState{

}

export class AnalyticsUI extends React.Component<AnalyticsUIProp, AnalyticsUIState>{
    public static displayAnalyticsDashboard(){
        return(
            <div className="p-4 w-full min-h-full flex flex-col">
                <header className="flex justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Hi, John!</h1>
                        <p>Analytics (18th - 24th May 2026)</p>
                    </div>
                    
                    <Button className="!w-10 !h-10 !p-2" buttonText="🔔" />
                </header>
                <div id="content-section" className="mt-4">
                    <div id="booking-section-header" className="flex flex-row justify-between items-center">
                        <h1 className="font-semibold text-sm">Total number of Bookings</h1>
                        <h1 className="font-semibold text-sm flex flex-row justify-center items-center">25 total</h1>
                    </div>
                    <div id="top-bookings" className="w-full p-2 min-h-32 bg-secondary mt-4 rounded-2xl flex flex-col">
                        <h1 className="font-semibold">Top 3 Most Booked Venues</h1>
                        <div className="grid grid-cols-[65%_1fr] gap-4">
                            <p>#1 CLC CNMX1001</p>
                            <p className="place-self-end text-sm">10 bookings</p>
                        </div>
                        <div className="grid grid-cols-[65%_1fr] gap-4">
                            <p>#2 FCI CQAR2007</p>
                            <p className="place-self-end text-sm">2 bookings</p>
                        </div>
                        <div className="grid grid-cols-[65%_1fr] gap-4">
                            <p>#3 FAIE CQAR2035</p>
                            <p className="place-self-end text-sm">1 booking</p>
                        </div>
                    </div>
                    <div className="p-2 w-full min-h-12 bg-secondary mt-4 rounded-full flex flex-row justify-between items-center">
                        <h1 className="font-semibold">Peak Booking Hours</h1>
                        <p className="text-sm">12:00 - 14:00</p>
                    </div>
                    <div className="w-full h-0.5 bg-black mt-8 mb-8"></div>
                    <div id="booking-section-header" className="flex flex-row justify-between items-center">
                        <h1 className="font-semibold text-sm">Total number of Reports</h1>
                        <h1 className="font-semibold text-sm flex flex-row justify-center items-center">67 total</h1>
                    </div>
                    <div id="top-bookings" className="w-full p-2 min-h-32 bg-secondary mt-4 rounded-2xl flex flex-col">
                        <h1 className="font-semibold">Top 3 Most Reported Venues</h1>
                        <div className="grid grid-cols-[65%_1fr] gap-4">
                            <p>#1 CLC CNMX1001</p>
                            <p className="place-self-end text-sm">10 reports</p>
                        </div>
                        <div className="grid grid-cols-[65%_1fr] gap-4">
                            <p>#2 FCI CQAR2007</p>
                            <p className="place-self-end text-sm">2 reports</p>
                        </div>
                        <div className="grid grid-cols-[65%_1fr] gap-4">
                            <p>#3 FAIE CQAR2035</p>
                            <p className="place-self-end text-sm">1 reports</p>
                        </div>
                    </div>
                </div>
                <div className="h-32 mt-2"></div>
            </div>
        )
    }

    render(){
       return(
        <div>
            {AnalyticsUI.displayAnalyticsDashboard()}
        </div>
       ) 
    }
}