import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt } from 'react-icons/fa';
import Header from '../headerComponents/Header';
import './EditProfile.css';

function EditProfile() {
    const { user, setUser } = useAuth();
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        profilePicture: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profilePicture: user.profilePicture,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfileData((prevData) => ({
            ...prevData,
            profilePicture: URL.createObjectURL(file),
            profilePictureFile: file, // Store the file separately for upload
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('firstName', profileData.firstName);
            formData.append('lastName', profileData.lastName);
            formData.append('email', profileData.email);
            if (profileData.profilePictureFile) {
                formData.append('profilePicture', profileData.profilePictureFile);
            }

            const response = await axios.post(`/api/auth/user/${user.id}/updateProfile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUser(response.data);
            alert('Profile updated successfully');
            navigate('/'); // Redirect to home or any other page after updating
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile');
        }
    };

    return (
        <div>
            <Header />
            <div className="edit-profile-container">
                <h2>Edit Profile</h2>
                <form onSubmit={handleSubmit} className="edit-profile-form" encType="multipart/form-data">
                    <div className="profile-picture-container">
                        <label htmlFor="profilePicture" className="profile-picture-label">
                            <img
                                src={profileData.profilePicture || 'default-profile-pic-url'}
                                alt="Profile"
                                className="profile-picture"
                            />
                            <FaPencilAlt className="edit-icon" />
                            <input
                                type="file"
                                id="profilePicture"
                                name="profilePicture"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                style={{ display: 'none' }} // Hide the actual file input
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="submit-button">Update Profile</button>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
