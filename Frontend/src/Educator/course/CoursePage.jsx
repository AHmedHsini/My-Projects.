import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkMode';
import { FaBars, FaUpload, FaEdit, FaFilePdf } from 'react-icons/fa';
import NavBar from '../../components/EducatorComponents/EducatorNavBar';
import './DarkModeScrollbar.css';

function Courses() {
    const { courseId } = useParams();
    const { user } = useAuth();
    const { isDarkMode } = useDarkMode();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [files, setFiles] = useState({ PDF: [], VIDEO: [] });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch course details, quizzes, and files when the component mounts or when `courseId` or `user` changes
    useEffect(() => {
        if (!user || !user.token) {
            return;
        }

        const fetchCourseDetails = async () => {
            try {
                // Fetch course details
                const courseResponse = await axios.get(`/api/Courses/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setCourse(courseResponse.data);

                // Fetch quizzes
                const quizzesResponse = await axios.get(`api/quiz/Courses/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setQuizzes(quizzesResponse.data);

                // Fetch files
                const filesResponse = await axios.get(`/api/Courses/${courseId}/files?educator=${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setFiles(filesResponse.data);
            } catch (error) {
                toast.error('Failed to fetch course details, quizzes, or files.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId, user]);

    // Event handlers
    const handleEditCourse = () => {
        navigate(`/educator/${courseId}/edit`);
    };

    const handleManageQuizzes = () => {
        navigate(`/educator/${courseId}/manage-quizzes`);
    };

    const handleUploadFile = () => {
        navigate(`/educator/${courseId}/add-file`);
    };

    // Display loading state
    if (isLoading) {
        return <div className={`text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading...</div>;
    }

    // Colors and styles for dark mode and light mode
    const containerBgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
    const contentBgColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
    const textColor = isDarkMode ? 'text-white' : 'text-black';

    // Formatter to display the price in Tunisian Dinar (DT)
    const currencyFormatter = new Intl.NumberFormat('fr-TN', {
        style: 'currency',
        currency: 'TND',
        minimumFractionDigits: 2,
    });

    const formattedPrice = course ? currencyFormatter.format(course.price) : '';

    // Render the course details, quizzes, and files
    return (
        <div className={`min-h-screen ${containerBgColor} ${textColor}`}>
            <NavBar />

            <div className="container mx-auto flex justify-center mt-8">
                {/* Course Details */}
                <div
                    className={`w-1/5 p-6 ${contentBgColor} rounded-lg ${isDarkMode ? 'shadow-gray-900' : 'shadow-lg'} relative overflow-y-auto`}
                    style={{ height: '600px', marginTop: '88px' }}
                >
                    {/* Edit course button */}
                    <button
                        onClick={handleEditCourse}
                        className="absolute top-0 right-0 mt-4 mr-4 focus:outline-none"
                    >
                        <FaBars size={24} className={textColor} />
                    </button>

                    {/* Course image */}
                    {course?.courseImage && (
                        <div className="mb-4 mt-12">
                            <img src={course.courseImage} alt="Course" className="w-full rounded-lg" />
                        </div>
                    )}

                    {/* Course title */}
                    <div className={`text-xl font-bold mb-2 ${textColor}`}>
                        {course?.title}
                    </div>

                    {/* Course category */}
                    <div className={`text-gray-600 mb-2 ${textColor}`}>
                        <strong>Category:</strong> {course?.category?.join(', ')}
                    </div>

                    {/* Course price */}
                    <div className={`text-gray-600 mb-4 ${textColor}`}>
                        <strong>Price:</strong> {formattedPrice} {/* Displaying the price in DT */}
                    </div>

                    {/* Course description */}
                    <div className={`w-full rounded p-2 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        {course?.description}
                    </div>
                </div>

                {/* Content Area */}
                <div className="w-4/5 p-6 ml-1">
                    {/* Upload File Button */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={handleUploadFile}
                            className={`bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-all flex items-center ml-2 ${isDarkMode ? 'shadow-gray-900' : 'shadow-lg'}`}
                        >
                            <FaUpload className="mr-2" />
                            Upload File
                        </button>
                    </div>

                    {/* Videos and Quizzes Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Videos Section */}
                        <div
                            className={`rounded-lg ${isDarkMode ? 'dark-mode-videos-section' : 'light-mode-videos-section'} ${contentBgColor} ${isDarkMode ? 'shadow-gray-900' : 'shadow-lg'} p-4`}
                            style={{ overflowY: 'auto', maxHeight: '700px' }}
                        >
                            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Videos</h3>
                            <ul>
                                {files?.VIDEO?.map((video, index) => (
                                    <li key={video.id ?? index}
                                        className={`flex items-center mb-4 rounded-lg transition-transform relative border ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
                                            } hover:shadow-lg hover:scale-102 hover:translate-y-1 cursor-pointer`}
                                        onClick={() => window.open(video.url, '_blank')}
                                    >
                                        {/* Video thumbnail */}
                                        <div className="w-36 h-24 relative rounded-lg overflow-hidden mr-4">
                                            <video
                                                src={video.url}
                                                className="w-full h-full object-cover"
                                                onMouseEnter={(e) => {
                                                    e.target.currentTime = 0; // Reset video to start
                                                    e.target.play().catch((error) => {
                                                        console.error('Failed to play video', error);
                                                    });
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.pause(); // Pause the video
                                                    e.target.currentTime = 0; // Reset video to start
                                                }}
                                                loop
                                            />
                                        </div>

                                        {/* Title and description */}
                                        <div className="flex-grow ml-4">
                                            <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                                {video.title}
                                            </div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {video.description}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quizzes and PDF Files Section */}
                        <div>
                            {/* Quizzes Section */}
                            <div className={`rounded-lg ${contentBgColor} ${isDarkMode ? 'shadow-gray-900' : 'shadow-lg'} p-4 mb-6 relative`}>
                                {/* Edit quizzes button */}
                                <div className="absolute top-0 right-0 p-2">
                                    <FaEdit
                                        className={`${textColor} hover:text-black cursor-pointer`}
                                        size={20}
                                        onClick={handleManageQuizzes}
                                    />
                                </div>

                                <h3 className={`text-xl font-bold mb-2 ${textColor}`}>Quizzes</h3>
                                <ul>
                                    {quizzes?.map((quiz, index) => (
                                        // Wrap each quiz in a clickable element (div) and add onClick handler
                                        <div
                                            key={quiz.id ?? index}
                                            // Add hover effect and conditional border styling
                                            className={`mb-2 cursor-pointer rounded-lg p-2 transition-transform relative ${isDarkMode ? 'border-transparent hover:border-gray-700' : 'border-transparent hover:border-gray-300'
                                                } ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                hover:shadow-lg hover:scale-102 hover:translate-y-1`}
                                            // Navigate to quiz detail page on click
                                            onClick={() => navigate(`/educator/${courseId}/quiz/${quiz.id}`)}
                                        >
                                            <span className={textColor}>{quiz.title}</span>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                            {/* PDF Files Section */}
                            <div className={`rounded-lg ${contentBgColor} ${isDarkMode ? 'shadow-gray-900' : 'shadow-lg'} p-4`}>
                                <h3 className={`text-xl font-bold mb-2 ${textColor}`}>PDF Files</h3>
                                <ul>
                                    {files?.PDF?.map((file, index) => (
                                        <li
                                            key={file.id ?? index}
                                            // Add hover effect and conditional border styling
                                            className={`flex items-center mb-4 rounded-lg transition-transform relative ${isDarkMode ? 'border-transparent hover:border-gray-700' : 'border-transparent hover:border-gray-300'
                                                } ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                hover:shadow-lg hover:scale-102 hover:translate-y-1 cursor-pointer`}
                                            // Handle click to open PDF file
                                            onClick={() => window.open(file.url, '_blank')}
                                        >
                                            {/* PDF icon */}
                                            <FaFilePdf className="mr-2 text-red-500" size={20} />

                                            {/* PDF file name */}
                                            <span className={textColor}>
                                                {file.title}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Courses;
