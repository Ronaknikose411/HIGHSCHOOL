const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export const addMarks = async (subjectID, marksData, token) => {
 
  if (!token || typeof token !== "string" || !token.includes(".")) {
    throw new Error("Invalid or missing token");
  }
  const response = await fetch(`${API_URL}/api/marks/addmarks/${subjectID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(marksData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error("addMarks error response:", errorData); // Debug log
    throw new Error(errorData.message || "Failed to add marks");
  }
  return response.json();
};

// Other functions (unchanged for brevity, but add similar token validation if needed)
export const getAllMarks = async (token) => {
  const response = await fetch(`${API_URL}/api/marks/studentallmarks`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch marks");
  }
  return response.json();
};

export const getStudentResult = async (studentId, token) => {
  const response = await fetch(`${API_URL}/api/marks/result/${studentId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch result");
  }
  return response.json();
};

export const updateMarks = async (subjectID, marksData, token) => {
  const response = await fetch(`${API_URL}/api/marks/update/${subjectID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(marksData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update marks");
  }
  return response.json();
};

export const deleteMarks = async (subjectID, studentId, token) => {
  const response = await fetch(`${API_URL}/api/marks/delete/${subjectID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ studentId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete marks");
  }
  return response.json();
};

export const getSubjectMarks = async (subjectId, token) => {
  const response = await fetch(`${API_URL}/api/marks/subjectmarks/${subjectId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch subject marks");
  }
  return response.json();
};