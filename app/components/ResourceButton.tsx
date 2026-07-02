"use client";

import { useRouter } from "next/navigation";
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Button from "../components/Button";

interface ResourceButtonProp{
    ResourceID: string;
    ResourceName: string;
    equipment: any[];
    // change this to jwt later
    isResourceManager: boolean;
    // EditAction: () => void;
    onBook?: (id: string, name: string, equipment: any[]) => void;
    resource_status: string;
}

export function ResourceButton({ResourceID, ResourceName, equipment, onBook, resource_status}: ResourceButtonProp){

    const router = useRouter();

    const { data: session, status } = useSession();
    const userRole = session?.user?.role?.toLowerCase() || null;
    const isResourceManager = userRole === "resource manager";

    if (status === "loading") {
        return <div className="w-72 h-16 bg-secondary/50 rounded-xl animate-pulse mt-1 mb-1" />;
    }
    
    const handleClick = () => {
        router.push(`/resource_details/${ResourceID}?source=manage-resources`);
    }

    const handleBooking = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onBook)
            onBook(ResourceID, ResourceName, equipment); // Now passing 3 arguments
    }

    return(
        <div hidden={!isResourceManager && resource_status === "Under Maintenance"} onClick={handleClick} id="button-cont" className="relative w-72 h-16 bg-secondary rounded-xl p-4 cursor-pointer mt-1 mb-1">
            <h1 className="font-mono font-semibold text-xl">{ResourceName}</h1>
            { isResourceManager
            ? 
            <div className="absolute right-0 top-0 flex flex-col items-center justify-center w-1/5 h-full">
                <button onClick={(e) => {e.stopPropagation(); router.push(`/edit_resource/${ResourceID}`);}} className="cursor-pointer m-1"><FaRegEdit /></button>
                <button onClick={(e) => {e.stopPropagation(); router.push(`/delete_resource?id=${ResourceID}&name=${ResourceName}`);}} className="cursor-pointer m-1 mr-1.5"><FaTrash /></button>
            </div>
            : 
            <div className="absolute right-5 top-0 flex flex-col items-center justify-center w-1/5 h-full">
                <Button className=" !rounded-3xl !py-3 !px-5 rounded-md !hover:bg-blue-600 !transition-colors" buttonText="Book" onClick={handleBooking} />
            </div>
            }
        </div>
    )
}