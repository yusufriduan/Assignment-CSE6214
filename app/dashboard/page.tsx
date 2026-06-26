import { BookingListUI } from "../components/BookingListUI";
import StudentDashboard from "../components/Dashboard/StudentDashboard";

interface PageProps {
  searchParams: Promise<{ default_sect?: string }>;
}

export default async function Dashboard({ searchParams }: PageProps) {

  const resolvedSearchParams = await searchParams;
  const default_sect = resolvedSearchParams.default_sect || null;

  const userRole = 'student';

  if (userRole === "student") {
    return <StudentDashboard default_sect={default_sect} />;
    
  } else if (userRole === "campus staff" || userRole === "staff") {
    return <div>Staff Dashboard (to be implemented)</div>;
    
  } else if (userRole === "resourcemanager") {
    return <BookingListUI pageType="list"/>;
    
  } else {
    return <div className="p-10 text-center text-red-500 font-bold">Unauthorized Role</div>;
  }
}