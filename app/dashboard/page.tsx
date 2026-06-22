import StudentDashboard from "../components/Dashboard/StudentDashboard";
import Login from "../login/page";
interface PageProps {
  searchParams: Promise<{ default_sect?: string }>;
}

export default async function Dashboard({ searchParams }: PageProps) {
  const userRole = "student"; // This would typically come from your authentication logic
  const resolvedSearchParams = await searchParams;
  const default_sect = resolvedSearchParams.default_sect || null;
  if (userRole === "student") {
    return <StudentDashboard default_sect={default_sect} />;
  } else if (userRole === "staff") {
    return <div>Staff Dashboard (to be implemented)</div>;
  } else {
    return <Login />;
  }
}