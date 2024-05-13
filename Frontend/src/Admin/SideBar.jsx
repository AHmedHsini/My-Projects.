import React from "react";
import { Link, useLocation } from "react-router-dom"; // Assuming you're using React Router for navigation

const sidebarStyles = {
  width: "250px",
  backgroundColor: "#0047ab", // Heavy blue color
  padding: "20px",
  color: "#fff", // Text color
};

const titleStyles = {
  marginBottom: "20px",
  textAlign: "center",
};

const linkStyles = {
  textDecoration: "none",
  color: "#fff", // Text color
  display: "block",
  padding: "10px 16px",
  borderRadius: "4px",
};

const hoverStyles = {
  backgroundColor: "#003080", // Darker blue color on hover
};

const activeStyles = {
  backgroundColor: "#003080", // Darker blue color for selected item
};

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar" style={sidebarStyles}>
      <h2 className="sidebar-title" style={titleStyles}>
        Admin Sidebar
      </h2>
      <ul
        className="sidebar-menu"
        style={{ listStyleType: "none", padding: 0 }}
      >
        <li className="sidebar-menu-item">
          <Link
            to="/admin/"
            className="sidebar-link"
            style={{
              ...linkStyles,
              ...(location.pathname === "/admin/" && activeStyles),
            }}
          >
            Dashboard
          </Link>
        </li>
        <li className="sidebar-menu-item">
          <Link
            to="/admin/educators"
            className="sidebar-link"
            style={{
              ...linkStyles,
              ...(location.pathname === "/admin/educators" && activeStyles),
            }}
          >
            Educators
          </Link>
        </li>
        <li className="sidebar-menu-item">
          <Link
            to="/admin/students"
            className="sidebar-link"
            style={{
              ...linkStyles,
              ...(location.pathname === "/admin/students" && activeStyles),
            }}
          >
            Students
          </Link>
        </li>
        <li className="sidebar-menu-item">
          <Link
            to="/admin/products"
            className="sidebar-link"
            style={{
              ...linkStyles,
              ...(location.pathname === "/admin/products" && activeStyles),
            }}
          >
            Products
          </Link>
        </li>
        {/* Logout Link */}
        <li className="sidebar-menu-item">
          <Link to="/login" className="sidebar-link" style={linkStyles}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
