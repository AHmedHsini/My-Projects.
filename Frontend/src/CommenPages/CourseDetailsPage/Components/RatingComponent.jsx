import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import { RatingContainer } from '../StyledComponents'; // import the new styled component

const RatingComponent = ({ courseId, currentRating, userOwnsCourse }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(currentRating);
    const [hover, setHover] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [ratingToConfirm, setRatingToConfirm] = useState(null);

    useEffect(() => {
        // Check if user has already rated the course
        const fetchUserRating = async () => {
            try {
                if (user && user.id) { // Check if user and user.id are defined
                    const response = await axios.get(`/api/ratings/user/${user.id}/course/${courseId}`);
                    if (response.data) {
                        setRating(response.data.value);
                        setSubmitted(true);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user rating", error);
            }
        };

        if (user) {
            fetchUserRating();
        }
    }, [user, courseId]);

    const submitRating = async (newRating) => {
        try {
            if (user && user.id) { // Check if user and user.id are defined
                await axios.post('/api/ratings', {
                    userId: user.id,
                    courseId: courseId,
                    ratingValue: newRating,
                });
                setRating(newRating);
                setSubmitted(true);
                setRatingToConfirm(null);
            }
        } catch (error) {
            console.error("Failed to submit rating", error);
        }
    };

    const handleStarClick = (newRating) => {
        setRatingToConfirm(newRating);
    };

    const confirmRating = () => {
        if (ratingToConfirm) {
            submitRating(ratingToConfirm);
        }
    };

    if (!userOwnsCourse || submitted) {
        return null; // Don't render the rating component if the user doesn't own the course or has already submitted a rating
    }

    return (
        <RatingContainer className="rating-component">
            <h3 className="text-xl font-bold mb-4">Rate this Course</h3>
            <div style={{ display: 'flex' }}>
                {[...Array(5)].map((star, index) => {
                    const ratingValue = index + 1;
                    return (
                        <FaStar
                            key={index}
                            size={30}
                            style={{ cursor: 'pointer', color: ratingValue <= (hover || ratingToConfirm || rating) ? '#FFD700' : '#e4e5e9' }}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                            onClick={() => handleStarClick(ratingValue)}
                        />
                    );
                })}
            </div>
            {ratingToConfirm && !submitted && (
                <div>
                    <p className="text-lg mt-2">You selected: {ratingToConfirm} star{ratingToConfirm > 1 ? 's' : ''}</p>
                    <button
                        onClick={confirmRating}
                        style={{
                            backgroundColor: "green",
                            color: "white",
                            padding: "8px 24px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            marginTop: "10px",
                        }}
                    >
                        Confirm Rating
                    </button>
                </div>
            )}
        </RatingContainer>
    );
};

export default RatingComponent;
