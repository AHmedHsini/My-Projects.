import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoList, VideoListItem } from '../StyledComponents';

const VideoSection = ({ files, userOwnsCourse }) => {
    const navigate = useNavigate();

    if (!files || !Array.isArray(files.VIDEO)) {
        return <div>No videos available.</div>;
    }

    return (
        <VideoList className="rounded-lg p-4">
            <h3 className="text-xl font-bold mb-2">Videos</h3>
            <ul>
                {files.VIDEO.map((video, index) => (
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
                        </div>
                    </VideoListItem>
                ))}
            </ul>
        </VideoList>
    );
};

export default VideoSection;
