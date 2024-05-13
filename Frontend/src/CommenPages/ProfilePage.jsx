import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProfilePage() {
    const [userProfile, setUserProfile] = useState({});
    const [courseHistory, setCourseHistory] = useState([]);

    useEffect(() => {
        // Fetch user profile data from the backend
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/api/profile');
                setUserProfile(response.data);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        };

        // Fetch course history from the backend
        const fetchCourseHistory = async () => {
            try {
                const response = await axios.get('/api/profile/course-history');
                setCourseHistory(response.data);
                // Log courseHistory to verify data
                console.log('Course history:', response.data);
            } catch (error) {
                console.error('Failed to fetch course history:', error);
                // Set courseHistory to an empty array on error
                setCourseHistory([]);
            }
        };

        fetchUserProfile();
        fetchCourseHistory();
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-8">
            <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Profile Page</h1>
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">User Profile</h2>
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                        <p className="text-lg text-gray-800"><strong>Name:</strong> {userProfile.name}</p>
                        <p className="text-lg text-gray-800"><strong>Email:</strong> {userProfile.email}</p>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Course History</h2>
                    {Array.isArray(courseHistory) ? (
                        <ul className="space-y-4">
                            {courseHistory.map((course) => (
                                <li key={course.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                                    <h3 className="text-lg font-medium text-gray-800">{course.title}</h3>
                                    <p className="text-sm text-gray-600">{course.description}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500">No course history available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
