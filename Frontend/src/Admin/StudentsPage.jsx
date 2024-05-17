import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./SideBar";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get("/api/admin/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-10 text-center">Students</h1>
        <div className="overflow-auto">
          <table className="w-full table-auto bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-300">
                <th className="px-4 py-3 text-center">First Name</th>
                <th className="px-4 py-3 text-center">Last Name</th>
                <th className="px-4 py-3 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="bg-gray-100 px-4 py-3 text-center">
                    {student.firstName}
                  </td>
                  <td className="bg-gray-100 px-4 py-3 text-center">
                    {student.lastName}
                  </td>
                  <td className="bg-gray-100 px-4 py-3 text-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      <Link to={`/StudentDetails/${student.id}`}>
                        View Details
                      </Link>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
