"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaRegEdit, FaTrash } from "react-icons/fa";

interface ResourceButtonProp{
    ResourceID: string;
    ResourceName: string;
    // change this to jwt later
    isResourceManager: boolean;
    // EditAction: () => void;
}

export function ResourceButton({ResourceID, ResourceName, isResourceManager}: ResourceButtonProp){

    const router = useRouter();

    const handleClick = () => {
        router.push(`/resource_details/${ResourceID}`)
    }

    return(
        <div onClick={handleClick} id="button-cont" className="relative w-72 h-16 bg-secondary rounded-xl p-4 cursor-pointer mt-1 mb-1">
            <h1 className="font-mono font-semibold text-xl">{ResourceName}</h1>
            { isResourceManager
            ? 
            <div className="absolute right-0 top-0 flex flex-col items-center justify-center w-1/5 h-full">
                <button className="cursor-pointer m-1"><FaRegEdit /></button>
                <button className="cursor-pointer m-1 mr-1.5"><FaTrash /></button>
            </div>
            : 
            null
            }
        </div>
    )
}