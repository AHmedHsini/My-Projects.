import React from 'react';
import { VideoList, VideoListItem } from '../StyledComponents';

const VideoSection = ({ files }) => {
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
                        className="flex items-center mb-4"
                    >
                        <div className="w-36 h-24 relative rounded-lg overflow-hidden mr-4">
                            <video
                                src={video.url}
                                className="w-full h-full object-cover"
                                onMouseEnter={(e) => {
                                    e.target.currentTime = 0;
                                    e.target.play().catch((error) => {
                                        console.error("Failed to play video", error);
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
