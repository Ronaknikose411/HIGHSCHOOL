import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStudiovinari } from "react-icons/fa6";
import { Spinner, Card, Table, Container, Alert, Badge } from "react-bootstrap";
import { getStudentById } from "../api";
import useAuth from "../auth/context/useAuth";

const StudentDetails = () => {
  const { studentId } = useParams();
  const { user, token } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStudentDetails = useCallback(async () => {
    if (!token) {
      setError("Please log in to view student details.");
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const data = await getStudentById(studentId, token);
      setStudentData(data || null);
    } catch (err) {
      setError(err.message || "Failed to fetch student details.");
      if (err.message.includes("Invalid token") || err.message.includes("Access Denied")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [studentId, token, navigate]);

  useEffect(() => {
    fetchStudentDetails();
  }, [fetchStudentDetails]);

  if (!user || !["teacher","admin" ,"superadmin"].includes(user.role)) return <div>Access Denied</div>;

  return (
    <Container className="mt-5">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-primary text-white text-center py-3">
          <h2 className="m-0 d-flex align-items-center justify-content-center">
            <FaStudiovinari size={30} className="me-2" /> Student Details
          </h2>
        </Card.Header>

        <Card.Body>
          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading student details...</p>
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && studentData && (
            <>
              <h4 className="mb-3">Student Information</h4>
              <Table striped bordered hover className="text-center">
                <tbody>
                  <tr>
                    <td><strong>Student ID</strong></td>
                    <td>{studentData.student.studentId}</td>
                  </tr>
                  <tr>
                    <td><strong>Name</strong></td>
                    <td>{studentData.student.name}</td>
                  </tr>
                  <tr>
                    <td><strong>Email</strong></td>
                    <td>{studentData.student.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Age</strong></td>
                    <td>{studentData.student.age}</td>
                  </tr>
                </tbody>
              </Table>

              <h4 className="mb-3 mt-4">Marks</h4>
              <div className="table-responsive">
                <Table striped bordered hover className="text-center">
                  <thead className="table-dark">
                    <tr>
                      <th>Mark ID</th>
                      <th>Subject ID</th>
                      <th>Subject Name</th>
                      <th>Total Marks</th>
                      <th>Score</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.marks.length > 0 ? (
                      studentData.marks.map((mark) => (
                        <tr key={mark.markID}>
                          <td>{mark.markID}</td>
                          <td>{mark.subjectID}</td>
                          <td>{mark.subjectName}</td>
                          <td>{mark.totalMarks}</td>
                          <td>{mark.score}</td>
                          
                          <td>
                            <Badge bg={mark.status === "Pass" ? "success" : "danger"}>
                              {mark.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No marks found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Display Overall Percentage */}
              <h4 className="mb-3 mt-4">Overall Percentage</h4>
              <Table striped bordered hover className="text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Total Marks</th>
                    <th>Obtained Marks</th>
                    <th>Percentage</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{studentData.Percentage["total marks"]}</td>
                    <td>{studentData.Percentage.obtainedMarks}</td>
                    <td>
                      {studentData.Percentage.status === "Pending" ? (
                        <span className="text-danger">{studentData.Percentage.status}</span>
                      ) : (
                        studentData.Percentage.status
                      )}
                    </td>
                    <td>
                      {studentData.Percentage.missingSubjects.length > 0 ? (
                        <span>
                          Subject marks required for:{" "}
                          {studentData.Percentage.missingSubjects
                            .map((subject) => `${subject.subjectName} (${subject.subjectID})`)
                            .join(", ")}
                        </span>
                      ) : (
                        "All subjects completed"
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentDetails;