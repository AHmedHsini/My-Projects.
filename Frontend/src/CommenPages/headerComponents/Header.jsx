import React, { useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SearchBar from "./SearchBar";
import LoginPopup from '../AuthPages/LoginPage'; // Import the LoginPopup component
import './Header.css';

function Header({ cartCount }) {
  const { user, setUser } = useAuth();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const [isLoginPopupVisible, setLoginPopupVisible] = useState(false); // State to manage login popup visibility

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
    navigate('/my-courses');
  };

  const handlePurchaseHistory = () => {
    navigate('/purchase-history');
  };

  const [isSearchVisible, setSearchVisible] = useState(false);

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
            <h1 className="logo-text" style={{ 
              fontSize: "28px", 
              color: "#333", 
              fontWeight: "bold",
              lineHeight: "1.4",
            }}>3alemni</h1>
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
                      <li className="user-menu-item" onClick={handleEditProfile}>Edit Profile</li>
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
                  <button className="login-link" onClick={() => setLoginPopupVisible(true)}>
                    Log in
                  </button>
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
      {isLoginPopupVisible && <LoginPopup onClose={() => setLoginPopupVisible(false)} />}
    </header>
  );
}

export default Header;
