import { useState } from "react";
import { FilterButtons } from "./FilterButtons";
import { MaintenanceRequest } from "@/types";
import ReportCard from "./ReportCard";

export function MaintenanceRequestList(){
    const [selectedDept, setSelectedDept] = useState("All");

    const mockReports = [
            {
                maintenance_id: "M001",
                faulty_resource: "Room 101",
                fault_detail: "Leaking faucet",
                request_status: "Pending",
                request_date: new Date("2024-07-01"),
                request_author: "John Doe",
                proof_url:"",
                schedule_service_date: new Date("2024-07-03")
            },
            {
                maintenance_id: "M002",
                faulty_resource: "Room 202",
                fault_detail: "Broken window",
                request_status: "In Progress",
                request_date: new Date("2024-07-02"),
                request_author: "John Doe",
                proof_url: "",
                schedule_service_date: new Date("2024-07-04")
            },
            {
                maintenance_id: "M003",
                faulty_resource: "Room 303",
                fault_detail: "Air conditioning not working",
                request_status: "Resolved",
                request_date: new Date("2024-07-03"),
                request_author: "John Doe",
                proof_url: "",
                schedule_service_date: new Date("2024-07-05")
            },
        ] as MaintenanceRequest[];

    return(
        <div>
            <FilterButtons onClickHandler={setSelectedDept}/>
            <div className="flex flex-col gap-3 w-full mt-4">
                {mockReports.map((report) => (
                    <ReportCard key={report.maintenance_id} request={report} />
                ))}
            </div>
        </div>
    )
}