"use client";

import { ResourceUI } from "@/app/components/ResourceUI";
import { use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface EditResourceDetailsPageProps{
    params: Promise<{id: string}>;
}

export default function EditResourceDetailsPage({params}: EditResourceDetailsPageProps){
    const router = useRouter();
    const { id } = use(params);
    const { data: session, status } = useSession();
    const userRole = session?.user?.role?.toLowerCase() || null;
    const isResourceManager = userRole === "resource manager";

    if(status === "loading"){
        return <div className="w-72 h-16 bg-secondary/50 rounded-xl animate-pulse mt-1 mb-1" />;
    }

    if(!isResourceManager){
        router.push('/');
    }

    return(
        <ResourceUI pageType="edit" resourceId={id}/>
    )
}