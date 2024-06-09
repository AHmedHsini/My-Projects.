import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./SideBar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function AdminPage() {
  const { user, isLoading } = useAuth();
  const [studentCount, setStudentCount] = useState(0);
  const [educatorCount, setEducatorCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || isLoading) return;

    if (user.role !== "Admin") {
      navigate("/"); // Redirect to home or another appropriate page
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const [
          studentResponse,
          educatorResponse,
          reportResponse,
          visitResponse,
          registrationResponse,
        ] = await Promise.all([
          axios.get("/api/admin/studentCount", { headers }),
          axios.get("/api/admin/educatorCount", { headers }),
          axios.get("/api/reports/count", { headers }),
          axios.get("/api/activity/count/visits", { headers }),
          axios.get("/api/activity/count/registrations", { headers }),
        ]);

        setStudentCount(studentResponse.data);
        setEducatorCount(educatorResponse.data);
        setReportCount(reportResponse.data);
        setVisitCount(visitResponse.data);
        setRegistrationCount(registrationResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "Admin") {
    return <div>Unauthorized access. Redirecting...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      <div className="flex-1 p-8">
        <div className="">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Admin {selectedItem}
          </h1>
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Link
                  to="/admin/students"
                  className="p-6 bg-blue-500 text-white rounded-lg shadow-md transition duration-300 hover:bg-blue-600"
                >
                  <h2 className="text-2xl font-bold mb-4">Students</h2>
                  <p className="text-lg">{studentCount} students</p>
                </Link>
                <Link
                  to="/admin/educators"
                  className="p-6 bg-green-500 text-white rounded-lg shadow-md transition duration-300 hover:bg-green-600"
                >
                  <h2 className="text-2xl font-bold mb-4">Educators</h2>
                  <p className="text-lg">{educatorCount} educators</p>
                </Link>
                <Link
                  to="/admin/reports"
                  className="p-6 bg-yellow-500 text-white rounded-lg shadow-md transition duration-300 hover:bg-yellow-600"
                >
                  <h2 className="text-2xl font-bold mb-4">Reports</h2>
                  <p className="text-lg">{reportCount} reports</p>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="p-6 bg-indigo-500 text-white rounded-lg shadow-md transition duration-300 hover:bg-indigo-600">
                  <h2 className="text-2xl font-bold mb-4">Visits</h2>
                  <p className="text-lg">{visitCount} visits</p>
                </div>
                <div className="p-6 bg-red-500 text-white rounded-lg shadow-md transition duration-300 hover:bg-red-600">
                  <h2 className="text-2xl font-bold mb-4">Registrations</h2>
                  <p className="text-lg">{registrationCount} registrations</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
