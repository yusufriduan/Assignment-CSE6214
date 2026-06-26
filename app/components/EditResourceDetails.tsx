"use client"

import BackButton from "@/app/components/BackButton";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import NavBar, {NavItem} from "@/app/components/NavBar";
import { MdHome, MdPerson } from "react-icons/md";
import { FaCalendarPlus } from "react-icons/fa";
import { redirect } from "next/navigation";
import { EquipmentCounter } from "./EquipmentCounter";
import Input from "./input";
import { Resource, addResource, modifyResource, fetchResource } from "../actions/ResourceController";
import { createClient } from "../utils/supabase/client";

interface ResourceDetailsProp{
    resourceId?: string;
    department?: string;
}

export function EditResourceDetails({resourceId, department}: ResourceDetailsProp){
    const [activeSection, setActiveSection] = useState("booking");
    const [loading, setLoading] = useState<boolean>(true);
    const [roomName, setRoomName] = useState("");
    const [imageSource, setImageSource] = useState<string | null>(null)
    type ResourceTuple = [string, number];
    const [counts, setCounts] = useState<ResourceTuple[]>([]);

    // input stuff
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newImageFile, setNewImageFile] = useState<File>();

    const supabase = createClient()

    const handleContainerClick = () => {
        if(fileInputRef.current)
            fileInputRef.current.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        if(target && target.files){
            const file = target.files[0];
            if (file) {
                setNewImageFile(file);
                setImageSource(URL.createObjectURL(file));
            }
        }
    };
    
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
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const newName = formData.get("room-name");
        let equipmentArr: any = []
        counts.map(([name, count], index) => {
            if(count > 0){
                equipmentArr.push({
                    equipment_name: formData.get(`resource_name_${index}`)?.toString(),
                    equipment_count: Number(count)
                })
            }
        })

        let imageUrl: string | null = null;
        if(newImageFile){
            const fileExt = newImageFile.name.split('.').pop();
            const timestamp = Date.now();
            const filePath = `${timestamp}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('resource_image')
                .upload(filePath, newImageFile, {
                cacheControl: '3600',
                upsert: false
            });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('resource_image').getPublicUrl(filePath);
            imageUrl = data.publicUrl;
        }
        if(resourceId === undefined){
            const payload: Resource = {
                id: null,
                name: newName ? newName.toString() : "Unnamed Room",
                dept: department !== undefined ? department : "Unknown Department",
                img: imageUrl,
                status: "Available",
                equipments: equipmentArr
            }

            const res = await addResource(payload);
            if(res?.success){
                alert('Successfully added resource!');
                redirect('/manage_resource')
            } else {
                if(res.duplicateError){
                    alert('Resource with such name exists!');
                } else {
                    alert('Fail to add resource');
                }
            }
        } else {
            if(newName){
                const res = await modifyResource(resourceId, newName.toString(), imageUrl, equipmentArr);
                if(res.success){
                    alert('Successfully editted resource!');
                    redirect('/manage_resource')
                } else {
                    if(res.duplicateError){
                        alert('Resource with such name exists!');
                    } else {
                        alert('Fail to edit resource');
                    }
                }
            }
                
        }  
    }

    useEffect(() => {
        if(resourceId !== undefined){
            async function fetchOldInfo(resource_id: string){
                const res = await fetchResource(resource_id);
                if(res){
                    setRoomName(res.name);
                    setImageSource(res.img);
                    let temp: ResourceTuple[] = [];
                    res.equipments.map((equipment, index) => {
                        temp.push([equipment.equipment_name, equipment.equipment_count]);
                    })
                    setCounts(temp);
                }
            }

            fetchOldInfo(resourceId);
        }
        setLoading(false);
    }, [])

    return(
        loading ?
        <div className="bg-background max-w-screen min-h-screen m-0 p-0 box-border flex flex-col justify-center items-center overflow-x-hidden">
            <p>Loading...</p>
        </div>
        :
        <div className="bg-background max-w-screen min-h-screen m-0 p-0 box-border flex flex-col overflow-x-hidden">
            <BackButton buttonName="Back" buttonDesc={roomName === "" ? "Adding Resource" : `Editing ${roomName}`}></BackButton>
            
            <div className="flex flex-col justify-center items-center">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden" 
                />
                <div onClick={handleContainerClick} id="resource-img-container" className="group flex flex-col justify-center items-center relative w-7/8 h-72 rounded-2xl bg-gray-400 overflow-hidden cursor-pointer">
                    <div className={`absolute inset-0 w-full h-full bg-gray-500/50 z-10 justify-center items-center ${imageSource === null ? "flex" : "hidden"} group-hover:flex`}>
                        <p className="text-xl font-mono font-bold text-shadow-2xs text-shadow-white">{imageSource === null ? "+ Add Image" : "+ Edit Image"}</p>
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
            <form className="w-full" onSubmit={handleSubmit}>
                <div className="w-full flex flex-col relative p-8 justify-start">
                    <h1>Room Name:</h1>
                    <input name="room-name" defaultValue={roomName} placeholder="Add resource name" className="w-11/12 h-8 bg-accent rounded-full p-2" required></input>
                </div>
                <div id="equipment-details-section" className="mb-16 w-full max-h-screen font-bold">
                    <div className="relative flex flex-row items-center mb-8 ml-[6.25%]">
                        <h1>Equipment Included:</h1>
                        <button type="button" onClick={
                            () => setCounts((prev) => {
                                return [...prev, ["", 1]];
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
                                <div key={index} className="relative flex flex-row items-center mb-8">
                                    <Input 
                                    label="" 
                                    type="text" 
                                    name={`resource_name_${index}`} 
                                    className="text-md font-medium ml-[6.25%] w-[50%] border-2 rounded-full" 
                                    placeholder="Enter Resource Name" 
                                    defaultValue={name}
                                    required
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