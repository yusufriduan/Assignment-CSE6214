"use client";

import { ResourceUI } from "@/app/components/ResourceUI";
import { use } from "react";

interface ResourceDetailsPageProps{
    params: Promise<{id: string}>;
}

export default function ResourceDetailsPage({params}: ResourceDetailsPageProps){
    const { id } = use(params);

    return(
        <ResourceUI pageType="detail" resourceId={id}/>
    )
}