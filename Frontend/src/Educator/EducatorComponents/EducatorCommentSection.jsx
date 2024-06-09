import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkMode';

const EducatorCommentSection = ({ courseId }) => {
    const { user } = useAuth();
    const { isDarkMode } = useDarkMode();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const commentsEndRef = useRef(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/comments/course/${courseId}`);
                setComments(response.data);
            } catch (error) {
                console.error("Failed to fetch comments", error);
            }
        };
        fetchComments();
    }, [courseId]);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        if (newComment.trim() === "") return;

        try {
            const response = await axios.post('/api/comments', {
                commentBody: newComment,
                commenterId: user.id,
                courseId: courseId,
            });
            setComments([...comments, response.data]);
            setNewComment("");
            scrollToBottom();
        } catch (error) {
            console.error("Failed to submit comment", error);
        }
    };

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    const containerBgColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
    const inputBgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
    const inputTextColor = isDarkMode ? 'text-white' : 'text-black';
    const submitButtonColor = isDarkMode ? 'bg-indigo-600' : 'bg-indigo-600';

    return (
        <div className={`p-4 rounded-lg shadow-lg ${containerBgColor}`}>
            <h3 className={`text-xl font-bold mb-4 ${inputTextColor}`}>Comments</h3>
            <div className={`overflow-y-auto mb-4 ${isDarkMode ? 'dark-mode-comments-section' : 'light-mode-comments-section'}`} style={{ maxHeight: '200px' }}>
                <ul>
                    {comments?.map((comment) => (
                        <li key={comment.id} className="mb-2">
                            <p className={`font-semibold ${inputTextColor}`}>{comment.commenterName} {comment.commenterLastName}</p>
                            <p className={inputTextColor}>{comment.body}</p>
                        </li>
                    ))}
                    <div ref={commentsEndRef} />
                </ul>
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className={`flex-grow p-2 rounded-l ${inputBgColor} ${inputTextColor}`}
                />
                <button
                    type="submit"
                    className={`p-2 rounded-r ${submitButtonColor} hover:bg-indigo-700 text-white`}
                    onClick={handleCommentSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default EducatorCommentSection;