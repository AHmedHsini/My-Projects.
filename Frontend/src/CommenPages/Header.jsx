import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FaShoppingCart } from 'react-icons/fa';  // Import FaShoppingCart from react-icons

function Header({ cartCount }) {
  const { user, setUser } = useAuth();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Function to generate user initials
  const getUserInitials = (firstName, lastName) => {
    return `${firstName.charAt(0).toUpperCase()}${lastName
      .charAt(0)
      .toUpperCase()}`;
  };

  const showUserMenu = () => {
    clearTimeout(userMenuRef.current);
    setDropdownVisible(true);
  };

  const hideUserMenu = () => {
    userMenuRef.current = setTimeout(() => {
      setDropdownVisible(false);
    }, 200);
  };

  return (
    <header
      className="bg-white shadow p-4 fixed top-0 left-0 right-0 z-50 w-full"
      style={{
        fontFamily: "Arial, sans-serif",
        borderRadius: "40px" // Adjust the value to control the roundness of the edges
      }}
    >
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="../../assets/images/logo.png"
            alt="Logo"
            style={{ width: "40%", height: "auto" }} // Adjust the width to scale with the window
          />
          <h1 className="text-xl font-semibold text-gray-800">3alemni</h1>
        </div>

        <input
          type="text"
          placeholder="Search for anything"
          className="flex-1 mx-4 py-2 px-4 border border-gray-300 rounded-full"
          style={{ borderRadius: "20px" }}
        />

        <nav>
          <ul className="flex space-x-4 items-center">
          <li>
              {/* Cart icon with count */}
              <div className="relative flex items-center">
                <FaShoppingCart size={24} className="text-gray-800" />
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs absolute top-0 right-0">
                  {cartCount}
                </span>
              </div>
            </li>
            {user ? (
              <div className="relative">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-8 h-8 rounded-full cursor-pointer"
                    onMouseOver={showUserMenu}
                    onMouseOut={hideUserMenu}
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold cursor-pointer"
                    onMouseOver={showUserMenu}
                    onMouseOut={hideUserMenu}
                  >
                    {getUserInitials(user.firstName, user.lastName)}
                  </div>
                )}
                {isDropdownVisible && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md"
                    onMouseOver={showUserMenu}
                    onMouseOut={hideUserMenu}
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    <div
                      className="px-4 py-3 border-b"
                      style={{ overflow: "hidden" }}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                          {getUserInitials(user.firstName, user.lastName)}
                        </div>
                        <div className="ml-2" style={{ flex: 1, minWidth: 0 }}>
                          <div
                            className="font-semibold"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {user.firstName} {user.lastName}
                          </div>
                          <div
                            className="text-sm text-gray-500"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={user.email}
                          >
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu options */}
                    <ul className="py-1">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        My learning
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        My cart
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Wishlist
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Account settings
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Payment methods
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Subscriptions
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Udemy credits
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Purchase history
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Public profile
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Edit profile
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Help
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Log out
                      </li>
                    </ul>

                    {/* Language setting at the bottom */}
                    <div className="px-4 py-2 flex items-center border-t hover:bg-gray-100 cursor-pointer">
                      <span className="mr-2">🌐</span>
                      <span>English</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <li>
                  <a
                    href="/login"
                    className="text-gray-700 hover:text-indigo-500"
                  >
                    Log in
                  </a>
                </li>
                <li>
                  <a
                    href="/register"
                    className="text-gray-700 hover:text-indigo-500"
                  >
                    Sign Up
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
