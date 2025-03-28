import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaDatabase, FaStudiovinari } from "react-icons/fa6";
import { MdSubject } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";
import { PiStudentBold } from "react-icons/pi";
import { AiOutlineFileSearch } from "react-icons/ai";
import { IoMdPersonAdd } from "react-icons/io";
import { GrUserExpert } from "react-icons/gr";
import { FaStarOfLife } from "react-icons/fa"; // Added for "View All"
import SearchBar from "../../components/SearchBar";
import AddStudent from "../../components/AddStudent";
import AddTeacher from "../../components/AddTeacher";
import useAuth from "../../auth/context/useAuth";
import { getStudentResult } from "../../api/marksApi";
import { createStudent } from "../../api/studentApi";
import { createTeacher } from "../../api/superadminApi";

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

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [subjectID, setSubjectID] = useState("");
  const [studentID, setStudentID] = useState("");
  const [studentDetailID, setStudentDetailID] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSubjectSearch, setShowSubjectSearch] = useState(false);
  const [showStudentSearch, setShowStudentSearch] = useState(false);
  const [showStudentDetailSearch, setShowStudentDetailSearch] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
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

  const handleAddStudent = async (studentData) => {
    if (!token) {
      setError("Please log in to add a student.");
      navigate("/login");
      return;
    }
    try {
      const response = await createStudent(studentData, token);
      setSuccess(response.message || "Student added successfully");
      setShowAddStudentModal(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to add student");
    }
  };

  const handleAddTeacher = async (teacherData) => {
    if (!token) {
      setError("Please log in to add a teacher.");
      navigate("/login");
      return;
    }
    try {
      const response = await createTeacher(teacherData, token);
      setSuccess(response.message || "Teacher added successfully");
      setShowAddTeacherModal(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to add teacher");
    }
  };

  if (!user || user.role !== "admin") return <div>Access Denied</div>;

  // Define all cards in an array
  const cards = [
    {
      icon: <FaStudiovinari />,
      title: "Student Details",
      onClick: () => setShowStudentDetailSearch(!showStudentDetailSearch),
    },
    {
      to: "/teacher/allstudents",
      icon: <FaDatabase />,
      title: "All Students",
    },
    {
      icon: <IoMdPersonAdd />,
      title: "Add Student",
      onClick: () => setShowAddStudentModal(true),
    },
    {
      to: "/teacher/allsubjects",
      icon: <MdSubject />,
      title: "All Subjects",
    },
    {
      icon: <IoBookSharp />,
      title: "Subject Marks",
      onClick: () => setShowSubjectSearch(!showSubjectSearch),
    },
    {
      to: "/teacher/allstudentsmarks",
      icon: <PiStudentBold />,
      title: "Student Marks",
    },
    {
      icon: <AiOutlineFileSearch />,
      title: "Student Result",
      onClick: () => setShowStudentSearch(!showStudentSearch),
    },
    {
      icon: <GrUserExpert />,
      title: "Add Teacher",
      onClick: () => setShowAddTeacherModal(true),
    },
    {
      to: "/superadmin/viewall", // Same route, but role-based rendering in ViewAllAdminsAndTeachers will handle visibility
      icon: <FaStarOfLife />,
      title: "View All",
    },
  ];

  // Group cards into rows of 5
  const rows = [];
  for (let i = 0; i < cards.length; i += 5) {
    rows.push(cards.slice(i, i + 5));
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary">Admin Dashboard</h1>
      <p>Welcome, {user?.name || "Admin"}!</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Render rows dynamically */}
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="row justify-content-around mb-4">
          {row.map((card, index) => (
            <div key={index} className="col-2">
              <Card
                to={card.to}
                icon={card.icon}
                title={card.title}
                onClick={card.onClick}
              />
            </div>
          ))}
          {/* Fill remaining columns if less than 5 cards in the last row */}
          {row.length < 5 &&
            Array.from({ length: 5 - row.length }).map((_, index) => (
              <div key={`empty-${index}`} className="col-2"></div>
            ))}
        </div>
      ))}

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
            onChange={(e) => setStudentDetailID(e.target.value)}
            onSearch={handleStudentDetailSearch}
            placeholder="Enter Student ID to view details (e.g., STD10001)"
          />
        </div>
      )}

      <AddStudent
        show={showAddStudentModal}
        handleClose={() => setShowAddStudentModal(false)}
        handleSuccess={handleAddStudent}
      />
      <AddTeacher
        show={showAddTeacherModal}
        handleClose={() => setShowAddTeacherModal(false)}
        handleSuccess={handleAddTeacher}
      />
    </div>
  );
};

export default AdminDashboard;