import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";


const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (user) return <Navigate to={`/${user.role}/dashboard`} />;
    return children;
};

export default PublicRoute;