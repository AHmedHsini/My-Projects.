import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './SearchBar.css'; // Import the CSS file

function SearchBar() {
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading status
    const [searchResults, setSearchResults] = useState([]); // State to store search results
    const suggestionsRef = useRef(null); // Ref for the suggestions window
    const inputRef = useRef(null); // Ref for the input field

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Function to handle search when Enter key is pressed
    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            setLoading(true); // Set loading to true when search starts
            const searchParams = new URLSearchParams();
            searchParams.set('keyword', keyword);
            const queryString = searchParams.toString();
            // Navigate to search results page with updated query string
            window.location.href = `/search-results?${queryString}`;
        }
    };

    // Function to handle input change and show suggestions
    const handleChange = async (e) => {
        const { value } = e.target;
        setKeyword(value);
        if (value.trim() !== '') { // Perform search only if input value is not empty
            try {
                const response = await axios.get(`/api/Courses/search?keyword=${value}`);
                setSearchResults(response.data); // Update search results state
            } catch (error) {
                console.error('Error searching for courses:', error);
            }
        } else {
            setSearchResults([]); // Clear search results if input value is empty
        }
    };

    // Function to handle onBlur event and clear search results when input loses focus
    const handleBlur = () => {
        setSearchResults([]);
    };

    // Function to clear the search input
    const handleClear = () => {
        setKeyword('');
        setSearchResults([]);
    };

    // Function to handle suggestion click
    const handleSuggestionClick = (courseId) => {
        // Redirect to course details page
        window.location.href = `/coursedetails/${courseId}`;
    };

    // Function to handle mouse down event on suggestions window
    const handleSuggestionsMouseDown = (e) => {
        e.preventDefault(); // Prevent default behavior
    };

    return (
        <div className="search-bar-container">
            <div className="search-input-container">
                <input 
                    type="text" 
                    placeholder="Search for courses..." 
                    value={keyword} 
                    onChange={handleChange}
                    onBlur={handleBlur} // Clear search results when input loses focus
                    onKeyPress={handleKeyPress} // Trigger search on Enter key press
                    className="search-input"
                    ref={inputRef} // Reference the input field
                />
                {keyword && ( // Render clear button only when there's text in the input
                    <button 
                        onClick={handleClear}
                        className="clear-button"
                    >
                        X
                    </button>
                )}
            </div>
            {searchResults.length > 0 && (
                <div 
                    ref={suggestionsRef} // Assign ref to the suggestions window
                    className="suggestions-container"
                    onMouseDown={handleSuggestionsMouseDown} // Prevent closing suggestions window on mouse down
                >
                    {searchResults.map(course => (
                        <div 
                            key={course.id} 
                            className="suggestion-item"
                            onClick={() => handleSuggestionClick(course.id)} // Call handleSuggestionClick onClick
                        >
                            <img 
                                src={course.courseImage} 
                                alt={course.title} 
                                className="suggestion-item-image"
                            />
                            <div>
                                <h3>{course.title}</h3>
                                <p>Category: {course.category}</p>
                                <p className={course.price === 0 ? 'price-free' : 'price-paid'}>
                                    Price: {course.price === 0 ? 'Free' : `$${course.price}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
