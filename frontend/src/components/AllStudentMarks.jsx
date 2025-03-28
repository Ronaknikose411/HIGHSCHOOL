import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { PiStudentBold } from "react-icons/pi";


import { Spinner, Card, Table, Container, Alert, Badge } from "react-bootstrap";
import useAuth from "../auth/context/useAuth";
import { getAllMarks } from "../api";

const AllStudentMarks = () => {
  const { user, token } = useAuth(); // Use token directly
  const [marksData, setMarksData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Added for redirection

  const fetchMarks = useCallback(async () => {
    if (!token) {
      setError("Please log in to view student marks.");
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const data = await getAllMarks(token); // Use token directly
      setMarksData(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch student marks.");
      if (err.message.includes("Invalid token") || err.message.includes("Access Denied")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchMarks();
  }, [fetchMarks]);

  const processedMarksData = useMemo(() => {
    return marksData.map((student) => ({
      ...student,
      percentage: !isNaN(student.percentage) ? Number(student.percentage).toFixed(2) : "N/A",
    }));
  }, [marksData]);

  if (!user || !["teacher","admin", "superadmin"].includes(user.role)) return <div>Access Denied</div>;

  return (
    <Container className="mt-5">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-primary text-white text-center py-3">
          <h2 className="m-0 d-flex align-items-center justify-content-center">
            <PiStudentBold size={30} className="me-2" /> All Student Marks
          </h2>
        </Card.Header>

        <Card.Body>
          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading student marks...</p>
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && (
            <div className="table-responsive">
              <Table striped bordered hover className="text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Obtained Marks</th>
                    <th>Percentage</th>
                    <th>Status</th>
                    <th>Marks Details</th>
                  </tr>
                </thead>
                <tbody>
                  {processedMarksData.length > 0 ? (
                    processedMarksData.map((student) => (
                      <tr key={student.studentId}>
                        <td className="fw-bold">{student.studentId}</td>
                        <td>{student.name}</td>
                        <td className="fw-bold">{student.obtainedMarks}</td>
                        <td className="text-primary">{student.percentage}%</td>
                        <td>
                          <Badge bg={student.status === "Pass" ? "success" : "danger"}>
                            {student.status}
                          </Badge>
                        </td>
                        <td>
                          <ul className="list-unstyled text-start mb-0">
                            {student.marks.map((mark, index) => (
                              <li key={index} className="border-bottom py-1">
                                <strong>{mark.subject}:</strong> {mark.score}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AllStudentMarks;