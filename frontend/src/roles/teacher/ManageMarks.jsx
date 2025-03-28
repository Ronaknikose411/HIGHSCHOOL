import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container, Spinner } from "react-bootstrap";
import { addMarks, getAllSubjects, getAllStudents } from "../../api";
import useAuth from "../../auth/context/useAuth";

const ManageMarks = () => {
  const { user, token } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [score, setScore] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSubjects = useCallback(async () => {
    if (!token) {
      setError("Please log in to manage marks.");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const data = await getAllSubjects(token);
      if (!Array.isArray(data) || data.length === 0) {
        setError("No subjects available. Please add subjects first.");
        setSubjects([]);
      } else {
        setSubjects(data);
        setSelectedSubject(data[0].subjectID);
      }
    } catch (err) {
      setError(`Error fetching subjects: ${err.message}`);
      if (err.message.includes("Invalid token") || err.message.includes("Access Denied")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  const fetchStudents = useCallback(async () => {
    if (!token) {
      setError("Please log in to manage marks.");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const data = await getAllStudents(token);
      const studentList = data.students; // Extract the students array
      if (!Array.isArray(studentList) || studentList.length === 0) {
        setError("No students available. Please add students first.");
        setStudents([]);
      } else {
        setStudents(studentList);
        setSelectedStudent(studentList[0].studentId); // Set default student
      }
    } catch (err) {
      setError(`Error fetching students: ${err.message}`);
      setStudents([]); // Fallback to empty array on error
      if (err.message.includes("Invalid token") || err.message.includes("Access Denied")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchSubjects();
    fetchStudents();
  }, [fetchSubjects, fetchStudents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Please log in to add marks.");
      navigate("/login");
      return;
    }
    if (!selectedSubject) {
      setError("Please select a subject.");
      return;
    }
    if (!selectedStudent) {
      setError("Please select a student.");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const marksData = { studentId: selectedStudent, score: Number(score) };
      await addMarks(selectedSubject, marksData, token);
      setSuccess("Marks added successfully!");
      setSelectedStudent(""); // Reset to empty for next selection
      setScore("");
      setTimeout(() => setSuccess(""), 1000);
    } catch (err) {
      if (err.message.includes("Mark already added") || err.message.includes("Duplicate")) {
        setError("Marks already exist for this student and subject. Please update instead.");
      } else {
        setError(`Error adding marks: ${err.message}`);
        if (err.message.includes("Invalid token") || err.message.includes("Access Denied")) {
          navigate("/login");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user || !["teacher", "superadmin"].includes(user.role)) return <div>Access Denied</div>;

  return (
    <Container className="mt-5">
      <h1>Manage Marks</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading...</p>
        </div>
      )}

      {!loading && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="subjectSelect" className="mb-3">
            <Form.Label>Select Subject</Form.Label>
            <Form.Control
              as="select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
              disabled={subjects.length === 0}
            >
              <option value="">Select a subject</option>
              {Array.isArray(subjects) && subjects.length > 0 ? (
                subjects.map((subject) => (
                  <option key={subject._id} value={subject.subjectID}>
                    {`${subject.subjectID} (${subject.name})`}
                  </option>
                ))
              ) : (
                <option value="" disabled>No subjects available</option>
              )}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="studentSelect" className="mb-3">
            <Form.Label>Select Student</Form.Label>
            <Form.Control
              as="select"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
              disabled={students.length === 0}
            >
              <option value="">Select a student</option>
              {Array.isArray(students) && students.length > 0 ? (
                students.map((student) => (
                  <option key={student._id} value={student.studentId}>
                    {`${student.studentId} - ${student.name}`}
                  </option>
                ))
              ) : (
                <option value="" disabled>No students available</option>
              )}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="score" className="mb-3">
            <Form.Label>Score</Form.Label>
            <Form.Control
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="Enter score (0-100)"
              min="0"
              max="100"
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading || !selectedSubject || !selectedStudent}
          >
            {loading ? "Adding..." : "Add Marks"}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default ManageMarks;