"use client"

import BackButton from "@/app/components/BackButton";
import { collection, getDocs } from 'firebase/firestore/lite';
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import NavBar, {NavItem} from "@/app/components/NavBar";
import { MdHome, MdPerson } from "react-icons/md";
import { FaCalendarPlus } from "react-icons/fa";
import { redirect } from "next/navigation";
import { EquipmentCounter } from "./EquipmentCounter";
import Input from "./input";

interface ResourceDetailsProp{
    resourceId?: string
}

export function EditResourceDetails({resourceId}: ResourceDetailsProp){
    const [activeSection, setActiveSection] = useState("booking");
    const [roomName, setRoomName] = useState("");
    const [imageSource, setImageSource] = useState(null)
    type ResourceTuple = [string, number];
    const [counts, setCounts] = useState<ResourceTuple[]>([]);
    
    const bookingRecipientNav : NavItem[] = [
        { id: "home", label: "Home", icon: MdHome },
        { id: "booking", label: "Booking", icon: FaCalendarPlus },
        { id: "profile", label: "Profile", icon: MdPerson },
    ];

    const onToggleChange = (id: string) => {
        redirect(`/dashboard?default_sec=${id}`);
    } 

    const handleCountChange = (index: number, newCount: number) => {
        setCounts((prevResources) => {
        const updated = [...prevResources];
        // Keep the original string label, only update the number
        updated[index] = [updated[index][0], newCount]; 
        return updated;
        });
    };

    return(
        <div className="bg-background max-w-screen min-h-screen m-0 p-0 box-border flex flex-col overflow-x-hidden">
            <BackButton buttonName="Back" buttonDesc={resourceId === undefined ? "Adding Resource" : `Editing ${resourceId}`}></BackButton>
            
            <div className="flex flex-col justify-center items-center">
                <div id="resource-img-container" className="group flex flex-col justify-center items-center relative w-7/8 h-72 rounded-2xl bg-gray-400 overflow-hidden cursor-pointer">
                    <div className={`absolute inset-0 w-full h-full bg-gray-500/50 z-10 justify-center items-center ${resourceId === undefined ? "flex" : "hidden"} group-hover:flex`}>
                        <p className="text-xl font-mono font-bold text-shadow-2xs text-shadow-white">+ Edit Resource</p>
                    </div>
                    {
                        imageSource ? <Image src={imageSource} alt="placeholder-img" fill className="object-cover z-1" sizes="33vw" loading="eager"></Image>
                        :
                        null
                    }
                    
                </div>
                <div className="w-screen flex justify-center mt-2">
                    <p>Click the image to change it.</p>
                </div>
            </div>
            <form className="w-full">
                <div className="w-full flex flex-col relative p-8 justify-start">
                    <h1>Room Name:</h1>
                    <input id="room-name" defaultValue={roomName} placeholder="Add resource name" className="w-11/12 h-8 bg-accent rounded-full p-2"></input>
                </div>
                <div id="equipment-details-section" className="mb-16 w-full max-h-screen font-bold">
                    <div className="relative flex flex-row items-center mb-8 ml-[6.25%]">
                        <h1>Equipment Included:</h1>
                        <button type="button" onClick={
                            () => setCounts((prev) => {
                                return [...prev, ["New Equipment", 1]];
                            })
                        } className="absolute right-0 text-sm mr-[6.25%] bg-accent p-1.5 rounded-full w-32 cursor-pointer">+ Add Equipment</button>
                    </div>
                    {
                        counts.length <= 0 ?
                        <div className="w-full flex justify-center items-center mt-4 mb-4">
                            <p>Add Resources Now!</p>
                        </div>
                        
                        :
                        counts.map(([name, count], index) => {
                            return (
                                <div key={name} className="relative flex flex-row items-center mb-8">
                                    <Input 
                                    label="" 
                                    type="text" 
                                    key={name} 
                                    className="text-md font-medium ml-[6.25%] w-[50%] border-2 rounded-full" 
                                    placeholder="Enter Resource Name" 
                                    defaultValue={name}
                                    />
                                    <div className="absolute right-0 mr-[6.25%]">
                                        <EquipmentCounter count={count} onChange={(newCount) => handleCountChange(index, newCount)} />
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="w-full flex justify-center">
                        <button type="submit" className="bg-accent p-2 rounded-2xl active:scale-95 active:bg-secondary cursor-pointer">Submit Changes</button>
                    </div>
                </div>
            </form>
            
            <div className="h-32"></div>
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 drop-shadow-2xl">
                <NavBar 
                    items={bookingRecipientNav} 
                    activeSection={activeSection} 
                    onSectionChange={onToggleChange} 
                />
            </div>
        </div>
    )
}