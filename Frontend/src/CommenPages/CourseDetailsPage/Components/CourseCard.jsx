import React from 'react';
import styled from 'styled-components';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const CourseCardStyled = styled.div`
    background-color: white;
    padding: 16px;
    border-radius: 0px 0px 8px 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 0px 4px rgba(0, 0, 0, 0.1);
    position: fixed;
    right: 14%;
    width: 25.5%;
    @media (max-width: 768px) {
        position: static;
        width: 90%;
        margin: 20px auto;
    }
`;

const Description = styled.div`
    max-height: 6em; /* 4 lines * 1.5em line height = 6em */
    line-height: 1.5em;
    overflow-y: auto;
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */

    &:hover {
        ::-webkit-scrollbar {
            display: block; /* Safari and Chrome */
            width: 8px;
        }
        ::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-track {
            background-color: rgba(0, 0, 0, 0.1);
        }
    }

    ::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
    }
`;

const CourseImage = styled.img`
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 16px;
`;

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
        <CourseCardStyled>
            {course.courseImage && (
                <CourseImage src={course.courseImage} alt={course.title} />
            )}
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <Description className="text-lg text-gray-600 mb-4">
                {course?.description}
            </Description>
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
