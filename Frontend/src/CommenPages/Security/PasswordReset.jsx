// PasswordReset.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PasswordReset() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);

    useEffect(() => {
        // Redirect to login page after 3 seconds when password reset is successful
        if (resetSuccess) {
            const redirectTimer = setTimeout(() => {
                window.location.href = '/login';
            }, 3000);

            return () => clearTimeout(redirectTimer);
        }
    }, [resetSuccess]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Passwords don't match.");
            return;
        }
        try {
            await axios.post(`/api/password-reset/reset?token=${token}`, { password });
            setResetSuccess(true);
        } catch (error) {
            console.error('Password reset failed:', error);
            setErrorMessage(error.response?.data || 'An error occurred while resetting your password.');
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
            <form onSubmit={handleResetPassword} className="max-w-sm mx-auto">
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
                </div>
                {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
                {resetSuccess && (
                    <div className="text-green-600 mb-4">
                        Password reset successful. Redirecting to <a href="/login">login page</a>...
                    </div>
                )}
                <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600">Reset Password</button>
            </form>
        </div>
    );
}

export default PasswordReset;
