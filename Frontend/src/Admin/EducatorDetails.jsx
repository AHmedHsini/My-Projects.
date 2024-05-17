import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from "axios";
import Sidebar from './SideBar';

const EducatorDetails = () => {
  const [user, setUser] = useState(null);
  const [uploadedCourses, setUploadedCourses] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    axios
      .get(`/api/admin/userDetails/${userId}`)
      .then((response) => {
        console.log("User details response:", response.data);
        setUser(response.data);
        if (response.data.role === "Educator") {
          fetchUploadedCourses(response.data.id);
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userId]); 

  const fetchUploadedCourses = (educatorId) => {
    axios
      .get(`/api/Courses/educator/${educatorId}`)
      .then((response) => {
        console.log("Uploaded courses response:", response.data);
        setUploadedCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching uploaded courses:", error);
      });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

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
          <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Uploaded Courses</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {uploadedCourses.length > 0 ? (
              uploadedCourses.map((course, index) => (
                <li key={index} style={{ marginBottom: "10px", textAlign: "center" }}>
                  <strong>{course.title}</strong> - {course.category}
                </li>
              ))
            ) : (
              <p style={{ textAlign: "center" }}>No uploaded courses found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EducatorDetails;
