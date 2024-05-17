import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

function EducatorNavBar({ isDarkMode, toggleTheme }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Function to log out the user
  const logout = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");

    // Remove the Authorization header
    delete axios.defaults.headers.common["Authorization"];

    // Set the user state to null
    setUser(null);

    // Navigate to the login page
    navigate("/login");
  };

  // Define colors based on theme
  const borderColor = isDarkMode ? "border-gray-700" : "border-blue-300";
  const sidebarBgColor = isDarkMode ? "bg-[#0D1B2A]" : "bg-[#F0F0F0]";
  const textColor = isDarkMode ? "text-[#CAD2C5]" : "text-[#333333]";
  const hoverTextColor = isDarkMode
    ? "hover:text-[#14FFEC]"
    : "hover:text-[#FF6B6B]";

  return (
    <nav
      className={`w-64 flex flex-col ${sidebarBgColor} border-r ${borderColor} border-solid sticky top-0 h-screen overflow-y-auto`}
    >
      {/* App name */}
      <div className={`text-2xl font-bold text-center py-4 ${textColor}`}>
        <a href="/" className="flex items-center">
          {" "}
          {/* Make the logo and text clickable */}
          <img
            src="../../assets/images/logo.png"
            alt="Logo"
            style={{ width: "40%", height: "auto" }} // Adjust the width to scale with the window
          />
          <h1 className={`text-xl font-semibold text-gray-800${textColor}`}>
            3alemni
          </h1>
        </a>
      </div>

      {/* Navigation links */}
      <ul className="flex flex-col space-y-4 px-4">
        {/* Display the user's name as a NavLink */}
        <li>
          <NavLink to="/profile" className={`${textColor} ${hoverTextColor}`}>
            {user ? `${user.firstName} ${user.lastName}` : "Guest"}
          </NavLink>
        </li>

        {/* Add logout button */}
        <li>
          <button onClick={logout} className={`${textColor} ${hoverTextColor}`}>
            Logout
          </button>
        </li>
      </ul>

      {/* Dark mode toggle button at the bottom */}
      <div className="mt-auto flex justify-center pb-4">
        <button
          onClick={() => {
            toggleTheme(); // Call the toggleTheme function
            window.location.reload(); // Reload the page to apply the new theme
          }}
        >
          {isDarkMode ? (
            <FaSun className="text-[#14FFEC]" />
          ) : (
            <FaMoon className="text-[#FF6B6B]" />
          )}
        </button>
      </div>
    </nav>
  );
}

export default EducatorNavBar;
