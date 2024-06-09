import React from 'react';
import { VideoList, VideoListItem, QuizzesList, QuizItem, PdfList, PdfListItem } from '../StyledComponents';
import { FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CommentSection from './CommentSection';
import RatingComponent from './RatingComponent';

const CourseContent = ({ files, quizzes, userOwnsCourse, courseId, currentRating }) => {
    const navigate = useNavigate();

    return (
        <div className="w-full p-6 lg:w-3/5 lg:ml-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VideoList className="rounded-lg p-4">
                    <h3 className="text-xl font-bold mb-2">Videos</h3>
                    <ul>
                        {files?.VIDEO?.map((video, index) => {
                            const progressPercentage = (video.watchProgress / video.duration) * 100;

                            return (
                                <VideoListItem
                                    key={video.id ?? index}
                                    className={`flex items-center mb-4 ${!userOwnsCourse ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (userOwnsCourse) {
                                            navigate(`/video/${video.id}`);
                                        }
                                    }}
                                >
                                    <div className="w-36 h-24 relative rounded-lg overflow-hidden mr-4">
                                        <video
                                            src={video.url}
                                            className="w-full h-full object-cover"
                                            onMouseEnter={(e) => {
                                                if (userOwnsCourse) {
                                                    e.target.currentTime = 0;
                                                    e.target.play().catch((error) => {
                                                        console.error("Failed to play video", error);
                                                    });
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (userOwnsCourse) {
                                                    e.target.pause();
                                                    e.target.currentTime = 0;
                                                }
                                            }}
                                            loop
                                        />
                                    </div>
                                    <div className="flex-grow ml-4">
                                        <div className="font-semibold">{video.title}</div>
                                        <div className="text-sm">{video.description}</div>
                                        <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
                                            <div
                                                className="bg-blue-500 h-full rounded-full"
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </VideoListItem>
                            );
                        })}
                    </ul>
                </VideoList>

                <div>
                    <QuizzesList className="rounded-lg p-4 mb-6">
                        <h3 className="text-xl font-bold mb-2">Quizzes</h3>
                        <ul>
                            {quizzes.map((quiz) => (
                                <QuizItem
                                    key={quiz.id}
                                    className={`mb-2 ${!userOwnsCourse ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (userOwnsCourse) {
                                            navigate(`/api/quiz/${quiz.id}/attempt`);
                                        }
                                    }}
                                >
                                    <span>{quiz.title}</span>
                                </QuizItem>
                            ))}
                        </ul>
                    </QuizzesList>

                    <PdfList className="rounded-lg p-4">
                        <h3 className="text-xl font-bold mb-2">PDF Files</h3>
                        <ul>
                            {files?.PDF?.map((file, index) => (
                                <PdfListItem
                                    key={file.id ?? index}
                                    className={`flex items-center mb-4 ${!userOwnsCourse ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (userOwnsCourse) {
                                            window.open(file.url, "_blank");
                                        }
                                    }}
                                >
                                    <FaFilePdf className="mr-2 text-red-500" size={20} />
                                    <span>{file.title}</span>
                                </PdfListItem>
                            ))}
                        </ul>
                    </PdfList>

                    <RatingComponent courseId={courseId} currentRating={currentRating} userOwnsCourse={userOwnsCourse} />
                    <CommentSection courseId={courseId} userOwnsCourse={userOwnsCourse} />
                </div>
            </div>
        </div>
    );
};

export default CourseContent;
