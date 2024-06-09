import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import VideoCommentSection from './VideoCommentSection';
import { FaThumbsUp, FaEye, FaFlag } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../headerComponents/Header';
import {
    VideoContainer,
    VideoPlayer,
    VideoDetails,
    VideoTitle,
    VideoDescription,
    LikeButton,
    VideoViews
} from './VideoStyledComponents';
import ReportModal from './ReportModal';

const VideoPage = () => {
    const { videoId } = useParams();
    const { state } = useLocation();
    const videoRef = useRef(null);
    const [video, setVideo] = useState(null);
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const { user, isLoading } = useAuth();
    const [showReportModal, setShowReportModal] = useState(false);

    useEffect(() => {
        const fetchVideo = async () => {
            if (!user) {
                console.error('User must be logged in to view video details');
                return;
            }
            try {
                const response = await axios.get(`/api/videos/${videoId}`, {
                    params: { userId: user.id }
                });
                setVideo(response.data);
                setLikes(response.data.likes);
                setViews(response.data.views);
                if (user) {
                    setUserLiked(response.data.likedBy.includes(user.id));
                }

                const watchHistoryResponse = await axios.get(`/api/videos/${videoId}/watch-history`, {
                    params: { userId: user.id }
                });

                if (watchHistoryResponse.data && videoRef.current) {
                    videoRef.current.currentTime = watchHistoryResponse.data.timestamp;
                }
            } catch (err) {
                console.error('Failed to fetch video details:', err);
            }
        };

        if (!isLoading) {
            fetchVideo();
        }
    }, [videoId, user, isLoading]);

    const handleLike = async () => {
        if (!user) {
            console.error('User must be logged in to like a video');
            return;
        }
        try {
            if (!userLiked) {
                await axios.post(`/api/videos/${videoId}/like`, { userId: user.id });
                setLikes(likes + 1);
                setUserLiked(true);
            } else {
                await axios.post(`/api/videos/${videoId}/unlike`, { userId: user.id });
                setLikes(likes - 1);
                setUserLiked(false);
            }
        } catch (err) {
            console.error('Failed to like/unlike video:', err);
        }
    };

    const handlePause = async () => {
        if (!user || !videoRef.current) return;
        try {
            await axios.post(`/api/videos/${videoId}/watch`, {
                userId: user.id,
                timestamp: videoRef.current.currentTime,
                duration: videoRef.current.duration
            });
        } catch (err) {
            console.error('Failed to save watch position:', err);
        }
    };

    const handleReport = async (reason) => {
        try {
            await axios.post('/api/reports', {
                userId: user.id,
                videoId: videoId,
                reason: reason
            });
            setShowReportModal(false);
        } catch (error) {
            console.error("Failed to submit report", error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (!video) return <div>Failed to load video details.</div>;

    return (
        <div>
            <Header />
            <div
                style={{
                    backgroundImage: 'url("../assets/images/banner.png")',
                    width: "100%",
                    height: "800px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                }}
            >
                <VideoContainer>
                    <VideoPlayer
                        ref={videoRef}
                        src={video.url}
                        controls
                        onPause={handlePause}
                    />
                    <VideoDetails>
                        <VideoTitle>{video.title}</VideoTitle>
                        <VideoDescription>{video.description}</VideoDescription>
                        <VideoViews>
                            <FaEye /> {views} views
                        </VideoViews>
                        <LikeButton onClick={handleLike} $userLiked={userLiked}>
                            <FaThumbsUp /> {likes}
                        </LikeButton>
                        <button onClick={() => setShowReportModal(true)} className="flex items-center text-red-500">
                            <FaFlag className="mr-2" /> Report
                        </button>
                        <VideoCommentSection videoId={videoId} userOwnsCourse={true} />
                    </VideoDetails>
                </VideoContainer>
            </div>
            <ReportModal
                show={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={handleReport}
            />
        </div>
    );
};

export default VideoPage;