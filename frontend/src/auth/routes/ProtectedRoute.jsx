import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";


const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;