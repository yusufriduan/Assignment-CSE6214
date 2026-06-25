"use client"

import BackButton from "@/app/components/BackButton";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import NavBar, {NavItem} from "@/app/components/NavBar";
import { MdHome, MdPerson } from "react-icons/md";
import { FaCalendarPlus } from "react-icons/fa";
import { redirect } from "next/navigation";
import { fetchResource, ResourceDataPayload } from "../actions/ResourceController";
import { DEPARTMENTS } from "../constants";

interface ResourceDetailsProp{
    resourceId: string
}

export function ResourceDetails({resourceId}: ResourceDetailsProp){
    const [activeSection, setActiveSection] = useState("booking");
    const [loading, setLoading] = useState<boolean>(true);
    const [currentResource, setCurrentResource] = useState<ResourceDataPayload | null>(null)

    const bookingRecipientNav : NavItem[] = [
        { id: "home", label: "Home", icon: MdHome },
        { id: "booking", label: "Booking", icon: FaCalendarPlus },
        { id: "profile", label: "Profile", icon: MdPerson },
    ];

    const onToggleChange = (id: string) => {
        redirect(`/dashboard?default_sec=${id}`);
    } 

    useEffect(() => {
        async function loadResourceData() {
            try {
                const data = await fetchResource(resourceId);
                if (data) {
                    setCurrentResource(data);
                }
            } catch (err) {
                console.error("Error invoking server action:", err);
                alert('Fail to get resource details!');
                redirect('/dashboard');
            } finally {
                setLoading(false);
            }
        }

        loadResourceData();
    }, [resourceId])

    return(
        <div className="bg-background max-w-screen min-h-screen m-0 p-0 box-border">
            {
                loading ? <p>Loading Resource Details...</p>
                :
                <div className="w-full min-h-full flex flex-col overflow-x-hidden">
                    <BackButton buttonName={currentResource ? currentResource.name : "N/A"} buttonDesc={currentResource ? `${DEPARTMENTS.get(currentResource.dept)} (${currentResource.dept})` : "N/A"}></BackButton>
                    <div id="resource-img-container" className="relative w-7/8 h-72 rounded-2xl bg-gray-400 mt-4 overflow-hidden cursor-pointer justify-center mx-auto">
                        {
                            currentResource ?
                            <Image src={currentResource.img} alt="placeholder-img" fill className="object-cover" sizes="33vw" loading="eager"></Image>
                            :
                            null
                        }
                    </div>
                    <div id="equipment-details-section" className="mt-8 mb-16 w-full max-h-screen pl-[6.25%] font-bold">
                        <h1>Equipment Included:</h1>
                        <div className="pl-4">
                            <ul className="m-2 font-normal list-disc">
                                {
                                    currentResource && currentResource.equipments.length > 0 ?
                                        currentResource.equipments.map((equipment, index) => {
                                            return <li key={index}>{equipment[0]} ({equipment[1]} available)</li>
                                        })
                                    :
                                    <p>No Equipments</p>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            }
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