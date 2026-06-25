"use client";

import React from "react";
import Button from "./Button";
import { MaintenanceRequestList } from "./MaintenanceRequestList";
import BackButton from "./BackButton";
import Image from "next/image";
import { defaultFaultProof } from "../constants";
import Input from "./input";


interface MaintenanceUIProps{
    pageType: "list" | "detail" | "edit";
    MaintenanceId?: string;
}

export class MaintenanceUI extends React.Component<MaintenanceUIProps>{
    public static displayList(){
        return(
            <div className="p-4 h-full w-full max-w-lg mx-auto">
                <header className="flex justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Hi, John!</h1>
                        <p>Maintenance Request List</p>
                    </div>
                    
                    <Button className="!w-10 !h-10 !p-2" buttonText="🔔" />
                </header>
                <MaintenanceRequestList />
            </div>                
        );
    }

    public static viewDetail(requestId: string){

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault(); 

            const formData = new FormData(event.currentTarget);

            // convert it into a clean, readable object
            const data = Object.fromEntries(formData.entries());

            console.log("Form Submitted Data:", data);
            /* Output will look like:
            { 
                resourceManagerResponse: "Your text here", 
                scheduleMaintenance: "2026-06-24T22:30" 
            }
            */
        };

        return(
            <div className="p-4 w-full min-h-full flex flex-col">
                <BackButton buttonName="Back" buttonDesc={`Report #${requestId}`}/>
                <div id="ticket-detail" className="w-full flex justify-between">
                    <h1 className="font-semibold">Ticket Number #{requestId}</h1>
                    <div id="status-cont" className="w-24 h-8 bg-green-300 flex items-center justify-center rounded-full">
                        <h1 className="font-semibold" id="report-status-text">Open</h1>
                    </div>
                </div>
                <h1 className="font-semibold mt-4">Reported by</h1>
                <p>Elsa Zara binti Fakhurazzi</p>
                <h1 className="font-semibold mt-4">Report title</h1>
                <p>Couldn't Connect to Projector</p>
                <h1 className="font-semibold mt-4">Venue</h1>
                <p>CNMX1001</p>
                <h1 className="font-semibold mt-4">Report Description</h1>
                <p className="text-justify w-full">I have been trying to connect my personal laptop into the projector. Somehow the projector keeps rejecting to display out the output. My laptop has been on duplicate mode this whole time.</p>
                <h1 className="font-semibold mt-4">Proof of Fault</h1>
                <div id="resource-img-container" className="h-72 rounded-2xl overflow-hidden cursor-pointer mt-2">
                    <img src={defaultFaultProof} alt="proof-image"></img>
                </div>
                <div className="w-full h-0.5 bg-black mt-4"></div>
                <form id="resource-manager-response-form" onSubmit={(e) => handleSubmit(e)} className="mt-4 flex flex-col justify-center items-center ">
                    <Input label="Resource Manager Response" type="text" placeholder="Enter response" name="resourceManagerResponse" />
                    <br></br>
                    <Input label="Schedule Maintenance" type="datetime-local" placeholder="" name="scheduleMaintenance" />
                    <button type="submit" className="p-2 bg-red-400 cursor-pointer mt-4 rounded-xl active:scale-95 active:bg-red-500">Ready to Close</button>
                </form>
                <div className="h-32"></div>
            </div>
        )
    }

    render() {

        const { pageType, MaintenanceId } = this.props;

        return (
            <div>
                {pageType === "list" && MaintenanceUI.displayList()}
                {pageType === "detail" && MaintenanceId !== undefined && MaintenanceUI.viewDetail(MaintenanceId)}
            </div>
        );
    }
}