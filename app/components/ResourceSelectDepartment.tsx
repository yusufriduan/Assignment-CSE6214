"use client"

import { ResourceButton } from "./ResourceButton"
import { useRef } from "react"
import { useRouter } from "next/navigation"

interface ResourceSelectDepartmentProp{
    department: string;
}

export function ResourceSelectDepartment({department}: ResourceSelectDepartmentProp){

    const contentRef = useRef<HTMLDivElement>(null);
    const deptButtonRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const toggleDropdown = () => {
        if (contentRef.current && deptButtonRef.current) {
            contentRef.current.classList.toggle('hidden');
            deptButtonRef.current.classList.toggle('rotate-180');
        }
    };

    return(
        <div id="department-dropdown" className="relative w-full">
            <div id="dropdown-btn-section" onClick={toggleDropdown} className="relative cursor-pointer flex flex-row min-h-12 items-center mb-4">
                <h1 className="font-mono font-semibold text-xs select-none w-[70%]">{department}</h1>
                <button onClick={(e) => {e.stopPropagation() ;router.push('/add_resource')}} className="w-20 h-4 bg-secondary rounded-full"><p className="text-xs">+ Add rooms</p></button>
                <div id="arrow-btn" ref={deptButtonRef} className="absolute right-0">
                    ▲
                </div>
            </div>
            <div ref={contentRef} id="content-section" className="w-full flex flex-col items-center mb-2">
                <ResourceButton ResourceID={"1"} ResourceName="CNMX1001" isResourceManager={true} />
                <ResourceButton ResourceID={"2"} ResourceName="CNMX1002" isResourceManager={true} />
            </div>
            <div id="separator-line" className="absolute left-0 bottom-0 h-0.5 w-full bg-black"></div>
        </div>
    )
}