"use client"

import BackButton from "@/app/components/BackButton";
import { db } from "@/lib/DatabaseInitializer";
import { collection, getDocs } from 'firebase/firestore/lite';
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import NavBar, {NavItem} from "@/app/components/NavBar";
import { MdHome, MdPerson } from "react-icons/md";
import { FaCalendarPlus } from "react-icons/fa";
import { redirect } from "next/navigation";

export default function ResourceDetails(){
    const [activeSection, setActiveSection] = useState("booking");
    
    const bookingRecipientNav : NavItem[] = [
        { id: "home", label: "Home", icon: MdHome },
        { id: "booking", label: "Booking", icon: FaCalendarPlus },
        { id: "profile", label: "Profile", icon: MdPerson },
    ];

    const onToggleChange = (id: string) => {
        redirect(`/dashboard?default_sec=${id}`);
    } 

    return(
        <div className="bg-background max-w-screen min-h-screen m-0 p-0 box-border flex flex-col items-center overflow-x-hidden">
            <BackButton buttonName="CNMX1001" buttonDesc="Central Learning Complex (CLC)"></BackButton>
            <div id="resource-img-container" className="relative w-7/8 h-72 rounded-2xl bg-gray-400 mt-24 overflow-hidden cursor-pointer">
                <Image src="/metalpipe.svg" alt="placeholder-img" fill className="object-cover" sizes="33vw" loading="eager"></Image>
            </div>
            <div id="equipment-details-section" className="mt-8 mb-16 w-full max-h-screen pl-[6.25%] font-bold">
                <h1>Resources Included:</h1>
                <div className="pl-4">
                    <ul className="m-2 font-normal list-disc">
                        <li>Air Conditioner</li>
                        <li>AV System</li>
                        <li>Projector</li>
                        <li>Computer</li>
                        <li>150 Seats</li>
                        <li>Whiteboard</li>
                    </ul>
                </div>
            </div>
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