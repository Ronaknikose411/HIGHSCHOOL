import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoBookSharp } from "react-icons/io5";
import { PiStudentBold } from "react-icons/pi";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdSubject } from "react-icons/md";
import { FaBook } from "react-icons/fa6";
import SearchBar from "../../components/SearchBar";
import useAuth from "../../auth/context/useAuth";
import { getStudentResult } from "../../api/marksApi";

const Card = ({ to, icon, title, onClick }) => (
  <div
    className="card text-center d-flex flex-column align-items-center justify-content-center"
    style={{
      width: "180px",
      height: "180px",
      textDecoration: "none",
      color: "black",
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      marginBottom: "20px",
      cursor: "pointer",
      backgroundColor: "#fff",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    }}
  >
    {to ? (
      <Link to={to} style={{ color: "inherit", textDecoration: "none", width: "100%", height: "100%" }}>
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100%" }}>
          <div style={{ marginBottom: "10px" }}>{React.cloneElement(icon, { size: 60 })}</div>
          <span style={{ fontSize: "1.25rem", fontWeight: "500" }}>{title}</span>
        </div>
      </Link>
    ) : (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100%" }}>
        <div style={{ marginBottom: "10px" }}>{React.cloneElement(icon, { size: 60 })}</div>
        <span style={{ fontSize: "1.25rem", fontWeight: "500" }}>{title}</span>
      </div>
    )}
  </div>
);

const StudentDashboard = () => {
  const { user, token } = useAuth();
  const [studentID, setStudentID] = useState(user?.id || ""); // Pre-fill with user's ID
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Now used
  const [showResultSearch, setShowResultSearch] = useState(false);
  const navigate = useNavigate();

  const handleResultSearch = async () => {
    if (!studentID.trim()) {
      setError("Please enter a valid Student ID.");
      return;
    }
    setError("");
    try {
      const result = await getStudentResult(studentID, token);
      setSuccess("Results fetched successfully!"); // Use setSuccess
      navigate(`/student/result/${studentID}`, { state: { result } });
      setTimeout(() => setSuccess(""), 3000); // Clear success message after 3 seconds
    } catch (err) {
      setError(`Error fetching result: ${err.message}`);
      if (err.message.includes("Invalid token")) {
        navigate("/login");
      }
    }
  };

  if (!user || user.role !== "student") return <div className="container mt-5 text-center">Access Denied</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary">Student Dashboard</h1>
      <p>Welcome, {user?.name || "Student"}!</p>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Cards Section */}
      <div className="row justify-content-around mb-4">
        <div className="col-2">
          <Card
            icon={<AiOutlineFileSearch />}
            title="View Results"
            onClick={() => setShowResultSearch(!showResultSearch)}
          />
        </div>
        <div className="col-2">
          <Card to="/student/subjects" icon={<MdSubject />} title="Subjects" />
        </div>
        <div className="col-2">
          <Card to="/student/resources" icon={<IoBookSharp />} title="Resources" />
        </div>
        <div className="col-2">
          <Card to="/student/profile" icon={<PiStudentBold />} title="Profile" />
        </div>
        <div className="col-2">
          <Card to="/student/assignments" icon={<FaBook />} title="Assignments" />
        </div>
      </div>

      {/* Search Bar for Viewing Results */}
      {showResultSearch && (
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <SearchBar
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
              onSearch={handleResultSearch}
              placeholder="Enter your Student ID to view results"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;