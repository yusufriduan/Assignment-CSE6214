import { ResourceSelectDepartment } from "./ResourceSelectDepartment";
import React from "react";
import { ResourceDetails } from "./ResourceDetails";
import { EditResourceDetails } from "./EditResourceDetails";
import Button from "./Button";
import { DEPARTMENTS } from "../constants";

interface ResourceUIProps{
    pageType: "list" | "detail" | "edit" | "add";
    resourceId?: string;
}

export class ResourceUI extends React.Component<ResourceUIProps>{
    public static displayList(){
        return(
            <div className="w-screen flex flex-col p-4">
                <header className="flex justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Hi, John!</h1>
                        <p>Resource List</p>
                    </div>
                    
                    <Button className="!w-10 !h-10 !p-2" buttonText="🔔" />
                </header>
                {
                    [...DEPARTMENTS.entries()].map(([key, val]) => (
                        <ResourceSelectDepartment key={key} department={val} />
                    ))
                }
                <div className="h-32 mt-2"></div>
            </div>
            
        );
    }

    public static viewResource(resourceID: string){
        return(
            <ResourceDetails resourceId={resourceID} />
        )
    }
    
    public static modifyResourceForm(resourceID?: string){
        return(
            <EditResourceDetails resourceId={resourceID} />
        )
    }

    render() {

        const { pageType, resourceId } = this.props;

        return (
            <div>
                {pageType === "list" && ResourceUI.displayList()}
                {pageType === "detail" && resourceId !== undefined && ResourceUI.viewResource(resourceId)}
                {pageType === "edit" && resourceId !== undefined && ResourceUI.modifyResourceForm(resourceId)}
                {pageType === "add" && ResourceUI.modifyResourceForm()}
            </div>
        );
    }
}