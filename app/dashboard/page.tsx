<<<<<<< Updated upstream
import { BookingListUI } from "../components/BookingListUI";
import StudentDashboard from "../components/Dashboard/StudentDashboard";
=======
import { auth } from "@/auth";
import Student from "../components/Dashboard/StudentDashboard";
import ResourceManager from "../components/Dashboard/ResourceManagerDashboard";
import Staff from "../components/Dashboard/StaffDashboard";
>>>>>>> Stashed changes

interface PageProps {
  searchParams: Promise<{ default_sect?: string }>;
}

export default async function Dashboard({ searchParams }: PageProps) {

  const resolvedSearchParams = await searchParams;
  const default_sect = resolvedSearchParams.default_sect || null;

  const userRole = 'resourcemanager';

  if (userRole === "student") {
<<<<<<< Updated upstream
    return <StudentDashboard default_sect={default_sect} />;
    
  } else if (userRole === "campus staff" || userRole === "staff") {
    return <div>Staff Dashboard (to be implemented)</div>;
    
  } else if (userRole === "resourcemanager") {
    return <BookingListUI pageType="list"/>;
    
=======
    return <Student default_sect={default_sect} />;
  } else if (userRole === "campus staff" || userRole === "staff") {
    return <Staff default_sect={default_sect} />;
  } else if (userRole === "resource manager") {
    return <ResourceManager default_sect={default_sect} />;
>>>>>>> Stashed changes
  } else {
    return <div className="p-10 text-center text-red-500 font-bold">Unauthorized Role</div>;
  }
}