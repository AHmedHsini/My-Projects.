import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useDarkMode } from "../../contexts/DarkMode"; // Use the dark mode context

function EducatorNavBar({ isDarkMode, toggleTheme }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };
  
  // Function to log out the user
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/");
  };

  // Define colors based on theme
  const borderColor = isDarkMode ? "border-gray-700" : "border-blue-300";
  const sidebarBgColor = isDarkMode ? "bg-[#0D1B2A]" : "bg-[#F0F0F0]";
  const textColor = isDarkMode ? "text-[#CAD2C5]" : "text-[#333333]";
  const hoverTextColor = isDarkMode ? "hover:text-[#14FFEC]" : "hover:text-[#FF6B6B]";

  return (
    <nav className={`w-64 flex flex-col ${sidebarBgColor} border-r ${borderColor} border-solid sticky top-0 h-screen overflow-y-auto`}>
      <div className={`text-2xl font-bold text-center py-4 ${textColor}`}>
        <a href="/" className="flex flex-col items-center">
          <img src="../../assets/images/logo.png" alt="Logo" style={{ width: "40%", height: "auto" }} />
          <h1 className={`text-xl font-semibold ${textColor}`}>3alemni</h1>
        </a>
        <hr className={`w-full mt-2 ${borderColor}`} />
      </div>
      <ul className="flex flex-col space-y-4 px-4">
        <li>
          <NavLink to="/profile" className={`${textColor} ${hoverTextColor}`}>
            {user ? `${user.firstName} ${user.lastName}` : "Guest"}
          </NavLink>
        </li>
        <li>
          <button onClick={handleEditProfile} className={`${textColor} ${hoverTextColor}`}>Edit Profile</button>
        </li>
        <li>
          <button onClick={logout} className={`${textColor} ${hoverTextColor}`}>Logout</button>
        </li>
      </ul>
      <div className="mt-auto flex justify-center pb-4">
        <button onClick={toggleTheme}>
          {isDarkMode ? <FaSun className="text-[#14FFEC]" /> : <FaMoon className="text-[#FF6B6B]" />}
        </button>
      </div>
    </nav>
  );
}

export default EducatorNavBar;
