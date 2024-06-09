import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './SideBar';

const AdminPurchaseHistory = () => {
    const [purchaseHistories, setPurchaseHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPurchaseHistories = async () => {
            try {
                const response = await axios.get('/api/admin/purchase-history');
                const histories = response.data;

                // Fetch educator names for each course in the purchase history
                const historiesWithEducators = await Promise.all(histories.map(async history => {
                    if (history.purchaseHistory.length > 0) {
                        const purchasesWithEducators = await Promise.all(history.purchaseHistory.map(async purchase => {
                            const courseResponse = await axios.get(`/api/Courses/${purchase.courseId}`);
                            const educatorName = courseResponse.data.educatorName;
                            return { ...purchase, educatorName };
                        }));
                        return { ...history, purchaseHistory: purchasesWithEducators };
                    }
                    return null; // Return null for users with no purchase history
                }));

                // Filter out null values (users with no purchase history)
                const filteredHistories = historiesWithEducators.filter(history => history !== null);

                // Sort purchases by date (newest to oldest)
                filteredHistories.forEach(history => {
                    history.purchaseHistory.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
                });

                setPurchaseHistories(filteredHistories);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch purchase histories:', error);
                setError('Failed to fetch purchase histories. Please try again later.');
                setLoading(false);
            }
        };

        fetchPurchaseHistories();
    }, []);

    const formatDateTime = (dateTimeString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return new Date(dateTimeString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="flex min-h-screen bg-gray-200">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="text-4xl font-bold mb-8 text-center">All Users' Purchase Histories</h1>
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : purchaseHistories.length === 0 ? (
                    <p className="text-center text-gray-500">No purchase histories available.</p>
                ) : (
                    purchaseHistories.map((history, index) => (
                        <div key={index} className="max-w-2xl mx-auto bg-white p-4 rounded shadow mb-4">
                            <h2 className="text-xl font-bold mb-2">{history.userName}</h2>
                            <ul>
                                {history.purchaseHistory.map((purchase, idx) => (
                                    <li key={idx} className="border-b py-2">
                                        <h3 className="text-lg font-semibold">{purchase.courseTitle}</h3>
                                        <p className="text-gray-500">
                                            Purchased on: {formatDateTime(purchase.purchaseDate)}
                                        </p>
                                        <p className="text-gray-500">
                                            Educator: {purchase.educatorName}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPurchaseHistory;
