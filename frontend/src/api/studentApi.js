const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export const createStudent = async (studentData, token) => {

  const response = await fetch(`${API_URL}/api/students/addstudent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(studentData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create student");
  }
  return response.json();
};

export const getAllStudents = async (token) => {

  const response = await fetch(`${API_URL}/api/students/allstudent`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch students");
  }
  return response.json();
};

export const getStudentById = async (studentId, token) => {

  const response = await fetch(`${API_URL}/api/students/studentbyid/${studentId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch student");
  }
  return response.json();
};

export const updateStudent = async (studentId, studentData, token) => {
 
  const response = await fetch(`${API_URL}/api/students/update/${studentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(studentData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update student");
  }
  return response.json();
};

export const deleteStudent = async (studentId, token) => {
 
  const response = await fetch(`${API_URL}/api/students/delete/${studentId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete student");
  }
  return response.json();
};