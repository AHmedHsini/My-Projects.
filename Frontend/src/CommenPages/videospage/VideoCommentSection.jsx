import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import {
    CommentSectionContainer,
    CommentList,
    CommentItem,
    CommentInputContainer,
    CommentInput,
    CommentSubmitButton,
} from './VideoStyledComponents';
import { FaFlag } from 'react-icons/fa';
import ReportModal from './ReportModal'; // Import the ReportModal component

const VideoCommentSection = ({ videoId, userOwnsCourse }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportCommentId, setReportCommentId] = useState(null);
    const commentsEndRef = useRef(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/comments/video/${videoId}`);
                setComments(response.data);
            } catch (error) {
                console.error("Failed to fetch comments", error);
            }
        };
        fetchComments();
    }, [videoId]);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        if (newComment.trim() === "") return;

        try {
            const response = await axios.post('/api/comments', {
                commentBody: newComment,
                commenterId: user.id,
                videoId: videoId,
            });
            setComments([...comments, response.data]);
            setNewComment("");
            scrollToBottom();
        } catch (error) {
            console.error("Failed to submit comment", error);
        }
    };

    const handleReport = async (reason) => {
        try {
            await axios.post('/api/reports', {
                userId: user.id,
                commentId: reportCommentId,
                reason: reason
            });
            setShowReportModal(false);
        } catch (error) {
            console.error("Failed to submit report", error);
        }
    };

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    return (
        <CommentSectionContainer>
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            <CommentList>
                {comments?.map((comment) => (
                    <CommentItem key={comment.id}>
                        <p className="text-gray-900 font-semibold">{comment.commenterName} {comment.commenterLastName}</p>
                        <p className="text-gray-700">{comment.body}</p>
                        <button
                            onClick={() => {
                                setReportCommentId(comment.id);
                                setShowReportModal(true);
                            }}
                            className="text-red-500 flex items-center"
                        >
                            <FaFlag className="mr-2" /> Report
                        </button>
                    </CommentItem>
                ))}
                <div ref={commentsEndRef} />
            </CommentList>
            {userOwnsCourse && user ? (
                <CommentInputContainer>
                    <CommentInput
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleCommentSubmit(e);
                            }
                        }}
                    />
                    <CommentSubmitButton
                        type="submit"
                        onClick={handleCommentSubmit}
                    >
                        Submit
                    </CommentSubmitButton>
                </CommentInputContainer>
            ) : (
                !userOwnsCourse && (
                    <p className="text-gray-500">Please purchase the course to comment.</p>
                )
            )}
            <ReportModal
                show={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={handleReport}
            />
        </CommentSectionContainer>
    );
};

export default VideoCommentSection;