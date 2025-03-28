const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export const addSubject = async (subjectData, token) => {
  const response = await fetch(`${API_URL}/api/subjects/addsubject`, {
    method: "POST",
    headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(subjectData),
});
if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.message || "Failed to add subject");
}
return response.json();
};

export const getAllSubjects = async (token) => {
const response = await fetch(`${API_URL}/api/subjects/allsubject`, {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.message || "Failed to fetch subjects");
}
return response.json();
};


export const updateSubject = async (subjectId, subjectData, token) => {
const response = await fetch(`${API_URL}/api/subjects/update/${subjectId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
  body: JSON.stringify(subjectData),
});
if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.message || "Failed to update subject");
}
return response.json();
};

export const deleteSubject = async (subjectId, token) => {
const response = await fetch(`${API_URL}/api/subjects/delete/${subjectId}`, {
  method: "DELETE",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.message || "Failed to delete subject");
}
return response.json();
};