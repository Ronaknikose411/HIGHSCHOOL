import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../auth/context/useAuth";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">Student Portal</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    {user?.role === "student" && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/student/dashboard">Dashboard</Link>
                        </li>
                    )}
                    {user?.role === "teacher" && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/teacher/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/teacher/managemarks">Manage Marks</Link>
                            </li>
                        </>
                    )}
                    {user?.role === "admin" && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
                            </li>
                         
                        </>
                    )}
                    {user?.role === "superadmin" && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/superadmin/dashboard">Dashboard</Link>
                        </li>
                    )}
                </ul>
                <div className="ms-auto">
                    {user ? (
                        <>
                            <span className="me-3">{user.name}</span> {/* Display user's name */}
                            <button className="btn btn-outline-danger" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link className="btn btn-outline-primary" to="/login">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
