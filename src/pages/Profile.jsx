import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Contaner } from '../components';
import { getCurrentUser } from '../features/auth/authThunks';

function Profile() {
    const { userData } = useSelector(getCurrentUser);
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    // The AuthLayout should prevent this, but as a fallback:
    if (!userData) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="w-full py-8">
            <Contaner>
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
                    <div className="text-center">
                        <img
                            src={userData.avatar || defaultAvatar}
                            alt="User Avatar"
                            className="w-32 h-32 rounded-full mx-auto border-4 border-primary"
                        />
                        <h1 className="text-3xl font-bold text-dark mt-4">{userData.name}</h1>
                        <p className="text-lg text-gray-500 mt-2">{userData.email}</p>
                    </div>
                </div>
            </Contaner>
        </div>
    );
}

export default Profile;