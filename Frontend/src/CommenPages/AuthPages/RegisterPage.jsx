import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../headerComponents/Header";

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "Student", // Default role is Student
    educatorId: "", // Field for educator ID
  });

  const [passwordStrength, setPasswordStrength] = useState(0); // State to track password strength
  const [passwordsMatch, setPasswordsMatch] = useState(true); // State to track if passwords match
  const [registrationError, setRegistrationError] = useState(""); // State to track registration error
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      // Passwords don't match, don't proceed with registration
      return;
    }
    try {
      const response = await axios.post("/api/auth/register", formData);
      const { token } = response.data;

      // Store the JWT token in local storage
      localStorage.setItem("token", token);

      // Navigate to home page after successful registration
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        // Handle specific error messages from the backend
        if (
          error.response.data.error === "User with this email already exists"
        ) {
          setRegistrationError(
            "User with this email already exists. Please use a different email address."
          );
        } else {
          // Handle other errors
          console.error("Registration failed:", error);
          setRegistrationError("Registration failed. Please try again later.");
        }
      } else {
        // Handle generic errors
        console.error("Registration failed:", error);
        setRegistrationError("Registration failed. Please try again later.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Validate email format
    if (name === "email") {
      updatedValue = value.trim(); // Remove leading and trailing whitespaces
    }

    // Validate confirm password
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        // Passwords do not match
        setPasswordsMatch(false);
      } else {
        // Passwords match
        setPasswordsMatch(true);
      }
    }

    // Calculate password strength
    if (name === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  // Function to calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    // Add points based on password criteria
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*()_+{}\[\]:;<>,.?\/\\~-]/.test(password)) strength++;
    return strength;
  };

  return (
    <div>
    <Header />
    <div
      className="flex justify-center items-center"
      style={{
        backgroundImage: "url('../../../assets/images/middle.png')",
        width: "100%",
        height: "800px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        marginTop: "61px",
        position: "relative", // Needed for absolute positioning of inner images
      }}
    >
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl transform transition duration-500 ease-in-out hover:scale-105">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900">
          Register
        </h1>
        {/* Display registration error message */}
        {registrationError && (
          <div className="text-red-500 mb-4">{registrationError}</div>
        )}
        <form onSubmit={handleRegister}>
          {/* First Name */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="w-full p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="w-full p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {/* Password strength indicator */}
            {passwordStrength > 0 && (
              <div className="text-sm text-gray-500 mt-1">
                Password Strength: {passwordStrength}/5
                <div
                  className="h-1 bg-green-500 mt-1"
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="w-full p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            {/* Display error message if passwords don't match */}
            {!passwordsMatch && (
              <div className="text-sm text-red-500 mt-1">
                Passwords do not match
              </div>
            )}
          </div>

          {/* Role */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              className="w-full p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="Student">Student</option>
              <option value="Educator">Educator</option>
            </select>
          </div>

          {/* Educator ID (only shown if role is Educator) */}
          {formData.role === "Educator" && (
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="educatorId"
              >
                Educator ID
              </label>
              <input
                id="educatorId"
                name="educatorId"
                type="text"
                className="w-full p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Educator ID"
                value={formData.educatorId}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!passwordsMatch} // Disable the button if passwords don't match
            className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold transition duration-500 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  </div>
  );
}

export default RegisterPage;
