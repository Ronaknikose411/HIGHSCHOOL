const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

// Add a new admin
export const addAdmin = async (adminData, token) => {
  const response = await fetch(`${API_URL}/api/admin/add-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(adminData), // { name, email, password }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add admin");
  }
  return response.json();
};

// Update an admin
export const updateAdmin = async (adminID, adminData, token) => {
  const response = await fetch(`${API_URL}/api/admin/update/${adminID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(adminData), // { name, email, password } (optional fields)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update admin");
  }
  return response.json();
};

// Delete an admin
export const deleteAdmin = async (adminID, token) => {
  const response = await fetch(`${API_URL}/api/admin/delete/${adminID}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete admin");
  }
  return response.json();
};

// Add a teacher (already provided, included for completeness)
export const createTeacher = async (teacherData, token) => {
  const response = await fetch(`${API_URL}/api/admin/add-teacher`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(teacherData), // { name, email, password }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create teacher");
  }
  return response.json();
};

// Update a teacher
export const updateTeacher = async (teacherID, teacherData, token) => {
  const response = await fetch(`${API_URL}/api/admin/updateteacher/${teacherID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(teacherData), // { name, email, password } (optional fields)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update teacher");
  }
  return response.json();
};

// Delete a teacher
export const deleteTeacher = async (teacherID, token) => {
  const response = await fetch(`${API_URL}/api/admin/deleteteacher/${teacherID}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete teacher");
  }
  return response.json();
};

// Get all admins and teachers (corrected typo)
export const getAllAdminsAndTeachers = async (token) => {
  const response = await fetch(`${API_URL}/api/admin/administration`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch admins and teachers");
  }
  return response.json();
};