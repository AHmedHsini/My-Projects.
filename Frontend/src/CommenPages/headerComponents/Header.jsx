import React, { useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SearchBar from "./SearchBar";
import './Header.css'; // Import the CSS file

function Header({ cartCount }) {
  const { user, setUser } = useAuth();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate('/');
  };

  const getUserInitials = (firstName, lastName) => {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
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

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleMyLearning = () => {
    navigate('/my-courses'); // Change the route to your desired route
  };

  const handlePurchaseHistory = () => {
    navigate('/purchase-history'); // Navigate to the Purchase History page
  };

  // State to manage the visibility of the search bar
  const [isSearchVisible, setSearchVisible] = useState(false);

  // Function to toggle the search bar visibility
  const toggleSearchBar = () => {
    setSearchVisible(!isSearchVisible);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <a href="/" className="flex items-center">
            <img
              src="../../assets/images/logo.png"
              alt="Logo"
              className="logo"
            />
            <h1 className="logo-text">3alemni</h1>
          </a>
        </div>
        <div className={`search-bar-container ${isSearchVisible ? 'search-bar-visible' : ''}`}>
          <SearchBar />
        </div>
        <div className="search-icon-container" onClick={toggleSearchBar}>
          <FaSearch className="search-icon" />
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li>
              <div className="cart-container">
                <FaShoppingCart className="cart-icon" />
                <span className="cart-count">{cartCount}</span>
              </div>
            </li>
            {user ? (
              <div className="relative">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="user-avatar"
                    onMouseOver={showUserMenu}
                    onMouseOut={hideUserMenu}
                  />
                ) : (
                  <div
                    className="user-initials"
                    onMouseOver={showUserMenu}
                    onMouseOut={hideUserMenu}
                  >
                    {getUserInitials(user.firstName, user.lastName)}
                  </div>
                )}
                {isDropdownVisible && (
                  <div
                    className="user-menu"
                    onMouseOver={showUserMenu}
                    onMouseOut={hideUserMenu}
                  >
                    <div className="user-menu-header">
                      <div className="user-info">
                        <div className="user-initials">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="menu-profile-picture"
                            />
                          ) : (
                            getUserInitials(user.firstName, user.lastName)
                          )}
                        </div>
                        <div className="user-details">
                          <div className="user-name">
                            {user.firstName} {user.lastName}
                          </div>
                          <div
                            className="user-email"
                            title={user.email}
                          >
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    <ul className="user-menu-list">
                      <li className="user-menu-item" onClick={handleMyLearning}>My learning</li>
                      <li className="user-menu-item">My cart</li>
                      <li className="user-menu-item" onClick={handlePurchaseHistory}>Purchase history</li>
                      <li className="user-menu-item" onClick={handleEditProfile}>Edit profile</li>
                    </ul>

                    <div className="logout-container" onClick={handleLogout}>
                      <li className="user-menu-item">Log out</li>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <li>
                  <a href="/login" className="login-link">
                    Log in
                  </a>
                </li>
                <li>
                  <a href="/register" className="signup-link">
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