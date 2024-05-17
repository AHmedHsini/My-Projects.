import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../CommenPages/headerComponents/Header";
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAmountDown, faSortAmountUp } from '@fortawesome/free-solid-svg-icons';

function PurchaseHistory() {
    const { user } = useAuth(); // Use the useAuth hook to get the user
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [sortOrder, setSortOrder] = useState("newest"); // State for sorting order

    useEffect(() => {
        if (user) {
            axios.get(`/api/Courses/purchase-history?userId=${user.id}`)
                .then(response => {
                    setPurchaseHistory(response.data);
                })
                .catch(error => {
                    console.error("There was an error fetching the purchase history!", error);
                });
        }
    }, [user]);

    const formatDateTime = (dateTime) => {
        const options = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: true,
        };
        return new Date(dateTime).toLocaleString('en-US', options);
    };

    const handleSortToggle = () => {
        setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
    };

    const sortedPurchaseHistory = [...purchaseHistory].sort((a, b) => {
        if (sortOrder === "newest") {
            return new Date(b.purchaseDate) - new Date(a.purchaseDate);
        } else {
            return new Date(a.purchaseDate) - new Date(b.purchaseDate);
        }
    });

    return (
        <div>
            <Header />
            <section
                style={{
                    backgroundImage: 'url("../assets/images/banner.png")',
                    width: "100%",
                    height: "800px", // Keep the height of the banner
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginTop: "1.75%",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div className="container p-4 bg-white bg-opacity-75 rounded-lg" style={{ maxHeight: "500px", overflowY: "scroll", textAlign: "center", position: "relative" }}>
                    <div style={{ position: "sticky", top: "0", backgroundColor: "rgba(255, 255, 255, 0.75)", zIndex: "1", padding: "8px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h1 className="text-3xl font-semibold text-gray-800">
                            Purchase History
                        </h1>
                        <FontAwesomeIcon
                            icon={sortOrder === "newest" ? faSortAmountDown : faSortAmountUp}
                            onClick={handleSortToggle}
                            className="text-blue-500 cursor-pointer"
                            size="lg"
                        />
                    </div>
                    {sortedPurchaseHistory.length > 0 ? (
                        <ul className="space-y-3">
                            {sortedPurchaseHistory.map((purchase) => (
                                <li key={purchase.courseId} className="p-3 border rounded-lg shadow-lg" style={{ maxWidth: "500px", margin: "0 auto" }}>
                                    {purchase.courseImage && (
                                        <img
                                            src={purchase.courseImage}
                                            alt={purchase.title}
                                            className="w-full h-24 object-cover rounded-lg mb-2"
                                        />
                                    )}
                                    <h2 className="text-lg font-bold text-gray-800 mb-1">
                                        {purchase.title}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1" style={{ lineHeight: '1.5' }}>
                                        {purchase.description}
                                    </p>
                                    <p className="text-sm text-gray-800 mt-1 font-semibold">
                                        Price: ${purchase.price}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Purchased on: {formatDateTime(purchase.purchaseDate)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500">You haven't purchased any courses yet.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default PurchaseHistory;
