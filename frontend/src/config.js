const API_BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5001'
    : 'https://your-backend-url.vercel.app';  // Replace with actual backend URL

export default API_BASE_URL;
git status
