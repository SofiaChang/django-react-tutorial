import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth()
    });

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const response = await api.post('/api/token/refresh/', {
                refresh_token: refreshToken,
            });
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access_token);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error(error);
            setIsAuthorized(false);
            
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                await refreshToken();
            }
            setIsAuthorized(true);
        } catch (error) {
            console.error(error);
            setIsAuthorized(false);
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;

}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute