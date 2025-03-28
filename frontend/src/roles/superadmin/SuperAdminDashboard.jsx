import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getStudentResult } from "../../api/marksApi";
import { createStudent } from "../../api/studentApi";
import {
  addAdmin,
  createTeacher,
} from "../../api/superadminApi"; // Only keep add functions
import useAuth from "../../auth/context/useAuth";
import { FaDatabase, FaStudiovinari } from "react-icons/fa6";
import { MdSubject } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";
import { PiStudentBold } from "react-icons/pi";
import { AiOutlineFileSearch } from "react-icons/ai";
import { IoMdPersonAdd } from "react-icons/io";
import { GrUserExpert } from "react-icons/gr";
import { PiAirTrafficControlBold } from "react-icons/pi";
import { FaStarOfLife } from "react-icons/fa";
import SearchBar from "../../components/SearchBar";
import AddStudent from "../../components/AddStudent";
import AddTeacher from "../../components/AddTeacher";

// Card Component
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

const SuperadminDashboard = () => {
  const { user, token} = useAuth();
  const navigate = useNavigate();
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
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  // Admin Functions
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
      if (err.message.includes("Invalid token")) navigate("/login");
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

  // Superadmin Functions (only add functions)
  const handleAddAdmin = async (adminData) => {
    if (!token) {
      setError("Please log in to add an admin.");
      navigate("/login");
      return;
    }
    try {
      const response = await addAdmin(adminData, token);
      setSuccess(response.message || "Admin added successfully");
      setShowAddAdminModal(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to add admin");
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

  // Add Admin Form (Modal)
  const AddAdminForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFormSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Admin</h5>
              <button className="btn-close" onClick={onCancel}></button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Name</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Email</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Add</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (!user || user.role !== "superadmin") return <div>Access Denied</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary">Superadmin Dashboard</h1>
      <p>Welcome, {user?.name || "Superadmin"}!</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* First Row: Admin Features */}
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
            icon={<IoMdPersonAdd />}
            title="Add Student"
            onClick={() => setShowAddStudentModal(true)}
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

      {/* Second Row: Mixed Admin and Superadmin Features */}
      <div className="row justify-content-around mb-4">
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
        <div className="col-2">
          <Card
            icon={<PiAirTrafficControlBold />}
            title="Add Admin"
            onClick={() => setShowAddAdminModal(true)}
          />
        </div>
      
        <div className="col-2">
          <Card
            icon={<GrUserExpert />}
            title="Add Teacher"
            onClick={() => setShowAddTeacherModal(true)}
          />
        </div>  <div className="col-2">
          <Card
            to="/superadmin/viewall"
            icon={<FaStarOfLife />}
            title="View All"
          />
        </div>
      </div>

      {/* Search Bars */}
      {showSubjectSearch && (
        <div className="mb-4">
          <SearchBar
            value={subjectID}
            onChange={(e) => setSubjectID(e.target.value)}
            onSearch={handleSubjectSearch}
            placeholder="Enter Subject ID to view marks"
          />
        </div>
      )}
      {showStudentSearch && (
        <div className="mb-4">
          <SearchBar
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
            onSearch={handleStudentSearch}
            placeholder="Enter Student ID to view result"
          />
        </div>
      )}
      {showStudentDetailSearch && (
        <div className="mb-4">
          <SearchBar
            value={studentDetailID}
            onChange={(e) => setStudentDetailID(e.target.value)}
            onSearch={handleStudentDetailSearch}
            placeholder="Enter Student ID to view details (e.g., STD10001)"
          />
        </div>
      )}

      {/* Modals */}
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
      {showAddAdminModal && (
        <AddAdminForm
          onSubmit={handleAddAdmin}
          onCancel={() => setShowAddAdminModal(false)}
        />
      )}

   
    </div>
  );
};

export default SuperadminDashboard;