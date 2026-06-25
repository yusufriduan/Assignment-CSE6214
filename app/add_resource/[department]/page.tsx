"use client"

import { ResourceUI } from "../../components/ResourceUI";
import { use } from "react";

interface ResourceDetailsPageProps{
    params: Promise<{department: string}>;
}

export default function AddResource({params}: ResourceDetailsPageProps){
    const { department } = use(params);
    return(
        <ResourceUI pageType="add" department={department} />
    )
}