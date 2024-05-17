import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "./headerComponents/Header";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Import arrow icons

function UserPage() {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const courseContainerRef = useRef(null); // Ref for the course container

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

    const scrollLeft = () => {
        courseContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    };

    const scrollRight = () => {
        courseContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
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
                    marginTop: "1.75%",
                    position: "relative", // Needed for absolute positioning of inner images
                }}
            >
                {/* Image of b1 */}
                <img
                    src="../assets/images/b1.png"
                    alt="Banner"
                    style={{
                        position: "absolute",
                        top: "52%",
                        right: "15%",
                        transform: "translateY(-50%)",
                        width: "80%", // Adjust the width to scale with the window
                        height: "auto", // Allow the height to adjust according to width
                        maxWidth: "580px", // Limit the maximum width for smaller screens
                        marginRight: "5%", // Adjust the margin for spacing
                    }}
                />
            </section>

            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                    Available Courses
                </h1>
                {courses.length > 0 ? (
                    <div className="relative group">
                        <style>{`
                            .no-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                            .no-scrollbar {
                                -ms-overflow-style: none; /* IE and Edge */
                                scrollbar-width: none; /* Firefox */
                            }
                        `}</style>
                        <button
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={scrollLeft}
                        >
                            <FaArrowLeft />
                        </button>
                        <div
                            ref={courseContainerRef}
                            className="flex overflow-x-auto space-x-4 no-scrollbar"
                            style={{
                                height: '300px', // Keep the height of the container
                                paddingBottom: '16px', // Add padding to avoid content being cut off
                            }}
                        >
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="p-4 border rounded-lg shadow-lg hover:bg-indigo-100 transition transform hover:scale-105"
                                    onClick={() => handleCourseClick(course.id)} // Add onClick handler
                                    style={{ cursor: "pointer", width: "270px", flex: "0 0 auto" }} // Set specific width and make it scrollable
                                >
                                    {/* Display the course image if it exists */}
                                    {course.courseImage && (
                                        <img
                                            src={course.courseImage}
                                            alt={course.title}
                                            className="w-full h-32 object-cover rounded-lg mb-3"
                                        />
                                    )}

                                    {/* Course title */}
                                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                                        {course.title}
                                    </h2>

                                    {/* Course description */}
                                    <p className="text-sm text-gray-600 mt-1" style={{ lineHeight: '1.5' }}>
                                        {course.description.split(' ').slice(0, 20).join(' ')} {/* Displaying first 20 words */}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={scrollRight}
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No courses available</p>
                )}
            </div>
        </div>
    );
}

export default UserPage;
