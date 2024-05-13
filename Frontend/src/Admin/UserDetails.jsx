import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    axios
      .get(`/api/admin/userDetails/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userId]); // Ensure userId is included in the dependency array

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        {user.firstName} {user.lastName}
      </h1>
      <div
        style={{
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
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
        <p style={{ margin: "0" }}>ID: {user.id}</p>
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
        <p style={{ margin: "0" }}>
          <strong>Email:</strong> {user.email}
        </p>
        <p style={{ margin: "0" }}>
          <strong>Role:</strong> {user.role}
        </p>
        <p style={{ margin: "0" }}>
          <strong>Verified:</strong> {user.verified ? "Yes" : "No"}
        </p>
        <h3 style={{ margin: "10px 0" }}>Purchased Courses:</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {user.purchasedCourses.map((course, index) => (
            <div key={index}>
              <li style={{ marginBottom: "10px" }}>
                <strong>{course.title}</strong> - {course.category}
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDetails;
