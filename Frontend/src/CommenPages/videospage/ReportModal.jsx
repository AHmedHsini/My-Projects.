import React, { useState } from 'react';

const ReportModal = ({ show, onClose, onSubmit }) => {
    const [reportReason, setReportReason] = useState("");

    const handleSubmit = () => {
        onSubmit(reportReason);
        setReportReason("");
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
                <h3 className="text-lg font-bold mb-4">Report</h3>
                <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Describe the issue..."
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    rows="4"
                />
                <div className="flex justify-end">
                    <button onClick={onClose} className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
