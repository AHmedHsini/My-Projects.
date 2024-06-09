import React, { useState, useEffect } from 'react';
import EducatorNavBar from './EducatorComponents/EducatorSideBar';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkMode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AddCourseModal from './course/CreateCourse';
import styled from 'styled-components';

const CourseCard = styled.div`
    width: 100%;
    padding: 16px;
    border: 1px solid ${(props) => (props.$isDarkMode ? '#2d2d2d' : '#e0e0e0')};
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${(props) => (props.$isDarkMode ? '#1a1a1a' : '#fff')};
    color: ${(props) => (props.$isDarkMode ? '#cad2c5' : '#333')};
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    margin-bottom: 16px;
    min-height: 200px; /* Ensure uniform height */

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
        margin-right: 16px;
    }

    .course-info {
        flex-grow: 1;

        h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .description {
            max-height: 4.5rem; /* 3 lines */
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            white-space: normal;
        }
    }

    .course-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .action-icons {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 8px;

            .icon {
                margin-left: 16px;
                cursor: pointer;

                &:hover {
                    color: ${(props) => (props.$isDarkMode ? '#ff6b6b' : '#ff0000')};
                }
            }
        }
    }
`;

function EducatorPage() {
    const { user, isLoading } = useAuth();
    const { isDarkMode, toggleDarkMode } = useDarkMode(); // Accessing dark mode context
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

    const fetchCourses = async () => {
        if (!user || !user.token) {
            return;
        }

        try {
            const headers = { Authorization: `Bearer ${user.token}` };

            const response = await axios.get(`/api/Courses/educator/${user.id}`, { headers });
            const coursesData = response.data;

            const fetchCountsPromises = coursesData.map(async (course) => {
                const viewCountResponse = await axios.get(`/api/Courses/${course.id}/visit-count`);
                const purchaseCountResponse = await axios.get(`/api/Courses/${course.id}/purchase-count`);
                return {
                    ...course,
                    viewCount: viewCountResponse.data,
                    purchaseCount: purchaseCountResponse.data,
                };
            });

            const coursesWithCounts = await Promise.all(fetchCountsPromises);
            setCourses(coursesWithCounts);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses');
        }
    };

    useEffect(() => {
        if (!user || isLoading) return;

        if (user.role !== "Educator") {
            navigate("/"); // Redirect to home or another appropriate page
            return;
        }

        fetchCourses();
    }, [user, isLoading, navigate]);

    const handleAddCourse = () => {
        setIsAddCourseModalOpen(true);
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

    const currencyFormatter = new Intl.NumberFormat('fr-TN', {
        style: 'currency',
        currency: 'TND',
        minimumFractionDigits: 2,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user || user.role !== "Educator") {
        return <div>Unauthorized access. Redirecting...</div>;
    }

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-[#253237]' : 'bg-[#FAFAFA]'} text-${isDarkMode ? '[#CAD2C5]' : '[#333333]'}`}>
            <EducatorNavBar isDarkMode={isDarkMode} toggleTheme={toggleDarkMode} />

            <div className={`flex-grow p-8 max-w-6xl mx-auto p-8 rounded-lg`}>
                <div className={`flex justify-between items-center mb-8 sticky top-0 z-10 p-4 rounded-lg ${isDarkMode ? 'bg-[#1A2D34]' : 'bg-[#E0E0E0]'}`}>
                    <h1 className="text-4xl font-bold">{'Your Added Courses'}</h1>
                    <button onClick={handleAddCourse} className={`px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center justify-center`}>
                        <FaPlus className="mr-2" /> Add Course
                    </button>
                </div>

                {courses.length > 0 ? (
                    <ul className="space-y-4">
                        {courses.map((course) => (
                            <CourseCard key={course.id} onClick={() => handleModifyCourse(course.id)} $isDarkMode={isDarkMode}>
                                {course.courseImage && (
                                    <img src={course.courseImage} alt={course.title} />
                                )}
                                <div className="course-info">
                                    <h3>{course.title}</h3>
                                    <div className="description">
                                        {course.description}
                                    </div>
                                    <p>Price: {currencyFormatter.format(course.price)}</p>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center text-green-500">
                                            <FaPlus className="mr-1" /> Purchases: {course.purchaseCount}
                                        </div>
                                        <div className="flex items-center text-blue-500">
                                            <FaEye className="mr-1" /> Views: {course.viewCount}
                                        </div>
                                    </div>
                                </div>
                                <div onClick={(e) => { e.stopPropagation(); showConfirmDeletion(course); }} className="course-actions">
                                    <FaTrash className="icon" title="Delete" />
                                </div>
                            </CourseCard>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center">
                        No courses available
                    </p>
                )}
            </div>

            {showConfirmDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-[#253237]' : 'bg-white'}`}>
                        <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
                        <p className="mb-4">Are you sure you want to delete this course?</p>
                        <div className="flex justify-end space-x-4">
                            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleRemoveCourse}>Delete</button>
                            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={hideConfirmDeletion}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <AddCourseModal isOpen={isAddCourseModalOpen} onClose={() => setIsAddCourseModalOpen(false)} refreshCourses={fetchCourses} isDarkMode={isDarkMode} />
        </div>
    );
}

export default EducatorPage;
