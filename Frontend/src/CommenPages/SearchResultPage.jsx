import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './SearchResultPage.css'; // Import the CSS file
import Header from "./headerComponents/Header";


function SearchResultPage() {
    const [searchResults, setSearchResults] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword');
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        axios.get(`/api/Courses/search?keyword=${keyword}`)
            .then(response => {
                setSearchResults(response.data);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });
    }, [keyword]);

    const handleCourseClick = (courseId) => {
        navigate(`/coursedetails/${courseId}`); // Navigate to course details page
    };

    return (
        <div>
            <Header />
            {/* Section with banner image as background */}
            <section className="search-result-banner">
                <div className="search-result-container">
                    <h1 className="search-result-title">
                        Search Results for: {keyword}
                    </h1>
                    {searchResults.length > 0 ? (
                        <div className="search-result-grid">
                            {searchResults.map((course) => (
                                <div
                                    key={course.id}
                                    className="search-result-card"
                                    onClick={() => handleCourseClick(course.id)} // Add onClick handler
                                >
                                    {/* Display the course image if it exists */}
                                    {course.courseImage && (
                                        <img
                                            src={course.courseImage}
                                            alt={course.title}
                                        />
                                    )}

                                    {/* Course title */}
                                    <h2>{course.title}</h2>

                                    {/* Course description */}
                                    <p>{course.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-courses">No courses available</p>
                    )}
                </div>
            </section>     
        </div>
    );
}

export default SearchResultPage;
