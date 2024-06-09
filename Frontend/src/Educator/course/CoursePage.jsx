import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkMode';
import { FaBars, FaUpload, FaEdit, FaFilePdf, FaEye, FaThumbsUp } from 'react-icons/fa';
import NavBar from '../EducatorComponents/EducatorNavBar';
import EducatorCommentSection from '../EducatorComponents/EducatorCommentSection';
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

    useEffect(() => {
        if (!user || !user.token) {
            return;
        }

        const fetchCourseDetails = async () => {
            try {
                const courseResponse = await axios.get(`/api/Courses/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setCourse(courseResponse.data);

                const quizzesResponse = await axios.get(`api/quiz/Courses/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setQuizzes(quizzesResponse.data);

                const filesResponse = await axios.get(`/api/Courses/${courseId}/files?educatorId=${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                // Fetch watch progress for each video
                const videoFiles = filesResponse.data.VIDEO;
                const watchProgressPromises = videoFiles.map(async (video) => {
                    try {
                        const progressResponse = await axios.get(`/api/videos/${video.id}/watch-history?userId=${user.id}`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        });
                        return {
                            ...video,
                            watchProgress: progressResponse.data?.timestamp || 0,
                            duration: progressResponse.data?.duration || video.duration || 1, // Ensure a valid duration to avoid division by zero
                        };
                    } catch (error) {
                        console.error('Failed to fetch watch progress for video', video.id, error);
                        return {
                            ...video,
                            watchProgress: 0,
                            duration: video.duration || 1, // Default duration to avoid division by zero
                        };
                    }
                });

                const videosWithProgress = await Promise.all(watchProgressPromises);
                setFiles({ ...filesResponse.data, VIDEO: videosWithProgress });
            } catch (error) {
                toast.error('Failed to fetch course details, quizzes, or files.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId, user]);

    const handleEditCourse = () => {
        navigate(`/educator/${courseId}/edit`);
    };

    const handleManageQuizzes = () => {
        navigate(`/educator/${courseId}/manage-quizzes`);
    };

    const handleUploadFile = () => {
        navigate(`/educator/${courseId}/add-file`);
    };

    const handleVideoClick = async (videoId) => {
        try {
            const response = await axios.get(`/api/videos/${videoId}/watch-history?userId=${user.id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const lastWatchedTimestamp = response.data?.lastWatchedTimestamp || 0;
            navigate(`/video/${videoId}`, { state: { lastWatchedTimestamp } });
        } catch (error) {
            console.error('Failed to fetch watch history', error);
            navigate(`/video/${videoId}`);
        }
    };

    if (isLoading) {
        return <div className={`text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading...</div>;
    }

    const containerBgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
    const contentBgColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
    const textColor = isDarkMode ? 'text-white' : 'text-black';

    const currencyFormatter = new Intl.NumberFormat('fr-TN', {
        style: 'currency',
        currency: 'TND',
        minimumFractionDigits: 2,
    });

    const formattedPrice = course ? currencyFormatter.format(course.price) : '';

    return (
        <div className={`min-h-screen ${containerBgColor} ${textColor}`}>
            <NavBar />
            <div className="container mx-auto flex justify-center mt-8">
                <div
                    className={`w-1/5 p-6 ${contentBgColor} rounded-lg ${isDarkMode ? 'shadow-gray-900' : 'shadow-lg'} relative overflow-y-auto`}
                    style={{ height: '600px', marginTop: '88px' }}
                >
                    <button
                        onClick={handleEditCourse}
                        className="absolute top-0 right-0 mt-4 mr-4 focus:outline-none"
                    >
                        <FaBars size={24} className={textColor} />
                    </button>

                    {course?.courseImage && (
                        <div className="mb-4 mt-12">
                            <img src={course.courseImage} alt="Course" className="w-full rounded-lg" />
                        </div>
                    )}

                    <div className={`text-xl font-bold mb-2 ${textColor}`}>
                        {course?.title}
                    </div>

                    <div className={`text-gray-600 mb-2 ${textColor}`}>
                        <strong>Categories:</strong> {course?.categories?.map(category => category.name).join(', ')}
                    </div>

                    <div className={`text-gray-600 mb-4 ${textColor}`}>
                        <strong>Price:</strong> {formattedPrice}
                    </div>

                    <div className={`w-full rounded p-2 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        {course?.description}
                    </div>
                </div>

                <div className="w-4/5 p-6 ml-1">
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={handleUploadFile}
                            className={`bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-all flex items-center ml-2 ${isDarkMode ? 'shadow-gray-900' : 'shadow-lg'}`}
                        >
                            <FaUpload className="mr-2" />
                            Upload File
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div
                            className={`rounded-lg ${isDarkMode ? 'dark-mode-videos-section' : 'light-mode-videos-section'} ${contentBgColor} ${isDarkMode ? 'shadow-gray-900' : 'shadow-lg'} p-4`}
                            style={{ overflowY: 'auto', maxHeight: '631px' }}
                        >
                            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Videos</h3>
                            <ul>
                                {files?.VIDEO?.map((video, index) => {
                                    // Calculate the progress percentage
                                    const progressPercentage = (video.watchProgress / video.duration) * 100;

                                    return (
                                        <li
                                            key={video.id ?? index}
                                            className={`flex items-center mb-4 rounded-lg transition-transform relative border ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
                                                } hover:shadow-lg hover:scale-102 hover:translate-y-1 cursor-pointer`}
                                            onClick={() => handleVideoClick(video.id)}
                                        >
                                            <div className="w-36 h-24 relative rounded-lg overflow-hidden mr-4">
                                                <video
                                                    src={video.url}
                                                    className="w-full h-full object-cover"
                                                    onMouseEnter={(e) => {
                                                        e.target.currentTime = 0;
                                                        e.target.play().catch((error) => {
                                                            console.error('Failed to play video', error);
                                                        });
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.pause();
                                                        e.target.currentTime = 0;
                                                    }}
                                                    loop
                                                />
                                            </div>

                                            <div className="flex-grow ml-4">
                                                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                                    {video.title}
                                                </div>
                                                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {video.description}
                                                </div>
                                                <div className="flex items-center text-sm mt-1">
                                                    <FaEye className="mr-1" />
                                                    {video.views || 0} views
                                                    <FaThumbsUp className="mr-1 ml-3" />
                                                    {video.likes || 0} likes
                                                </div>
                                                <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
                                                    <div
                                                        className="bg-blue-500 h-full rounded-full"
                                                        style={{ width: `${progressPercentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div>
                            <div className={`rounded-lg ${contentBgColor} ${isDarkMode ? 'shadow-gray-900' : 'shadow-lg'} p-4 mb-6 relative`} onClick={() => handleEditQuiz(quiz)}>
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
                                        <div
                                            key={quiz.id ?? index}
                                            className={`mb-2 cursor-pointer rounded-lg p-2 transition-transform relative ${isDarkMode ? 'border-transparent hover:border-gray-700' : 'border-transparent hover:border-gray-300'
                                                } ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                                                hover:shadow-lg hover:scale-102 hover:translate-y-1`}
                                            onClick={() => navigate(`/educator/${courseId}/quiz/${quiz.id}`)}
                                        >
                                            <span className={textColor}>{quiz.title}</span>
                                        </div>
                                    ))}
                                </ul>
                            </div>

                            <div className={`rounded-lg ${contentBgColor} ${isDarkMode ? 'shadow-gray-900' : 'shadow-lg'} p-4 mb-6`}>
                                <h3 className={`text-xl font-bold mb-2 ${textColor}`}>PDF Files</h3>
                                <ul>
                                    {files?.PDF?.map((file, index) => (
                                        <li
                                            key={file.id ?? index}
                                            className={`flex items-center mb-4 rounded-lg transition-transform relative ${isDarkMode ? 'border-transparent hover:border-gray-700' : 'border-transparent hover:border-gray-300'
                                                } ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                                                hover:shadow-lg hover:scale-102 hover:translate-y-1 cursor-pointer`}
                                            onClick={() => window.open(file.url, '_blank')}
                                        >
                                            <FaFilePdf className="mr-2 text-red-500" size={20} />
                                            <span className={textColor}>
                                                {file.title}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={`rounded-lg ${contentBgColor} ${isDarkMode ? 'shadow-gray-900' : 'shadow-lg'} p-4`}>
                                <EducatorCommentSection courseId={courseId} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Courses;
