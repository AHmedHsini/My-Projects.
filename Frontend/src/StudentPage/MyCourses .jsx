import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../CommenPages/headerComponents/Header";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom";

function MyCourses() {
    const { user } = useAuth(); // Use the useAuth hook to get the user
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            axios.get(`/api/Courses/my-courses?userId=${user.id}`)
                .then(response => {
                    setCourses(response.data);
                })
                .catch(error => {
                    console.error("There was an error fetching the courses!", error);
                });
        }
    }, [user]);

    const handleCourseClick = (courseId) => {
        navigate(`/coursedetails/${courseId}`);
    };

    return (
        <div>
            <Header />
            <section
                style={{
                    backgroundImage: 'url("../assets/images/banner.png")',
                    width: "100%",
                    height: "800px", // Keep the height of the banner
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginTop: "3%",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start", // Align items to the start
                }}
            >
                <div className="container p-8 rounded-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.75)", maxHeight: "580px", overflowY: "scroll", textAlign: "center", marginTop: "7%" }}>
                    <h1 className="text-3xl font-semibold mb-6 text-gray-800">
                        My Courses
                    </h1>
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" style={{ gridAutoRows: "270px" }}>
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="p-4 border rounded-lg shadow-lg hover:bg-indigo-100 transition transform hover:scale-105"
                                    onClick={() => handleCourseClick(course.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {course.courseImage && (
                                        <img
                                            src={course.courseImage}
                                            alt={course.title}
                                            className="w-full h-32 object-cover rounded-lg mb-3"
                                        />
                                    )}
                                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                                        {course.title}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1" style={{ lineHeight: '1.5' }}>
                                        {course.description.split(' ').slice(0, 20).join(' ')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">You haven't purchased any courses yet.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default MyCourses;