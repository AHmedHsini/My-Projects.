import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./SideBar";
import { Link } from "react-router-dom";

function AdminPage() {
  const [studentCount, setStudentCount] = useState(0);
  const [educatorCount, setEducatorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get("/api/admin/studentCount");
        const educatorResponse = await axios.get("/api/admin/educatorCount");
        setStudentCount(studentResponse.data);
        setEducatorCount(educatorResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />

      <div className="flex-1 p-8">
        <div className="">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Admin {selectedItem}
          </h1>
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
            <div className="p-6 bg-yellow-500 text-white rounded-lg shadow-md transition duration-300 hover:bg-yellow-600">
              <h2 className="text-2xl font-bold mb-4">Reports</h2>
              <p className="text-lg">Generate reports</p>
            </div>
          </div>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : selectedItem === "Users" ? (
            <div>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                All Users
              </h2>
              <ul className="divide-y divide-gray-300">
                {/* Render list of users */}
              </ul>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No content available for {selectedItem}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
