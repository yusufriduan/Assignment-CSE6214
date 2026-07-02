
import { ResourceUI } from "@/app/components/ResourceUI";
import { auth } from "@/auth";
import { use } from "react";

interface ResourceDetailsPageProps{
    params: Promise<{id: string}>;
}

export default async function ResourceDetailsPage({params}: ResourceDetailsPageProps){
    const { id } = await params;
    const session = await auth();
    const userRole = session?.user?.role?.toLowerCase() as "student" | "campus staff" | "resource manager" | undefined;

    return(
        <ResourceUI pageType="detail" resourceId={id} userRole={userRole}/>
    )
}