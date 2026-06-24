import { defaultPfp } from "../constants";
import Button from "./Button";
import { DEPARTMENTS } from "../constants";

interface BookingRequestCardProp extends React.HTMLAttributes<HTMLDivElement>{
    userProfileImage?: string;
    userName: string;
    userRole: string;
    resourceDepartment: string;
    resourceName: string;
}

export default function BookingRequestCard({userProfileImage, userName, userRole, resourceDepartment, resourceName, ...props}: BookingRequestCardProp){
    if(userProfileImage === undefined){
        userProfileImage = defaultPfp;
    }

    return(
        <div id="card-container" className="w-full h-48 bg-secondary mt-16 rounded-2xl p-4 overflow-hidden" {...props}>
            <div id="card-header" className="flex flex-row justify-between w-full h-12">
                <div id="user-info-section" className="flex flex-row justify-center items-center">
                    <div id="image-section" className="h-full">
                        <img src={userProfileImage} className="rounded-full w-full h-full"></img>
                    </div>
                    <div id="text-section" className="h-full flex flex-col justify-center ml-1">
                        <h1 className="text-sm font-semibold">{userName}</h1>
                        <p className="text-sm font-light text-gray-500">{userRole}</p>
                    </div>
                </div>
                <Button buttonText="->" className="bg-gray-100" />
            </div>
            <div id="resource-" className="mt-4 font-semibold">
                <h1>{resourceName}</h1>
                <h1 className="text-xs">{DEPARTMENTS.get(resourceDepartment)}</h1>
            </div>
            <div className="w-full flex flex-row justify-center items-center mt-4">
                <button className="bg-green-400 w-32 h-8 rounded-2xl mr-1 cursor-pointer active:scale-95 active:bg-green-600">Approve</button>
                <button className="bg-red-400 w-32 h-8 rounded-2xl ml-1 cursor-pointer active:scale-95 active:bg-red-500">Reject</button>
            </div>
        </div>
    )
}