const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";


export const login = async (credentials) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      
      const errorData = await response.json();
      
      throw new Error(errorData.message || "Login failed");
    }
    const data = await response.json();
         return data; // { token, role, name }
  };
export const addUser = async (userData, token) => {
    const response = await fetch(`${API_URL}/api/add-user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Failed to add user");
    return response.json();
};