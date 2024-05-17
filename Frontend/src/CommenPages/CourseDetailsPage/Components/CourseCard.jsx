import React from 'react';
import { CourseCardStyled } from '../StyledComponents';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const CourseCard = ({ course, userOwnsCourse, formattedPrice, handleBuyNow }) => {
    const renderRatingStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {[...Array(fullStars)].map((_, index) => (
                    <FaStar key={`full-${index}`} style={{ color: '#FFD700' }} />
                ))}
                {halfStar && <FaStarHalfAlt style={{ color: '#FFD700' }} />}
                {[...Array(emptyStars)].map((_, index) => (
                    <FaRegStar key={`empty-${index}`} style={{ color: '#FFD700' }} />
                ))}
            </div>
        );
    };

    return (
        <CourseCardStyled className="bg-white p-4">
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{course?.description}</p>
            <div className="flex items-center mb-4">
                <span className="text-lg font-semibold mr-2">Rating:</span>
                {renderRatingStars(course.rating)}
                <span className="ml-2 text-lg">{course.rating.toFixed(1)}</span>
            </div>
            {userOwnsCourse ? (
                <p className="text-lg text-green-500 font-semibold">Owned</p>
            ) : (
                <div>
                    <p className="text-2xl font-bold mb-2">{formattedPrice}</p>
                    <button
                        onClick={handleBuyNow}
                        style={{
                            backgroundColor: "green",
                            color: "white",
                            padding: "8px 24px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            float: "right",
                            marginLeft: "10px",
                        }}
                    >
                        Buy Now
                    </button>
                </div>
            )}
        </CourseCardStyled>
    );
};

export default CourseCard;
