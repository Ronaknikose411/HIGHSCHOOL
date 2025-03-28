import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Result = ({ result }) => {
    const status = result.status ? result.status.toLowerCase() : "";

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-lg border-0 rounded-4 p-4 text-center" style={{ width: "100%", maxWidth: "500px", backgroundColor: "#f9f9f9" }}>
                
                
               
                
                {/* Display congratulatory or sorry message at the top */}
                {result.marks && result.marks.length > 0 ? (
                    <>
                        {status === "pass" && (
                            <div className="alert alert-success fw-bold d-flex align-items-center justify-content-center gap-2 fs-5 shadow-sm">
                                <FaCheckCircle className="text-success fs-3" />
                                <span>Congratulations, {result.name || "Student"}! 🎉</span>
                            </div>
                        )}
                        {status === "fail" && (
                            <div className="alert alert-danger fw-bold d-flex align-items-center justify-content-center gap-2 fs-5 shadow-sm">
                                <FaTimesCircle className="text-danger fs-3" />
                                <span>Sorry, {result.name || "Student"}!</span>
                            </div>
                        )}
                         <hr className="mb-3" />
                        <h2 className="fw-bold text-dark mt-3">Exam Results</h2>
                    </>
                ) : (
                    <div className="alert alert-warning">
                        <strong>Your result has not been generated.</strong>
                    </div>
                )}

                <p className="fs-5"><strong>Name:</strong> {result.name || "N/A"}</p>
                <p className="fs-5"><strong>Marks:</strong> {result.obtainedMarks || "N/A"}</p>
                <p className="fs-5"><strong>Percentage:</strong> {result.percentage ? `${result.percentage}%` : "N/A"}</p>
                <p className="fs-5">
                    <strong>Status:</strong>
                    <span className={`badge ${status === "pass" ? "bg-success" : "bg-danger"} ms-2 fs-6`}>
                        {result.status || "N/A"}
                    </span>
                </p>

                {/* Conditional rendering for subject-wise marks */}
                {result.marks && result.marks.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-primary fw-bold mb-3">Subject-wise Marks</h4>
                        <ul className="list-group">
                            {result.marks.map((mark, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center fs-5">
                                    <span>{mark.subject}</span>
                                    <span className="badge bg-info fs-6">{mark.score}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Result;
