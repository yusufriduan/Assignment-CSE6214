import { MaintenanceRequest } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportCard({ request }: { request: MaintenanceRequest }) {
    if (!request) return null;

    const statusColor = 
        request.request_status === "Awaiting Approval" ? "bg-yellow-100 text-yellow-800" :
        request.request_status === "Resolved" ? "bg-green-100 text-green-800" :
        "bg-gray-100 text-gray-800";

    const [formattedDate, setFormattedDate] = useState<string>('');
    const [formattedTime, setFormattedTime] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        // This runs ONLY on the client browser after hydration
        const dateObj = (request.request_date && typeof (request.request_date as any).toDate === 'function')
            ? (request.request_date as any).toDate()
            : new Date(request.request_date as string | Date);

        setFormattedDate(dateObj.toLocaleDateString());
        setFormattedTime(dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, [request.request_date]);

    function onClickHandler(id: string){
        router.push(`/report_details/${id}`);
    }

    return (
        <div onClick={() => onClickHandler(request.maintenance_id)} className="cursor-pointer flex flex-col gap-1 w-full p-4 bg-background/50 backdrop-blur-md rounded-xl border border-white/20 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-lg font-bold text-gray-900">{request.maintenance_id} {request.fault_detail}</h1>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor}`}>
                    {request.request_status}
                </span>
            </div>
            
            <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Resource:</span> {request.faulty_resource}
                </p>
            </div>

            <div className="w-full h-[1px] bg-gray-300 my-3" />

            <div className="flex justify-between items-center text-xs text-gray-500">
                <p>ID: {request.maintenance_id}</p>
                {/* Use the safe dateObj here instead of request.request_date! 
                */}
                <p>{formattedDate || 'Loading Date'} at {formattedTime || 'Loading Time'}</p>
            </div>
        </div>
    );
}