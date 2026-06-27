import { useState, useEffect } from "react";
import { FilterButtons } from "./FilterButtons";
import { MaintenanceRequest } from "@/types";
import ReportCard from "./ReportCard";
import { fetchAllRequests } from "../actions/MaintenanceController";

export function MaintenanceRequestList(){
    const [selectedDept, setSelectedDept] = useState("All");
    const [scheduledReports, setScheduledReports] = useState<MaintenanceRequest[]>([]);
    const [pendingReports, setPendingReports] = useState<MaintenanceRequest[]>([]);

    useEffect(() => {
        setScheduledReports([]);
        setPendingReports([]);
        async function getRequests(){
            const reportList = await fetchAllRequests();

            if(reportList){
                const pending = reportList.filter(report => report.status === "Pending");
                const scheduled = reportList.filter(report => report.status !== "Pending");

                setPendingReports(pending);
                setScheduledReports(scheduled);
            } else {
                alert('error in fetching reports');
            }
                
            return reportList;
        }

        getRequests();
    }, [])

    return(
        <div className="max-w-full min-h-screen">
            <FilterButtons onClickHandler={setSelectedDept}/>
            <div className="flex flex-col gap-3 w-full mt-4">
                <h1>Pending Reports</h1>
                {pendingReports.map((report) => (
                    <ReportCard key={report.fault_id} request={report} hidden={selectedDept !== "All" && selectedDept !== report.faulty_resource_dept} />
                ))}
            </div>
            <div className="w-full h-0.5 bg-black mt-4 mb-4"></div>
            <h1>Scheduled Reports</h1>
            <div className="flex flex-col gap-3 w-full mt-4">
                {scheduledReports.map((report) => (
                    <ReportCard key={report.fault_id} request={report} hidden={selectedDept !== "All" && selectedDept !== report.faulty_resource_dept} />
                ))}
            </div>
        </div>
    )
}