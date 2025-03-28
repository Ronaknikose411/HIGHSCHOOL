import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Table, Container, Alert, Button, Modal, Form } from "react-bootstrap";
import { getAllStudents, updateStudent, deleteStudent } from "../api/studentApi"; // Adjust path
import useAuth from "../auth/context/useAuth";

const AllStudents = () => {
  const { user, token } = useAuth();
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Added for success messages
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  const fetchStudents = useCallback(async () => {
    if (!token) {
      setError("Please log in to view students.");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const data = await getAllStudents(token);
      setStudents(data.students || []);
    } catch (err) {
      setError(`Error fetching students: ${err.message}`);
      if (err.message.includes("Invalid token")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const updatedData = {
        name: selectedStudent.name,
        email: selectedStudent.email,
        age: selectedStudent.age,
      };
      const response = await updateStudent(selectedStudent.studentId, updatedData, token);
      setSuccess(response.message || "Student updated successfully");
      setShowEditModal(false);
      fetchStudents(); // Refresh student list
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update student");
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm(`Are you sure you want to delete student ${studentId}?`)) return;
    try {
      setError("");
      const response = await deleteStudent(studentId, token);
      setSuccess(response.message || "Student deleted successfully");
      fetchStudents(); // Refresh student list
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete student");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const allowedRoles = ["teacher", "admin", "superadmin"];
  const canEditDelete = ["admin", "superadmin"].includes(user?.role); // Only admin/superadmin can edit/delete
  if (!user || !allowedRoles.includes(user.role)) return <div>Access Denied</div>;

  return (
    <Container className="mt-5">
      <h1>All Students</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading students...</p>
        </div>
      ) : students.length > 0 ? (
        <Table striped bordered hover responsive className="text-center">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th> {/* Added age column */}
              {canEditDelete && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.studentId}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.age}</td>
                {canEditDelete && (
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditClick(student)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteStudent(student.studentId)}
                    >
                      Delete
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-muted">No students found.</p>
      )}

      {/* Edit Student Modal */}
      {selectedStudent && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Student: {selectedStudent.studentId}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleUpdateStudent}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedStudent.name}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={selectedStudent.email}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={selectedStudent.age}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Update Student
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default AllStudents;