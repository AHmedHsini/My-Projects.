import React, { useState, useEffect } from 'react';
import EducatorNavBar from '../components/EducatorComponents/EducatorSideBar';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

function EducatorPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    
    // Load dark mode preference from local storage
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedPreference = localStorage.getItem('isDarkMode');
        return savedPreference !== null ? JSON.parse(savedPreference) : false;
    });

    // Fetch courses for the educator
    useEffect(() => {
        if (!user || !user.token) {
            return;
        }

        axios
            .get(`/api/Courses/educator/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                setCourses(response.data);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
                toast.error('Failed to fetch courses');
            });
    }, [user]);

    // Event Handlers
    const handleAddCourse = () => {
        navigate('/educator/add-course');
    };

    const handleModifyCourse = (courseId) => {
        navigate(`/educator/course/${courseId}`);
    };

    const handleRemoveCourse = async () => {
        if (!courseToDelete) return;

        try {
            await axios.delete(`/api/Courses/${courseToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                params: {
                    educator: user.id,
                },
            });

            toast.success('Course removed successfully');
            setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseToDelete.id));
        } catch (error) {
            console.error('Error removing course:', error);
            toast.error('Failed to remove course');
        } finally {
            setCourseToDelete(null);
            setShowConfirmDialog(false);
        }
    };

    const showConfirmDeletion = (course) => {
        setCourseToDelete(course);
        setShowConfirmDialog(true);
    };

    const hideConfirmDeletion = () => {
        setShowConfirmDialog(false);
        setCourseToDelete(null);
    };

    // Toggle theme and save preference to local storage
    const toggleTheme = () => {
        const newIsDarkMode = !isDarkMode;
        setIsDarkMode(newIsDarkMode);
        localStorage.setItem('isDarkMode', JSON.stringify(newIsDarkMode));
    };

    // Define colors based on theme
    const pageBgColor = isDarkMode ? 'bg-[#253237]' : 'bg-[#FAFAFA]';
    const textColor = isDarkMode ? 'text-[#CAD2C5]' : 'text-[#333333]';
    const hoverBgColor = isDarkMode ? 'hover:bg-[#1D2D37]' : 'hover:bg-[#F2F2F2]';
    const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
    const hoverTextColor = isDarkMode ? 'hover:text-[#14FFEC]' : 'hover:text-[#FF6B6B]';
    const actionIconColor = isDarkMode ? 'text-[#CAD2C5]' : 'text-[#333333]';
    const actionIconHoverColor = isDarkMode ? 'hover:text-red-500' : 'hover:text-red-600';

    // Formatter to display the course price in Tunisian Dinar (DT) and English locale
    const currencyFormatter = new Intl.NumberFormat('fr-TN', {
        style: 'currency',
        currency: 'TND',
        minimumFractionDigits: 2,
    });

    return (
        <div className={`flex ${pageBgColor} min-h-screen`}>
            {/* Include EducatorNavBar and pass dark mode props */}
            <EducatorNavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            {/* Main content area */}
            <div className={`flex-grow p-8 ${textColor} w-full max-w-6xl mx-auto p-8 ${isDarkMode ? 'bg-[#253237]' : 'bg-[#FAFAFA]'} rounded-lg`}>
                {/* Sticky header with background color */}
                <div className={`flex justify-between items-center mb-8 sticky top-0 z-10 p-4 rounded-lg ${isDarkMode ? 'bg-[#1A2D34]' : 'bg-[#E0E0E0]'}`}>
                    <h1 className="text-4xl font-bold">{'Your Added Courses'}</h1>
                    <button
                        onClick={handleAddCourse}
                        className={`px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center justify-center`}
                    >
                        <FaPlus className="mr-2" /> Add Course
                    </button>
                </div>

                {/* Scrollable area for courses */}
                {courses.length > 0 ? (
                    <ul className="space-y-4">
                        {courses.map((course) => (
                            <button
                                key={course.id}
                                className={`w-full p-4 border rounded-lg transition-transform relative flex items-center hover:shadow-lg hover:scale-102 hover:translate-y-2 m-4 ${hoverBgColor} ${borderColor} ${textColor} hover:bg-${hoverBgColor}`}
                                onClick={() => handleModifyCourse(course.id)}
                                style={{ textAlign: 'left' }}
                            >
                                {/* Left section: Course image */}
                                {course.courseImage && (
                                    <img
                                        src={course.courseImage}
                                        alt={course.title}
                                        className="w-32 h-32 object-cover rounded-lg mr-4"
                                    />
                                )}

                                {/* Middle section: Course details */}
                                <div className="flex-grow flex flex-col justify-center">
                                    <h3 className="text-lg font-medium mb-2">{course.title}</h3>
                                    <p className={`text-sm mb-2`}>
                                        {course.description}
                                    </p>
                                    {/* Displaying the course price formatted in DT */}
                                    <p className={`text-sm mb-4`}>
                                        Price: {currencyFormatter.format(course.price)}
                                    </p>
                                </div>

                                {/* Right section: Action icon */}
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showConfirmDeletion(course);
                                    }}
                                    className="absolute top-4 right-4"
                                >
                                    <FaTrash
                                        className={`${actionIconColor} ${actionIconHoverColor}`}
                                        title="Delete"
                                    />
                                </div>
                            </button>
                        ))}
                    </ul>
                ) : (
                    <p
                        className={`${isDarkMode ? 'text-center text-[#CAD2C5]' : 'text-center text-[#333333]'}`}
                    >
                        No courses available
                    </p>
                )}
            </div>

            {/* Confirmation dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-[#253237]' : 'bg-white'}`}>
                        <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
                        <p className="mb-4">Are you sure you want to delete this course?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={handleRemoveCourse}
                            >
                                Delete
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                onClick={hideConfirmDeletion}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EducatorPage;
