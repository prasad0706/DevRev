/**
 * DevRev API Client Utility
 * Handles communication with the Express/Node.js backend on http://localhost:5000
 */

const API_BASE = "http://localhost:5000/api";

// Helper function to get the stored JWT token
export const getToken = () => localStorage.getItem("devrev_token");

// Helper function to make authenticated or public API requests
export async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Attach Bearer token for protected routes (EXP NO. 5 & 6)
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || (data.errors && data.errors[0]?.msg) || `Request failed (${res.status})`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

// ==========================================
// POSTS API ENDPOINTS (EXP NO. 4 CRUD)
// ==========================================

// 1. Get all code review posts
export const getPosts = () => apiRequest("/posts");

// 2. Get single post by ID
export const getPostById = (id) => apiRequest(`/posts/${id}`);

// 3. Create a new code post
export const createPost = (postData) =>
  apiRequest("/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });

// 4. Upvote a post
export const upvotePost = (id, delta = 1) =>
  apiRequest(`/posts/${id}/upvote`, {
    method: "PUT",
    body: JSON.stringify({ delta }),
  });

// 5. Add peer review comment / refactor
export const addPostComment = (id, commentData) =>
  apiRequest(`/posts/${id}/comments`, {
    method: "POST",
    body: JSON.stringify(commentData),
  });

// 6. Delete a post (Admin or Author)
export const deletePost = (id) =>
  apiRequest(`/posts/${id}`, {
    method: "DELETE",
  });

// ==========================================
// USER & AUTH API ENDPOINTS (EXP NO. 5 & 6)
// ==========================================

// 1. User Registration (with express-validator)
export const registerUser = (userData) =>
  apiRequest("/users/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

// 2. User Login (returns JWT Token)
export const loginUser = (credentials) =>
  apiRequest("/users/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

// 3. Get User Profile (Protected Route - EXP NO. 5)
export const getUserProfile = () => apiRequest("/users/profile");

// 4. Test Admin Privileges (RBAC - EXP NO. 6)
export const testAdminRoute = () => apiRequest("/users/admin-dashboard");
