import React, { useState, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


import useAuth from "../auth/context/useAuth";
import { addSubject } from "../api";

const AddSubject = ({ show, handleClose, handleSuccess }) => {
  const { user, token } = useAuth();
  const [subjectName, setSubjectName] = useState("");
  const [passingMarks, setPassingMarks] = useState("");
  const [error, setError] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added to prevent double submission
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return; // Prevent double submission
      setError("");
      setIsSubmitting(true);

      if (!token) {
        setError("Please log in to add a subject.");
        navigate("/login");
        return;
      }

      try {
        const subjectData = {
          name: subjectName,
          passingMarks: Number(passingMarks),
        };
        const response = await addSubject(subjectData, token); // Call API here
        handleSuccess(response); // Pass the API response to parent
        setAlertVisible(true);
        handleClose();

        setSubjectName("");
        setPassingMarks("");

        setTimeout(() => {
          setAlertVisible(false);
        }, 2000);
      } catch (err) {
        setError(err.message || "Failed to add subject");
        if (err.message.includes("Invalid token") || err.message.includes("Access Denied")) {
          navigate("/login");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [subjectName, passingMarks, token, handleClose, handleSuccess, navigate, isSubmitting]
  );

  if (!user || !["teacher", "superadmin"].includes(user.role)) return <div>Access Denied</div>;
 

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Subject</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        {alertVisible && <div className="alert alert-success">Subject added successfully!</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formSubjectName" className="mb-3">
            <Form.Label>Subject Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </Form.Group>
          <Form.Group controlId="formPassingMarks" className="mb-3">
            <Form.Label>Passing Marks</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter passing marks"
              value={passingMarks}
              onChange={(e) => setPassingMarks(e.target.value)}
              required
              min="0"
              disabled={isSubmitting}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Subject"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddSubject;