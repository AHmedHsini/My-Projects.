import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/api/reports");
        setReports(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setError("Failed to fetch reports. Please try again later.");
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Reports
      </h2>
      <ul className="divide-y divide-gray-300">
        {reports.map((report) => (
          <li key={report.id} className="p-4">
            <p><strong>Course ID:</strong> {report.courseId}</p>
            <p><strong>Reported by User ID:</strong> {report.reporterId}</p>
            <p><strong>Reason:</strong> {report.reason}</p>
            <p><strong>Date:</strong> {new Date(report.reportDate).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reports;
