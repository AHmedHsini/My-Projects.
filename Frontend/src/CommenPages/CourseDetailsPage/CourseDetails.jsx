import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../headerComponents/Header";
import { useAuth } from "../../contexts/AuthContext";
import { CategoryContainer } from "./StyledComponents";
import CourseCard from "./Components/CourseCard";
import CourseContent from "./Components/CourseContent";
import Modal from "./Components/Modal";
import ReportModal from "../videospage/ReportModal";
import { FaFlag } from 'react-icons/fa';

function CourseDetails() {
    const { courseId } = useParams();
    const { user, isLoading } = useAuth();
    const [course, setCourse] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [files, setFiles] = useState({ PDF: [], VIDEO: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCardModal, setShowCardModal] = useState(false);
    const [userHasCardInfo, setUserHasCardInfo] = useState(false);
    const [confirmPurchase, setConfirmPurchase] = useState(false);
    const [userOwnsCourse, setUserOwnsCourse] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const courseResponse = await axios.get(`/api/Courses/${courseId}`);
                setCourse(courseResponse.data);

                const quizzesResponse = await axios.get(`/api/quiz/Courses/${courseId}`);
                setQuizzes(quizzesResponse.data);

                if (user && user.id) {
                    const filesResponse = await axios.get(`/api/Courses/${courseId}/details`, {
                        params: { userId: user.id }
                    });

                    const videoFiles = filesResponse.data.VIDEO;
                    const watchProgressPromises = videoFiles.map(async (video) => {
                        try {
                            const progressResponse = await axios.get(`/api/videos/${video.id}/watch-history?userId=${user.id}`, {
                                headers: {
                                    Authorization: `Bearer ${user.token}`,
                                },
                            });
                            return {
                                ...video,
                                watchProgress: progressResponse.data?.timestamp || 0,
                                duration: progressResponse.data?.duration || 1,
                            };
                        } catch (error) {
                            console.error('Failed to fetch watch progress for video', video.id, error);
                            return {
                                ...video,
                                watchProgress: 0,
                                duration: 1,
                            };
                        }
                    });

                    const videosWithProgress = await Promise.all(watchProgressPromises);
                    setFiles({ ...filesResponse.data, VIDEO: videosWithProgress });
                }
            } catch (err) {
                setError("Failed to fetch course details");
                console.error("Failed to fetch course details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId, user]);

    useEffect(() => {
        const checkUserCardInfo = async () => {
            if (user && user.id) {
                const response = await axios.get(`/api/auth/user/${user.id}/has-card-info`);
                setUserHasCardInfo(response.data);
            }
        };
        if (user?.id) {
            checkUserCardInfo();
        }
    }, [user]);

    useEffect(() => {
        const checkCourseOwnership = async () => {
            try {
                if (user && user.id) {
                    const response = await axios.get(`/api/Courses/${courseId}/check-purchase?userId=${user.id}`);
                    setUserOwnsCourse(response.data.isPurchased);
                }
            } catch (error) {
                console.error("Error checking course ownership:", error);
            }
        };
        if (user) {
            checkCourseOwnership();
        }
    }, [courseId, user]);

    const handleBuyNow = () => {
        if (!user) {
            alert("Please log in to purchase the course.");
            return;
        }
        if (!userHasCardInfo) {
            setShowCardModal(true);
        } else {
            setConfirmPurchase(true);
        }
    };

    const handleCardSubmit = async (event) => {
        event.preventDefault();

        const errors = {};
        if (!cardNumber || cardNumber.length !== 16) {
            errors.cardNumber = "Card number must be 16 digits.";
        }
        if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
            errors.expiryDate = "Expiry date must be in MM/YY format.";
        }
        if (!cvv || !/^\d{3}$/.test(cvv)) {
            errors.cvv = "CVV must be 3 digits.";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            if (user && user.id) {
                await axios.post(`/api/auth/user/${user.id}/card-info`, {
                    cardNumber,
                    expiryDate,
                    cvv,
                });
                setUserHasCardInfo(true);
                setShowCardModal(false);
                setConfirmPurchase(true);
            }
        } catch (error) {
            console.error("Failed to submit card information", error);
        }
    };

    const confirmPurchaseHandler = async () => {
        try {
            const url = `/api/Courses/${courseId}/purchase?userId=${user.id}`;
            await axios.post(url);
            setConfirmPurchase(false);
            setUserOwnsCourse(true);
            alert("Purchase successful!");
        } catch (error) {
            console.error("Purchase failed:", error);
            alert("Purchase failed!");
        }
    };

    const handleReport = async (reason) => {
        try {
            await axios.post('/api/reports', {
                userId: user.id,
                courseId: courseId,
                reason: reason
            });
            setShowReportModal(false);
        } catch (error) {
            console.error("Failed to submit report", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const currencyFormatter = new Intl.NumberFormat("fr-TN", {
        style: "currency",
        currency: "TND",
        minimumFractionDigits: 2,
    });
    const formattedPrice = course ? currencyFormatter.format(course.price) : "";

    return (
        <div>
            <Header />
            <CategoryContainer>
                <h3 className="text-xl font-bold text-indigo-600">Course Category:</h3>
                <p className="text-gray-700 ml-2">
                    {course && course.categories && course.categories.map(category => (
                        <span key={category.id} className="mr-2">{category.name}</span>
                    ))}
                </p>
                <button onClick={() => setShowReportModal(true)} className="ml-4 flex items-center text-red-500">
                    <FaFlag className="mr-2" /> Report
                </button>
            </CategoryContainer>
            <div style={{ borderRadius: "8px" }}>
                <img
                    src={course.courseImage}
                    alt={course.title}
                    style={{
                        float: "right",
                        marginRight: "14%",
                        width: "25.5%",
                        borderRadius: "8px",
                    }}
                />
                <CourseCard
                    course={course}
                    userOwnsCourse={userOwnsCourse}
                    formattedPrice={formattedPrice}
                    handleBuyNow={handleBuyNow}
                />
            </div>
            <CourseContent files={files} quizzes={quizzes} userOwnsCourse={userOwnsCourse} courseId={courseId} />
            <Modal show={showCardModal} onClose={() => setShowCardModal(false)}>
                <form onSubmit={handleCardSubmit} className="space-y-6 p-6">
                    <div>
                        <input
                            type="text"
                            name="cardNumber"
                            placeholder="Card Number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {formErrors.cardNumber && <p className="text-red-500 text-sm">{formErrors.cardNumber}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            name="expiryDate"
                            placeholder="Expiry Date (MM/YY)"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {formErrors.expiryDate && <p className="text-red-500 text-sm">{formErrors.expiryDate}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            name="cvv"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            pattern="\d{3}"
                            title="CVV must be 3 digits"
                        />
                        {formErrors.cvv && <p className="text-red-500 text-sm">{formErrors.cvv}</p>}
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </form>
            </Modal>
            <Modal show={confirmPurchase} hideCloseButton={true}>
                <div className="p-6">
                    <p className="text-lg font-semibold mb-4">Confirm Purchase</p>
                    <div className="flex justify-end">
                        <button
                            onClick={() => setConfirmPurchase(false)}
                            className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmPurchaseHandler}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal>
            <ReportModal
                show={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={handleReport}
            />
        </div>
    );
}

export default CourseDetails;
