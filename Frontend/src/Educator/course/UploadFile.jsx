import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

function UploadFile() {
    const { courseId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState('');
    const [fileTitle, setFileTitle] = useState('');
    const [fileDescription, setFileDescription] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        const fileExtension = file.name.split('.').pop().toUpperCase();
        setFileType(fileExtension);
    };

    const handleTitleChange = (event) => {
        setFileTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setFileDescription(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile || !fileTitle || !fileDescription) {
            toast.error('Please provide file, title, and description.');
            return;
        }

        // Create FormData object
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', fileType);
        formData.append('title', fileTitle);
        formData.append('description', fileDescription);
        formData.append('educator', user.id); // Include educator ID as a form data field

        try {
            await axios.post(`/api/Courses/${courseId}/upload-file`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('File uploaded successfully!');
            navigate(`/educator/course/${courseId}`);
        } catch (error) {
            toast.error('Failed to upload file.');
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-6">Upload File</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="file" className="block text-lg font-medium mb-1">
                        File:
                    </label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        accept="*"
                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="title" className="block text-lg font-medium mb-1">
                        File Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={fileTitle}
                        onChange={handleTitleChange}
                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-lg font-medium mb-1">
                        File Description:
                    </label>
                    <textarea
                        id="description"
                        value={fileDescription}
                        onChange={handleDescriptionChange}
                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    ></textarea>
                </div>
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
                    Upload
                </button>
            </form>
        </div>
    );
}

export default UploadFile;
