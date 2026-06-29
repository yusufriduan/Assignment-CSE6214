import { auth } from "@/auth";
import Student from "../components/Dashboard/StudentDashboard";
import ResourceManager from "../components/Dashboard/ResourceManagerDashboard";
import StaffDashboard from "../components/Dashboard/StaffDashboard";
import AdminDashboard from "../components/Dashboard/AdminDashboard";

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
    return <StaffDashboard default_sect={default_sect} />;
    
  } else if (userRole === "resource manager") {
    return <ResourceManager />;
  
  } else if (userRole === "admin") {
    return <AdminDashboard default_sect={default_sect} />; 
    
  } else {
    return <div className="p-10 text-center text-red-500 font-bold">Unauthorized Role</div>;
  }
}