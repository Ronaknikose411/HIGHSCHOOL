import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoBookSharp } from "react-icons/io5";
import { Modal, Button, Alert, Spinner, Table, Container } from "react-bootstrap";
import { getSubjectMarks, updateMarks, deleteMarks } from "../api";
import useAuth from "../auth/context/useAuth";

const SubjectMarks = () => {
  const { subjectID } = useParams();
  const { user, token } = useAuth();
  const [marks, setMarks] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedMark, setSelectedMark] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  const fetchMarks = useCallback(async () => {
    if (!token) {
      showAlert("Please log in to view marks.", "danger");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const data = await getSubjectMarks(subjectID, token);
      setMarks(data.marks || []);
      setSubjectName(data.subjectName || "Unknown Subject");
    } catch (err) {
      showAlert(err.message || "Failed to fetch marks", "danger");
      if (err.message.includes("Invalid token") || err.message.includes("Access Denied")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [subjectID, token, navigate]);

  useEffect(() => {
    fetchMarks();
  }, [fetchMarks]);

  const showAlert = (message, variant) => {
    const newAlert = { message, variant };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert !== newAlert));
    }, 5000);
  };

  const handleUpdate = useCallback((mark) => {
    setSelectedMark(mark);
    setShowUpdateModal(true);
  }, []);

  const handleDelete = useCallback(
    async (mark) => {
      const confirmDelete = window.confirm(`Are you sure you want to delete marks for ${mark.name}?`);
      if (confirmDelete) {
        try {
          await deleteMarks(subjectID, mark.studentId, token);
          showAlert(`Marks for ${mark.name} deleted successfully.`, "success");
          fetchMarks();
        } catch (err) {
          showAlert(err.message || "Failed to delete marks", "danger");
          if (err.message.includes("Invalid token")) {
            navigate("/login");
          }
        }
      }
    },
    [token, subjectID, fetchMarks, navigate]
  );

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const newScore = Number(e.target.score.value);
    try {
      const marksData = { studentId: selectedMark.studentId, score: newScore };
      await updateMarks(subjectID, marksData, token); // Use subjectID and studentId as per API
      showAlert(`Marks for ${selectedMark.name} updated successfully.`, "success");
      fetchMarks();
      setShowUpdateModal(false);
    } catch (err) {
      if (err.message.includes("Duplicate markID detected")) {
        showAlert("Error: Duplicate mark detected. Please try again or contact support.", "danger");
      } else {
        showAlert(err.message || "Failed to update marks", "danger");
        if (err.message.includes("Invalid token")) {
          navigate("/login");
        }
      }
    }
  };

  const memoizedRows = useMemo(() => {
    return marks.map((mark) => (
      <tr key={mark.studentId}>
        <td>{mark.studentId}</td>
        <td>{mark.name}</td>
        <td>{mark.score}</td>
        <td className="text-center">
          <Button onClick={() => handleUpdate(mark)} variant="outline-warning" size="sm">
            ✏ Update
          </Button>
          <Button onClick={() => handleDelete(mark)} variant="outline-danger" size="sm" className="ms-2">
            🗑 Delete
          </Button>
        </td>
      </tr>
    ));
  }, [marks, handleUpdate, handleDelete]);

  if (!user || !["teacher", "admin","superadmin"].includes(user.role)) return <div>Access Denied</div>;

  return (
    <Container className="mt-5">
      <h1 className="mb-4 text-primary d-flex align-items-center">
        <IoBookSharp size={35} className="me-2" /> {subjectName} Marks
      </h1>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading marks...</p>
        </div>
      ) : marks.length > 0 ? (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark text-center">
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">{memoizedRows}</tbody>
        </Table>
      ) : (
        <Alert variant="warning" className="text-center">
          No marks found for this subject.
        </Alert>
      )}

      <div className="mt-3">
        {alerts.map((alert, index) => (
          <Alert key={index} variant={alert.variant} className="text-center">
            {alert.message}
          </Alert>
        ))}
      </div>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Marks for {selectedMark?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateSubmit}>
            <div className="mb-3">
              <label htmlFor="score" className="form-label">
                New Score
              </label>
              <input
                type="number"
                id="score"
                name="score"
                defaultValue={selectedMark?.score}
                className="form-control"
                required
                min="0"
                max="100"
              />
            </div>
            <div className="text-end">
              <Button type="submit" variant="primary">
                Update
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SubjectMarks;