import React from 'react';
import { Navigate,} from 'react-router-dom';
import { useAuth } from './Contexts/AuthContext';
import AuthPage  from '../components/Auth/AuthPage';
// import HomePage from './Home/HomePage';

const PrivateRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Navigate to="/home" /> : <AuthPage />;
};

export default PrivateRoute;
