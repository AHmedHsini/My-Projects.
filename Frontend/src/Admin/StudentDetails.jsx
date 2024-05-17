import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "./SideBar";

const StudentDetails = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    axios
      .get(`/api/admin/userDetails/${userId}`)
      .then((response) => {
        console.log("User details response:", response.data); // Log the response data
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userId]); // Ensure userId is included in the dependency array

  if (!user) {
    return <div>Loading...</div>;
  }

  console.log("User object:", user); // Log the user object

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {user.firstName} {user.lastName}
          </h1>
          <img
            src={user.profilePicture}
            alt="Profile"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              marginBottom: "10px",
            }}
          />
          <p>ID: {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Verified:</strong> {user.verified ? "Yes" : "No"}</p>
        </div>
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            width: "100%",
          }}
        >
          {user.role === "Student" && user.purchasedCourses ? (
            <>
              <h3 style={{ margin: "10px 0", textAlign: "center" }}>Purchased Courses:</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {user.purchasedCourses.map((course, index) => (
                  <li key={index} style={{ marginBottom: "10px", textAlign: "center" }}>
                    <strong>{course.title}</strong> - {course.category}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p style={{ textAlign: "center" }}>No purchased courses found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
