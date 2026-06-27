import { auth } from "@/auth";
import Student from "../components/Dashboard/StudentDashboard";
import ResourceManager from "../components/Dashboard/ResourceManagerDashboard";

interface PageProps {
  searchParams: Promise<{ default_sect?: string }>;
}

export default async function Dashboard({ searchParams }: PageProps) {

  const session = await auth();
  if (!session) {
    return <div className="p-10 text-center text-red-500 font-bold">Unauthorized: Please log in to access the dashboard.</div>;
  }

  const userRole = session.user?.role?.toLowerCase() || null;
  const resolvedSearchParams = await searchParams;
  const default_sect = resolvedSearchParams.default_sect || null;

  if (userRole === "student") {
    return <Student default_sect={default_sect} />;
    
  } else if (userRole === "campus staff" || userRole === "staff") {
    return <div>Staff Dashboard (to be implemented)</div>;
    
  } else if (userRole === "resourcemanager") {
    return <ResourceManager default_sect={default_sect} />;
    
  } else {
    return <div className="p-10 text-center text-red-500 font-bold">Unauthorized Role</div>;
  }
}