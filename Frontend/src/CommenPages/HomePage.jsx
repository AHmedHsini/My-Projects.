import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

function UserPage() {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    // Fetch available courses from the backend when the component mounts
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("/api/Courses");
                setCourses(response.data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };
        fetchCourses();
    }, []);
    const handleCourseClick = (courseId) => {
        navigate(`/coursedetails/${courseId}`);
    };

    return (
        <div>
            <Header />
            {/* Section with banner image as background */}
            <section
                style={{
                    backgroundImage: 'url("../assets/images/banner.png")',
                    width: "100%",
                    height: "800px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginTop: "61px",
                    position: "relative", // Needed for absolute positioning of inner images
                }}
            >
                {/* Image of b1 */}
                <img
                    src="../assets/images/b1.png"
                    alt="Banner"
                    style={{
                        position: "absolute",
                        top: "50%",
                        right: "1%",
                        transform: "translateY(-50%)",
                        width: "30.95%", // Adjust the width to scale with the window
                        height: "52%", // Maintain aspect ratio
                        marginRight: "18%", // Adjust the margin for spacing
                    }}
                />
            </section>

            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                    Available Courses
                </h1>
                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md-grid-cols-3 lg:grid-cols-4 gap-4">
                        {courses.map((course) => (
                            
                            <div
                                key={course.id}
                                className="p-2 border rounded-lg shadow hover:bg-indigo-50 transition transform hover:scale-105"
                                onClick={() => handleCourseClick(course.id)} // Add onClick handler
                                style={{ cursor: "pointer" }} // Make the card clickable

                            >
                                {/* Display the course image if it exists */}
                                {course.courseImage && (
                                    <img
                                        src={course.courseImage}
                                        alt={course.title}
                                        className="w-full h-28 object-cover rounded-lg mb-2"
                                    />
                                )}

                                {/* Course title */}
                                <h2 className="text-lg font-medium text-gray-700">
                                    {course.title}
                                </h2>

                                {/* Course description */}
                                <p className="text-sm text-gray-600 mt-1">
                                    {course.description}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No courses available</p>
                )}
            </div>
        </div>
    );
}

export default UserPage;
