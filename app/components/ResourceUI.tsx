import { ResourceSelectDepartment } from "./ResourceSelectDepartment";
import React from "react";
import { ResourceDetails } from "./ResourceDetails";
import { EditResourceDetails } from "./EditResourceDetails";
import { DEPARTMENTS } from "../constants";

interface ResourceUIProps{
    pageType: "list" | "detail" | "edit" | "add";
    resourceId?: string;
    department?: string;
    userRole?: "student" | "campus staff" | "resource manager";
}

export function ResourceUI({ pageType, resourceId, department, userRole }: ResourceUIProps){
    
    if (pageType === "list"){
        return(
            <div>
                {
                    [...DEPARTMENTS.entries()].map(([key, val]) => (
                        <ResourceSelectDepartment key={key} department={key} onSelectResource={(id: string) => {console.log("Selected resource:", id);}} />
                    ))
                }
                <div className="h-32 mt-2"></div>
            </div>
            
        );
    }

    if (pageType === "detail" && resourceId && userRole) {
        return(
            <ResourceDetails resourceId={resourceId} userRole={userRole} />
        );
    }
    
    if (pageType === "edit" && resourceId) {
        return(
            <EditResourceDetails resourceId={resourceId} department={department} />
        )
    }

    if (pageType === "add") {
        return <EditResourceDetails department={department} />;
    }

    return null;
}