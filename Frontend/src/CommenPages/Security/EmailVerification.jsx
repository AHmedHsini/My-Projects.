import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EmailVerification() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('');
    const [countdown, setCountdown] = useState(3); // Countdown in seconds

    useEffect(() => {
        async function verifyEmail() {
            try {
                const response = await axios.get(`/api/verification/verify?token=${token}`);
                if (response.status === 200) {
                    // Email verified successfully
                    setVerificationStatus('Verified Successfully!');

                    const timeout = setTimeout(() => {
                        navigate('/login');
                    }, countdown * 1000);

                    return () => clearTimeout(timeout);
                } else {
                    // Verification failed
                    setVerificationStatus('Verification Failed. Please try again.');
                }
            } catch (error) {
                console.error('Error verifying email:', error);
                setVerificationStatus('An error occurred while verifying email. Please try again later.');
            }
        }

        verifyEmail();
    }, [token, navigate, countdown]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown === 1) {
                    clearInterval(timer);
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <p style={{ color: 'green', fontSize: '24px', marginBottom: '20px' }}>{verificationStatus}</p>
            <p style={{ fontSize: '18px' }}>{`Redirecting to login page in ${countdown} seconds...`}</p>
        </div>
    );
}

export default EmailVerification;
