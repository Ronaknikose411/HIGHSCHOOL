import React from "react";
import useAuth from "../../auth/context/useAuth";


const ManageStudent = () => {
    const { user } = useAuth();

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-primary">Manage Profile</h1>
            <p>Welcome, {user.name}! Update your profile here (student view).</p>
        </div>
    );
};

export default ManageStudent;