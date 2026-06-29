"use client"

import { ResourceButton } from "./ResourceButton"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchResourceByDept, Resource } from "../actions/ResourceController"
import { DEPARTMENTS } from "../constants"

interface ResourceSelectDepartmentProp{
    department: string;
    onSelectResource: (id: string, name: string, equipment: any[]) => void;
}

export function ResourceSelectDepartment({department, onSelectResource}: ResourceSelectDepartmentProp){

    const departmentFullName = DEPARTMENTS.get(department);

    const contentRef = useRef<HTMLDivElement>(null);
    const deptButtonRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [resourceList, setResourceList] = useState<Resource[] | null>([]);

    const toggleDropdown = () => {
        if (contentRef.current && deptButtonRef.current) {
            contentRef.current.classList.toggle('hidden');
            deptButtonRef.current.classList.toggle('rotate-180');
        }
    };

    useEffect(() => {
        async function getResources(dept: string){
            const res = await fetchResourceByDept(dept);
            setResourceList(res);
        }

        getResources(department);
    }, []);

    return(
        <div id="department-dropdown" className="relative max-w-full overflow-x-hidden">
            <div id="dropdown-btn-section" onClick={toggleDropdown} className="relative cursor-pointer flex flex-row min-h-12 items-center mb-4">
                <h1 className="font-mono font-semibold text-xs select-none w-[70%]">{departmentFullName}</h1>
                <button onClick={(e) => {e.stopPropagation() ;router.push(`/add_resource/${department}`)}} className="w-20 h-4 bg-secondary rounded-full cursor-pointer"><p className="text-xs">+ Add rooms</p></button>
                <div id="arrow-btn" ref={deptButtonRef} className="absolute right-0">
                    ▲
                </div>
            </div>
            <div ref={contentRef} id="content-section" className="w-full flex flex-col justify-center items-center mb-2">
                {
                    resourceList ? 
                    resourceList.map((resource, index) => {
                        return(resource.id && resource.name ? 
                        <ResourceButton key={index} ResourceID={resource.id} ResourceName={resource.name} equipment={resource.equipments} isResourceManager={true} onBook={(id, name, equip) => onSelectResource(id, name, equip)} />
                        : null)
                    })
                    : null
                }
            </div>
            <div id="separator-line" className="absolute left-0 bottom-0 h-0.5 w-full bg-black"></div>
            
        </div>
    )
}