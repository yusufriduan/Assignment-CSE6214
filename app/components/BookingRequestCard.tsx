import { defaultPfp } from "../constants";
import Button from "./Button";
import { DEPARTMENTS } from "../constants";
import { useRef, useState } from "react";
import { approveBooking, rejectBooking } from "../actions/BookingController";
import { useRouter } from "next/navigation";

interface BookingRequestCardProp extends React.HTMLAttributes<HTMLDivElement>{
    booking_id: string;
    booking_status: string;
    booking_start: Date; 
    booking_end: Date;
    userProfileImage?: string;
    userName: string;
    userRole: string;
    resource_id: string;
    resourceDepartment: string;
    resourceName: string;
    userEmail: string;
}

export default function BookingRequestCard({booking_id, booking_status, booking_start, booking_end, userProfileImage, userName, userRole, resource_id, resourceDepartment, resourceName, userEmail, ...props}: BookingRequestCardProp){
    
    const [isPending, setIsPending] = useState(false);
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [isProcessed, setIsProcessed] = useState(false);
    const [reason, setReason] = useState("");
    const router = useRouter();
    
    if(userProfileImage === undefined){
        userProfileImage = defaultPfp;
    }

    function handleRejectView(){
        setShowRejectInput(true);
    }

    async function handleApprove(event: React.MouseEvent<HTMLButtonElement>){
        event.stopPropagation();
        event.preventDefault();
        if(isPending){
            alert("Already performing an approval/rejection action!");
            return;
        }
        setIsPending(true);

        const success = await approveBooking(booking_id, userEmail, userName, resource_id, resourceName, booking_start, booking_end);
        
        if(success.success){
            alert(`Successfully approved booking for resource ${resourceName} by ${userName}`);
            setIsProcessed(true);
        } else if (success.error) {
            alert(success.error || `Failed to approve booking.`);
            setIsProcessed(true); 
        } else {
            alert('Internal Server Error');
            setIsPending(false);
        }
    }

    async function onSubmit(event: React.MouseEvent<HTMLButtonElement>){
        event.stopPropagation();
        event.preventDefault();
        if(reason.trim() === ""){
            alert('Enter Reason!');
            return;
        }

        if(isPending){
            alert("Already performing an approval/rejection action!");
            return;
        }

        setIsPending(true);

        const success = await rejectBooking(booking_id, userEmail, reason, userName, resourceName);
        if(success.success){
            alert(`Successfully rejected booking for resource ${resourceName} by ${userName}`);
            setIsProcessed(true);
        } else if (success.error) {
            alert(success.error || `Failed to reject booking.`);
            setIsProcessed(true);
        } else {
            alert('Internal Server Error');
            setIsPending(false);
        }
    }

    if (isProcessed) return null;

    return(
        <div onClick={() => router.push(`/booking_details/${booking_id}`)} id="card-container" className="cursor-pointer w-full h-48 bg-secondary mt-4 mb-12 rounded-2xl p-4 overflow-hidden" {...props}>
            <div id="card-header" className="flex flex-row justify-between w-full h-12">
                <div id="user-info-section" className="flex flex-row justify-center items-center">
                    <div id="image-section" className="h-full">
                        <img src={userProfileImage} className="rounded-full w-full h-full" alt="Profile" />
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

            {booking_status === "Awaiting Approval" && (
                <div className="w-full flex flex-row justify-center items-center mt-4">
                    {showRejectInput && (
                        <div className="flex flex-row justify-start w-full">
                            <input 
                                onChange={(e) => setReason(e.target.value)} 
                                name="rejection-reason" 
                                placeholder="Enter reason for rejecting" 
                                className="pl-2 w-10/12 border-2 rounded-lg"
                                disabled={isPending}
                            />
                            <button 
                                onClick={(e) => onSubmit(e)} 
                                disabled={isPending}
                                className="ml-2 bg-accent p-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Submit
                            </button>
                        </div>
                    )}
                    
                    {!showRejectInput && (
                        <>
                            <button 
                                onClick={(e) => handleApprove(e)} 
                                disabled={isPending}
                                className="bg-green-400 w-32 h-8 rounded-2xl mr-1 cursor-pointer active:scale-95 active:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Processing..." : "Approve"}
                            </button>
                            <button 
                                onClick={(e) => {e.stopPropagation(); handleRejectView()}} 
                                disabled={isPending}
                                className="bg-red-400 w-32 h-8 rounded-2xl ml-1 cursor-pointer active:scale-95 active:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reject
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
