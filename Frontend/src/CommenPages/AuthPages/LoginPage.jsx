import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Header'; // Import the Header component

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const { token, role } = response.data;

            // Store the token
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Fetch user data
            const userResponse = await axios.get('/api/auth/validate', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const userData = userResponse.data;
            setUser({
                id: userData.id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role,
                token,
            });

            // Navigate based on the user role
            if (role === 'Student') {
                navigate('/');
            } else if (role === 'Educator') {
                navigate('/educator');
            } else if (role === 'Admin') {
                navigate('/admin');
            } else {
                setErrorMessage('Unexpected user role. Please contact support.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response && error.response.status === 401) {
                setErrorMessage('Account not activated. Please verify your email to activate your account.');
            } else {
                setErrorMessage(error.response?.data.message || 'An error occurred during login.');
            }
        }
    };

    const handleRegister = () => {
        // Navigate to the registration page
        navigate('/register');
    };

    const handleForgotPassword = async () => {
        // Check if the email field is empty
        if (!email) {
            // Display an error message to the user
            setErrorMessage('Please enter your email address.');
            return; // Exit the function early
        }
    
        try {
            // Send a POST request to the backend with the user's email
            await axios.post('/api/password-reset/request', { email });
    
            // Display a success message to the user
            setErrorMessage('An email with instructions to reset your password has been sent to your email address.');
        } catch (error) {
            console.error('Forgot password request failed:', error);
            // Handle error response
            setErrorMessage(error.response?.data || 'An error occurred while processing your request.');
        }
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
                    <h1 className="text-3xl font-semibold text-center mb-2 text-gray-900">Login</h1>
                    <p className="text-sm text-gray-600 mb-6 text-center">Log in to your 3alemni account</p>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                            />
                        </div>
                        {errorMessage && (
                            <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
                        )}
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Log In
                        </button>
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">Make your 3alemni Account now!
                            <button
                                type="button"
                                onClick={handleRegister}
                                className="text-blue-600 hover:underline focus:outline-none"
                            >
                                Register
                            </button>
                            </p>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-blue-600 hover:underline focus:outline-none" >
                                Forgot Password?
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
