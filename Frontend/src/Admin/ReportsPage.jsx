import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./SideBar";  // Import the Sidebar component

const ReportsPage = () => {
  const [courseReports, setCourseReports] = useState([]);
  const [videoReports, setVideoReports] = useState([]);
  const [commentReports, setCommentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [courseResponse, videoResponse, commentResponse] = await Promise.all([
          axios.get("/api/reports/course"),
          axios.get("/api/reports/video"),
          axios.get("/api/reports/comment"),
        ]);

        setCourseReports(courseResponse.data);
        setVideoReports(videoResponse.data);
        setCommentReports(commentResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setError("Failed to fetch reports. Please try again later.");
        setLoading(false);
      }
    };

    fetchReports();
  }, []);


  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar /> {/* Add the Sidebar component */}

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Reports</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Course Reports</h2>
            <ul className="divide-y divide-gray-300">
              {courseReports.map((report) => (
                <li key={report.id} className="p-4">
                  <p><strong>Course ID:</strong> {report.courseId}</p>
                  <p><strong>Reported by:</strong> {report.reporterName}</p>
                  <p><strong>Reason:</strong> {report.reason}</p>
                  <p><strong>Date:</strong> {new Date(report.reportDate).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Video Reports</h2>
            <ul className="divide-y divide-gray-300">
              {videoReports.map((report) => (
                <li key={report.id} className="p-4">
                  <p><strong>Video ID:</strong> {report.videoId}</p>
                  <p><strong>Reported by:</strong> {report.reporterName}</p>
                  <p><strong>Reason:</strong> {report.reason}</p>
                  <p><strong>Date:</strong> {new Date(report.reportDate).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Comment Reports</h2>
            <ul className="divide-y divide-gray-300">
              {commentReports.map((report) => (
                <li key={report.id} className="p-4">
                  <p><strong>Comment ID:</strong> {report.commentId}</p>
                  <p><strong>Reported by:</strong> {report.reporterName}</p>
                  <p><strong>Reason:</strong> {report.reason}</p>
                  <p><strong>Date:</strong> {new Date(report.reportDate).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
