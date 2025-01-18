import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Voters = () => {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const voterId = localStorage.getItem('voter_id');
            try {
                const response = await fetch(`http://localhost:3000/voters/${voterId}`);
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                localStorage.removeItem('voter_id');
                navigate('/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div>
            <h1>Voters Page</h1>
            <p>Welcome to the Voters page.</p>
            {userInfo && (
                <div>
                    <h2>User Information</h2>
                    <p>Voter ID: {userInfo.voter_id}</p>
                    <p>Metamask ID: {userInfo.metamask_id}</p>
                </div>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Voters;