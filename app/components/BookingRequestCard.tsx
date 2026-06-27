import { defaultPfp } from "../constants";
import Button from "./Button";
import { DEPARTMENTS } from "../constants";
import { useRef, useState } from "react";
import { approveBooking, rejectBooking } from "../actions/BookingController";

interface BookingRequestCardProp extends React.HTMLAttributes<HTMLDivElement>{
    booking_id: string;
    booking_status: string;
    userProfileImage?: string;
    userName: string;
    userRole: string;
    resourceDepartment: string;
    resourceName: string;
    userEmail: string;
}

export default function BookingRequestCard({booking_id, booking_status, userProfileImage, userName, userRole, resourceDepartment, resourceName, userEmail, ...props}: BookingRequestCardProp){
    
    const approveBtn = useRef<HTMLButtonElement>(null);
    const rejectBtn = useRef<HTMLButtonElement>(null);
    const rejectReasonRef = useRef<HTMLDivElement>(null);
    const thisRef = useRef<HTMLDivElement>(null);

    const [reason, setReason] = useState("");
    
    if(userProfileImage === undefined){
        userProfileImage = defaultPfp;
    }

    function handleReject(){
        if(approveBtn && approveBtn.current && rejectBtn && rejectBtn.current && rejectReasonRef && rejectReasonRef.current){
            approveBtn.current.hidden = true;
            rejectBtn.current.hidden = true;
            rejectReasonRef.current.hidden = false;
        }
    }

    async function handleApprove(event: React.MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        if(approveBtn && approveBtn.current && rejectBtn && rejectBtn.current){
            approveBtn.current.disabled = true;
            rejectBtn.current.disabled = true;
        }
        const success = await approveBooking(booking_id, userEmail, userName, resourceName);
        if(success.success){
            alert(`Successfully approved booking for resource ${resourceName} by ${userName}`);
            if(thisRef && thisRef.current){
                thisRef.current.hidden = true;
            }
        } else if (success.error) {
            alert(`Failed to approve booking for resource ${resourceName} by ${userName}`);
        } else {
            alert('Internal Server Error');
        }
    }

    async function onSubmit(event: React.MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        const btn = event.target as HTMLButtonElement;
        btn.disabled = true;
        if(reason === ""){
            alert('Enter Reason!');
            btn.disabled = false;
            return;
        }

        const success = await rejectBooking(booking_id, userEmail, reason, userName, resourceName);
        if(success.success){
            alert(`Successfully rejected booking for resource ${resourceName} by ${userName}`);
            if(thisRef && thisRef.current){
                thisRef.current.hidden = true;
            }
        } else if (success.error) {
            alert(`Failed to reject booking for resource ${resourceName} by ${userName}`);
        } else {
            alert('Internal Server Error');
        }
        
    }

    return(
        <div ref={thisRef} id="card-container" className="w-full h-48 bg-secondary mt-16 rounded-2xl p-4 overflow-hidden" {...props}>
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
            {
                booking_status === "Awaiting Approval" ?
                <div className="w-full flex flex-row justify-center items-center mt-4">
                    <div ref={rejectReasonRef} className="flex flex-row justify-start w-full" hidden>
                        <input onChange={(e) => setReason(e.target.value)} name="rejection-reason" placeholder="Enter reason for rejecting" className="pl-2 w-10/12 border-2 rounded-lg"></input>
                        <button onClick={(e) => onSubmit(e)} className="ml-2 bg-accent p-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:bg-accent disabled:text-gray-700">Submit</button>
                    </div>
                    
                    <button ref={approveBtn} onClick={(e) => handleApprove(e)} className="bg-green-400 w-32 h-8 rounded-2xl mr-1 cursor-pointer active:scale-95 active:bg-green-600">Approve</button>
                    <button ref={rejectBtn} onClick={handleReject} className="bg-red-400 w-32 h-8 rounded-2xl ml-1 cursor-pointer active:scale-95 active:bg-red-500">Reject</button>
                </div>
                :
                null
            }
            
        </div>
    )
}