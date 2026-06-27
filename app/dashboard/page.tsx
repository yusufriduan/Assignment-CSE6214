import { BookingListUI } from "../components/BookingListUI";
import StudentDashboard from "../components/Dashboard/StudentDashboard";
import ResourceManagerDashboard from "../components/Dashboard/ResourceManagerDashboard";

interface PageProps {
  searchParams: Promise<{ default_sect?: string }>;
}

export default async function Dashboard({ searchParams }: PageProps) {

  const resolvedSearchParams = await searchParams;
  const default_sect = resolvedSearchParams.default_sect || null;

  const userRole = 'resourcemanager';

  if (userRole === "student") {
    return <StudentDashboard default_sect={default_sect} />;
    
  } else if (userRole === "campus staff" || userRole === "staff") {
    return <div>Staff Dashboard (to be implemented)</div>;
    
  } else if (userRole === "resourcemanager") {
    return <ResourceManagerDashboard default_sect={default_sect} />;
    
  } else {
    return <div className="p-10 text-center text-red-500 font-bold">Unauthorized Role</div>;
  }
}