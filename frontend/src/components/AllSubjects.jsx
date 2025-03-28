import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdSubject } from "react-icons/md";
import { Spinner, Card, Table, Container, Alert, Button, Form } from "react-bootstrap";
import useAuth from "../auth/context/useAuth";
import { getAllSubjects ,updateSubject, deleteSubject } from "../api";

const AllSubjects = () => {
  const { user, token } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [editSubjectId, setEditSubjectId] = useState(null);
  const [editForm, setEditForm] = useState({ subjectID: "", name: "", passingMarks: "" });
  const navigate = useNavigate();

  const fetchSubjects = useCallback(async () => {
    if (!token) {
      setError("Please log in to view subjects.");
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const data = await getAllSubjects(token);
      setSubjects(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch subjects.");
      if (err.message.includes("Invalid token") || err.message.includes("Access Denied")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleEdit = (subject) => {
    setEditSubjectId(subject.subjectID); // Use subjectID instead of _id
    setEditForm({
      subjectID: subject.subjectID,
      name: subject.name,
      passingMarks: subject.passingMarks || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateSubject(editSubjectId, editForm, token); // Pass subjectID
      setSuccess("Subject updated successfully!");
      setEditSubjectId(null);
      fetchSubjects(); // Refresh the list
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(`Error updating subject: ${err.message}`);
    }
  };

  const handleDelete = async (subjectId) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await deleteSubject(subjectId, token); // Pass subjectID
        setSuccess("Subject deleted successfully!");
        fetchSubjects(); // Refresh the list
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(`Error deleting subject: ${err.message}`);
      }
    }
  };

  if (!user || !["teacher","admin" ,"superadmin"].includes(user.role)) return <div>Access Denied</div>;

  return (
    <Container className="mt-5">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-primary text-white text-center py-3">
          <h2 className="m-0 d-flex align-items-center justify-content-center">
            <MdSubject size={30} className="me-2" /> All Subjects
          </h2>
        </Card.Header>

        <Card.Body>
          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading subjects...</p>
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {!loading && !error && (
            <div className="table-responsive">
              <Table striped bordered hover className="text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Subject ID</th>
                    <th>Name</th>
                    <th>Passing Marks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <tr key={subject.subjectID}> {/* Use subjectID as key */}
                        {editSubjectId === subject.subjectID ? (
                          <>
                            <td>
                              <Form.Control
                                type="text"
                                value={editForm.subjectID}
                                onChange={(e) => setEditForm({ ...editForm, subjectID: e.target.value })}
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                value={editForm.passingMarks}
                                onChange={(e) => setEditForm({ ...editForm, passingMarks: e.target.value })}
                              />
                            </td>
                            <td>
                              <Button variant="success" size="sm" onClick={handleUpdate} className="me-2">
                                Save
                              </Button>
                              <Button variant="secondary" size="sm" onClick={() => setEditSubjectId(null)}>
                                Cancel
                              </Button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="fw-bold">{subject.subjectID}</td>
                            <td>{subject.name}</td>
                            <td>{subject.passingMarks || "N/A"}</td>
                            <td>
                              <Button
                                variant="warning"
                                size="sm"
                                onClick={() => handleEdit(subject)}
                                className="me-2"
                              >
                                Update
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(subject.subjectID)} // Use subjectID
                              >
                                Delete
                              </Button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No subjects found
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

export default AllSubjects;