import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../headerComponents/Header";
import { useAuth } from "../../contexts/AuthContext";
import { CategoryContainer } from "./StyledComponents";
import CourseCard from "./Components/CourseCard";
import CourseContent from "./Components/CourseContent";
import Modal from "./Components/Modal";

function CourseDetails() {
    const { courseId } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [files, setFiles] = useState({ PDF: [], VIDEO: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCardModal, setShowCardModal] = useState(false);
    const [userHasCardInfo, setUserHasCardInfo] = useState(false);
    const [confirmPurchase, setConfirmPurchase] = useState(false);
    const [userOwnsCourse, setUserOwnsCourse] = useState(false);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const courseResponse = await axios.get(`/api/Courses/${courseId}`);
                setCourse(courseResponse.data);

                const quizzesResponse = await axios.get(`api/quiz/Courses/${courseId}`);
                setQuizzes(quizzesResponse.data);

                const filesResponse = await axios.get(`/api/Courses/${courseId}/details`);
                setFiles(filesResponse.data);
            } catch (err) {
                setError("Failed to fetch course details");
                console.error("Failed to fetch course details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetails();
    }, [courseId]);

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
        checkCourseOwnership();
    }, [courseId, user]);

    const handleBuyNow = () => {
        if (!userHasCardInfo) {
            setShowCardModal(true);
        } else {
            setConfirmPurchase(true);
        }
    };

    const handleCardSubmit = async (event) => {
        event.preventDefault();
        const cardNumber = event.target.cardNumber.value;
        const expiryDate = event.target.expiryDate.value;
        const cvv = event.target.cvv.value;

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
                <p className="text-gray-700 ml-2">{course.category}</p> {/* Add margin-left to the paragraph */}
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
                    <input type="text" name="cardNumber" placeholder="Card Number" className="w-full" />
                    <input type="text" name="expiryDate" placeholder="Expiry Date" className="w-full" />
                    <input type="text" name="cvv" placeholder="CVV" className="w-full" />
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </form>
            </Modal>
            <Modal show={confirmPurchase} onClose={() => setConfirmPurchase(false)}>
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
        </div>
    );
}

export default CourseDetails;
