import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaDatabase, FaStudiovinari } from "react-icons/fa6";
import { IoMdBookmarks } from "react-icons/io";
import { MdSubject } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";
import { PiStudentBold, PiNotebookBold } from "react-icons/pi";
import { AiOutlineFileSearch } from "react-icons/ai";
import SearchBar from "../../components/SearchBar";
import useAuth from "../../auth/context/useAuth";
import AddSubject from "../../components/AddSubject";
import { getStudentResult } from "../../api/marksApi";

const Card = ({ to, icon, title, onClick }) => (
  <div
    className="card text-center d-flex flex-column align-items-center justify-content-center"
    style={{
      width: "180px", // Larger size
      height: "180px", // Larger size
      textDecoration: "none",
      color: "black",
      padding: "15px", // Increased padding
      border: "1px solid #ddd", // Lighter border
      borderRadius: "10px", // Smoother corners
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Enhanced shadow
      marginBottom: "20px", // Increased margin
      cursor: "pointer",
      backgroundColor: "#fff", // Consistent background
      transition: "transform 0.2s, box-shadow 0.2s", // Smooth hover effects
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
          <div style={{ marginBottom: "10px" }}>{React.cloneElement(icon, { size: 60 })}</div>{" "}
          {/* Larger icon with spacing */}
          <span style={{ fontSize: "1.25rem", fontWeight: "500" }}>{title}</span> {/* Larger, bolder text */}
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

const TeacherDashboard = () => {
  const { user, token } = useAuth();
  const [subjectID, setSubjectID] = useState("");
  const [studentID, setStudentID] = useState("");
  const [studentDetailID, setStudentDetailID] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSubjectSearch, setShowSubjectSearch] = useState(false);
  const [showStudentSearch, setShowStudentSearch] = useState(false);
  const [showStudentDetailSearch, setShowStudentDetailSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubjectSearch = () => {
    if (!subjectID.trim()) {
      setError("Please enter a valid Subject ID.");
      return;
    }
    setError("");
    navigate(`/teacher/subjectmarks/${subjectID}`);
  };

  const handleStudentSearch = async () => {
    if (!studentID.trim()) {
      setError("Please enter a valid Student ID.");
      return;
    }
    setError("");
    try {
      const result = await getStudentResult(studentID, token);
      navigate(`/student/result/${studentID}`, { state: { result } });
    } catch (err) {
      setError(`Error fetching result: ${err.message}`);
      if (err.message.includes("Invalid token")) {
        navigate("/login");
      }
    }
  };

  const handleStudentDetailSearch = () => {
    if (!studentDetailID.trim()) {
      setError("Please enter a valid Student ID.");
      return;
    }
    setError("");
    navigate(`/teacher/studentdetails/${studentDetailID}`);
  };

  const handleAddSubject = (response) => {
    if (!token) {
      setError("Please log in to add a subject.");
      navigate("/login");
      return;
    }
    setSuccess("Subject added successfully");
    setShowModal(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  if (!user || user.role !== "teacher") return <div>Access Denied</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary">Teacher Dashboard</h1>
      <p>Welcome, {user?.name || "Teacher"}!</p>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* First Row: 5 Cards */}
      <div className="row justify-content-around mb-4">
        <div className="col-2">
          <Card
            icon={<FaStudiovinari />}
            title="Student Details"
            onClick={() => setShowStudentDetailSearch(!showStudentDetailSearch)}
          />
        </div>
        <div className="col-2">
          <Card to="/teacher/allstudents" icon={<FaDatabase />} title="All Students" />
        </div>
        <div className="col-2">
          <Card
            icon={<PiNotebookBold />}
            title="Add Subject"
            onClick={() => setShowModal(true)}
          />
        </div>
        <div className="col-2">
          <Card to="/teacher/allsubjects" icon={<MdSubject />} title="All Subjects" />
        </div>
        <div className="col-2">
          <Card
            icon={<IoBookSharp />}
            title="Subject Marks"
            onClick={() => setShowSubjectSearch(!showSubjectSearch)}
          />
        </div>
      </div>

      {/* Second Row: 3 Cards */}
      <div className="row justify-content-around mb-4">
        <div className="col-2">
          <Card to="/teacher/managemarks" icon={<IoMdBookmarks />} title="Manage Marks" />
        </div>
        <div className="col-2">
          <Card to="/teacher/allstudentsmarks" icon={<PiStudentBold />} title="Student Marks" />
        </div>
        <div className="col-2">
          <Card
            icon={<AiOutlineFileSearch />}
            title="Student Result"
            onClick={() => setShowStudentSearch(!showStudentSearch)}
          />
        </div>
        <div className="col-4"></div> {/* Empty space for layout */}
      </div>

      {showSubjectSearch && (
        <div>
          <SearchBar
            value={subjectID}
            onChange={(e) => setSubjectID(e.target.value)}
            onSearch={handleSubjectSearch}
            placeholder="Enter Subject ID to view marks"
          />
        </div>
      )}

      {showStudentSearch && (
        <div>
          <SearchBar
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
            onSearch={handleStudentSearch}
            placeholder="Enter Student ID to view result"
          />
        </div>
      )}

      {showStudentDetailSearch && (
        <div>
          <SearchBar
            value={studentDetailID}
            onChange={(e) => setStudentDetailID(e.target.value)} // Fixed bug
            onSearch={handleStudentDetailSearch}
            placeholder="Enter Student ID to view details (e.g., STD10001)"
          />
        </div>
      )}

      <AddSubject show={showModal} handleClose={() => setShowModal(false)} handleSuccess={handleAddSubject} />
    </div>
  );
};

export default TeacherDashboard;