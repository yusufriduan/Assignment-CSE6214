import StudentDashboard from "../components/StudentDashboard";
import Login from "../login/page";

export default function Dashboard() {
  const userRole = "student"; // This would typically come from your authentication logic
  
  if (userRole === "student") {
    return <StudentDashboard />;
  } else if (userRole === "staff") {
    return <div>Staff Dashboard (to be implemented)</div>;
  } else {
    return <Login />;
  }
}