import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentPage() {
    const [purchasedCourses, setPurchasedCourses] = useState([]); // Initialize as an empty array

    useEffect(() => {
        // Fetch purchased courses from the backend
        const fetchPurchasedCourses = async () => {
            try {
                const response = await axios.get('/api/student/purchased-courses');
                setPurchasedCourses(response.data);
            } catch (error) {
                console.error('Failed to fetch purchased courses:', error);
                // Optionally, you can handle errors here, such as setting a fallback state or error message
                setPurchasedCourses([]); // Set to an empty array in case of error
            }
        };
        fetchPurchasedCourses();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 to-blue-500 p-8">
            <div className="w-full max-w-3xl p-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Purchased Courses</h1>
                {Array.isArray(purchasedCourses) && purchasedCourses.length > 0 ? (
                    <ul>
                        {purchasedCourses.map((course) => (
                            <li
                                key={course.id}
                                className="mb-4 p-4 border rounded-lg shadow hover:bg-blue-50 transition"
                            >
                                <h2 className="text-xl font-medium text-gray-700">{course.title}</h2>
                                <p className="text-sm text-gray-600 mt-2">{course.description}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500">No purchased courses available</p>
                )}
            </div>
        </div>
    );
}

export default StudentPage;
