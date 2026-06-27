"use client";

import React, { useState, useEffect } from "react";
import Button from "./Button";
import { MaintenanceRequestList } from "./MaintenanceRequestList";
import BackButton from "./BackButton";
import Input from "./input";
import { fetchRequest, scheduleService } from "../actions/MaintenanceController";
import { MaintenanceRequest } from "@/types";
import { useRouter } from "next/navigation";

interface MaintenanceUIProps {
    pageType: "list" | "detail" | "edit";
    MaintenanceId?: string;
}

interface DetailLoaderProps {
    requestId: string;
}

const DetailLoader: React.FC<DetailLoaderProps> = ({ requestId }) => {
    const [maintenanceRequest, setMaintenanceRequest] = useState<MaintenanceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;
        
        async function getDetails() {
            const req = await fetchRequest(requestId);
            if (!isMounted) return;

            if (req === null) {
                alert('fail to load maintenance request detail');
                router.push('/dashboard');
                return;
            }
            setMaintenanceRequest(req);
            setLoading(false);
        }
        getDetails();

        return () => {
            isMounted = false;
        };
    }, [requestId, router]); 

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const response = data.resourceManagerResponse as string;
        const date = new Date(data.scheduleMaintenance as string);

        if (maintenanceRequest) {
            const success = await scheduleService(
                requestId,
                maintenanceRequest.faulty_resource_ref,
                date,
                maintenanceRequest.request_author_email,
                response,
                maintenanceRequest.fault_title
            );
            if (success.success) {
                alert("Successfully scheduled service");
                router.push('/dashboard');
            } else {
                alert('An error occurred while scheduling');
            }
        }
    };

    if (loading) return <div className="p-4">Loading details...</div>;

    return (
        <div className="p-4 w-full min-h-full flex flex-col">
            {maintenanceRequest ? (
                <div className="w-full min-h-full flex flex-col">
                    <BackButton buttonName="Back" buttonDesc={`Report #${requestId}`} />
                    <div id="ticket-detail" className="w-full flex justify-between">
                        <h1 className="font-semibold">Ticket #{requestId}</h1>
                        <div id="status-cont" className={`w-24 h-8 ${maintenanceRequest.status === "Pending" ? "bg-orange-300" : "bg-red-300"} flex items-center justify-center rounded-full`}>
                            <h1 className="font-semibold" id="report-status-text">{maintenanceRequest.status}</h1>
                        </div>
                    </div>
                    <h1 className="font-semibold mt-4">Reported by</h1>
                    <p>{maintenanceRequest.request_author}</p>
                    <h1 className="font-semibold mt-4">Report title</h1>
                    <p>{maintenanceRequest.fault_title}</p>
                    <h1 className="font-semibold mt-4">Venue</h1>
                    <p>{maintenanceRequest.faulty_resource_name}</p>
                    <h1 className="font-semibold mt-4">Report Description</h1>
                    <p className="text-justify w-full">{maintenanceRequest.fault_detail}</p>
                    <h1 className="font-semibold mt-4">Proof of Fault</h1>
                    <div id="resource-img-container" className="h-72 rounded-2xl overflow-hidden cursor-pointer mt-2">
                        <img src={maintenanceRequest.proof_url} alt="proof-image"></img>
                    </div>
                    <div className="w-full h-0.5 bg-black mt-4"></div>
                    <form id="resource-manager-response-form" onSubmit={handleSubmit} className="mt-4 flex flex-col justify-center items-center" hidden={maintenanceRequest.status !== "Pending"}>
                        <Input label="Resource Manager Response" type="text" placeholder="Enter response" name="resourceManagerResponse" required />
                        <br />
                        <Input label="Schedule Maintenance" type="datetime-local" placeholder="" name="scheduleMaintenance" required />
                        <button type="submit" className="p-2 bg-red-400 cursor-pointer mt-4 rounded-xl active:scale-95 active:bg-red-500">Ready to Close</button>
                    </form>
                </div>
            ) : null}
            <div className="h-32"></div>
        </div>
    );
};

export class MaintenanceUI extends React.Component<MaintenanceUIProps> {
    public static displayList() {
        return (
            <div className="p-4 h-full max-w-screen mx-auto">
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

    public static viewDetail(requestId: string) {
        return <DetailLoader requestId={requestId} />;
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