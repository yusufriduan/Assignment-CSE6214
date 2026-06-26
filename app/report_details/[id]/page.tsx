"use client";
import { MaintenanceUI } from "@/app/components/MaintenanceUI";
import { use } from "react";

interface ReportDetailsProps{
    params: Promise<{id: string}>;
}

export default function ReportDetails({params}: ReportDetailsProps){
    const { id } = use(params);
    
    return(
        <MaintenanceUI pageType="detail" MaintenanceId={id} />
    )
}