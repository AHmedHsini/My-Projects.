import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSun, FaMoon, FaChalkboardTeacher } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkMode';
import axios from 'axios';

function NavBar() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useDarkMode(); // Use the dark mode context
    const [showDropdown, setShowDropdown] = useState(false);

    // Handle user logout
    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        navigate('/login');
        setShowDropdown(false);
    };

    // Handle navigating to the educator's page
    const handleDashboardClick = () => {
        navigate('/educator');
    };

    // Define colors based on theme
    const borderColor = isDarkMode ? 'border-gray-700' : 'border-blue-300';
    const navbarBgColor = isDarkMode ? 'bg-[#0D1B2A]' : 'bg-[#F0F0F0]';
    const textColor = isDarkMode ? 'text-gray-300' : 'text-blue-600';
    const hoverTextColor = isDarkMode ? 'hover:text-[#14FFEC]' : 'hover:text-[#FF6B6B]';
    const hoverBgColor = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

    return (
        <nav className={`p-4 shadow-lg ${navbarBgColor}`}>
            <div className="container mx-auto flex justify-between items-center">
                {/* App title or logo */}
                <div className={`text-2xl font-bold ${textColor}`}>MyApp</div>

                {/* Buttons and dropdown */}
                <div className="flex items-center space-x-4">
                    {/* Add the My Dashboard button */}
                    {user && user.role === 'Educator' && (
                        <button
                            onClick={handleDashboardClick}
                            className={`text-sm font-semibold ${textColor} ${hoverTextColor} ${hoverBgColor} transition px-2 py-1 rounded`}
                        >
                            <FaChalkboardTeacher className="mr-1" /> My Dashboard
                        </button>
                    )}

                    {/* User profile dropdown */}
                    <div className="relative">
                        <button
                            className={`flex items-center text-sm font-semibold ${textColor} ${hoverTextColor} ${hoverBgColor} transition px-2 py-1 rounded`}
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <FaUserCircle className="mr-2" size={24} />
                            {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
                        </button>
                        {showDropdown && (
                            <div className={`absolute right-0 mt-2 py-2 w-48 ${navbarBgColor} rounded-md shadow-lg z-20`}>
                                <NavLink
                                    to="/profile"
                                    className={`block px-4 py-2 text-sm ${textColor} ${hoverBgColor}`}
                                >
                                    Profile
                                </NavLink>
                                <button
                                    onClick={logout}
                                    className={`block w-full text-left px-4 py-2 text-sm ${textColor} ${hoverBgColor}`}
                                >
                                    Logout
                                </button>
                                {/* Dark/Light mode toggle button */}
                                <button
                                    className={`block w-full text-left px-4 py-2 text-sm ${textColor} ${hoverBgColor}`}
                                    onClick={toggleDarkMode} // This should toggle dark mode
                                >
                                    {/* Display icon left of the writing */}
                                    {isDarkMode ? (
                                        <>
                                            <FaSun className="mr-2" />
                                            Light Mode
                                        </>
                                    ) : (
                                        <>
                                            <FaMoon className="mr-2" />
                                            Dark Mode
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
