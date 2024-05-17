import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import { CommentContainer, CommentInputContainer, CommentListContainer } from '../StyledComponents';

const CommentSection = ({ courseId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const commentsEndRef = useRef(null);  // Create a ref for the end of the comment list

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
            scrollToBottom();  // Scroll to the bottom when a new comment is added
        } catch (error) {
            console.error("Failed to submit comment", error);
        }
    };

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();  // Scroll to the bottom when the component mounts
    }, [comments]);

    return (
        <CommentContainer className="mt-6 p-4 rounded-lg shadow-lg bg-white">
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            <CommentListContainer className="mb-4">
                <ul>
                    {comments?.map((comment) => (
                        <li key={comment.id} className="mb-2 p-2 border-b border-gray-200">
                            <p className="text-gray-900 font-semibold">{comment.commenterName} {comment.commenterLastName}</p>
                            <p className="text-gray-700">{comment.body}</p>
                        </li>
                    ))}
                    <div ref={commentsEndRef} />  {/* Empty div to act as a scroll target */}
                </ul>
            </CommentListContainer>
            {user ? (
                <CommentInputContainer>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-grow p-2 border border-gray-300 rounded-l"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-r"
                        onClick={handleCommentSubmit}
                    >
                        Submit
                    </button>
                </CommentInputContainer>
            ) : (
                <p className="text-gray-500">Please log in to comment.</p>
            )}
        </CommentContainer>
    );
};

export default CommentSection;
