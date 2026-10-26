# DevReview — Full Stack Lab Demonstration & Viva Guide
**Course:** Full Stack Web Development Laboratory  
**Project:** DevReview — Peer Code Review Platform  
**Alignment:** Practical Experiments 4, 5, and 6 + DevReview Specification  

---

## 1. Project Overview & Mapping to Syllabus

**DevReview** is a collaborative developer platform where programmers share code snippets for peer review, propose inline refactors, upvote quality solutions, and earn Developer Karma.

This project is built using the **MERN Stack (MongoDB, Express.js, React, Node.js)** and specifically fulfills all 3 core college practical experiments:

| Lab Experiment | Topic | How It Is Implemented in DevReview | Key Files |
| :--- | :--- | :--- | :--- |
| **EXP NO. 4** | **REST API with MongoDB + Mongoose** | Full CRUD operations for Code Review Snippets (`POST`, `GET`, `GET by ID`, `PUT`, `DELETE`). Mongoose schema with data modeling. | [`backend/models/Post.js`](./backend/models/Post.js)<br>[`backend/routes/postRoutes.js`](./backend/routes/postRoutes.js) |
| **EXP NO. 5** | **Secure REST APIs** | Password hashing with `bcryptjs`, JWT token generation and verification, input validation with `express-validator`, security headers (`helmet`), CORS, rate limiting (`express-rate-limit`), and protected profile API (`GET /api/users/profile`). | [`backend/server.js`](./backend/server.js)<br>[`backend/controllers/userController.js`](./backend/controllers/userController.js)<br>[`backend/middleware/authMiddleware.js`](./backend/middleware/authMiddleware.js) |
| **EXP NO. 6** | **Authentication & User Roles with JWT (RBAC)** | Role-Based Access Control (`user` vs `admin`). Regular users can browse, post, upvote, and view profile. Admins have moderation privileges (can delete any snippet and access `/api/users/admin-dashboard`). | [`backend/routes/userRoutes.js`](./backend/routes/userRoutes.js)<br>[`backend/middleware/authMiddleware.js`](./backend/middleware/authMiddleware.js)<br>[`frontend/src/pages/DashboardPage.jsx`](./frontend/src/pages/DashboardPage.jsx) |

---

## 2. Project Directory Structure

```
DevRev/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (name, email, password, role, karma)
│   │   └── Post.js          # Code snippet schema (title, code, language, tags, upvotes, comments)
│   ├── routes/
│   │   ├── userRoutes.js    # /register, /login, /profile, /admin-dashboard
│   │   └── postRoutes.js    # 5 CRUD endpoints for code posts
│   ├── controllers/
│   │   └── userController.js# Registration with validation, bcrypt hashing, JWT issuance, profile
│   ├── middleware/
│   │   └── authMiddleware.js# 'protect' (JWT verification) & 'adminOnly' (role checking)
│   ├── .env                 # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── .env.example         # Template for lab submission (as requested in EXP 4)
│   ├── package.json         # Backend dependencies & npm scripts
│   └── server.js            # Express server initialization, middlewares, MongoDB connection
│
└── frontend/
    ├── src/
    │   ├── utils/
    │   │   └── api.js       # Centralized fetch wrapper with automatic Bearer token injection
    │   ├── context/
    │   │   └── UserContext.jsx # Global user state, JWT storage, role switching & quick demo logins
    │   ├── components/
    │   │   ├── Navbar.jsx   # Top header with role indicator (Student vs Admin)
    │   │   ├── NewPostModal.jsx # Form to create new code snippet (POST /api/posts)
    │   │   └── CodeViewer.jsx # Syntax viewer with interactive line numbers
    │   ├── pages/
    │   │   ├── HomePage.jsx # Live code feed with upvoting and Admin Delete button
    │   │   ├── LoginPage.jsx# Sign-in form with 1-click viva demo buttons
    │   │   ├── RegisterPage.jsx # Registration form with express-validator error display
    │   │   └── DashboardPage.jsx # EXP 5 & 6 Interactive Teacher Evaluation Test Bench
    │   └── App.jsx          # Route manager and layout container
    └── package.json
```

---

## 3. How to Run the Project

### Terminal 1: Backend
```powershell
cd backend
npm start
# Server starts at http://localhost:5000
```

### Terminal 2: Frontend
```powershell
cd frontend
npm run dev
# Vite runs at http://localhost:5173
```

---

## 4. Step-by-Step Teacher Demonstration Guide (3 Minutes)

Open your browser at **`http://localhost:5173`**.

### Part A: Demonstrate EXP NO. 4 (MongoDB CRUD REST APIs)
1. **Show the Feed (Read All - GET /api/posts)**:
   - Point out that all code snippets are loaded dynamically from the backend and database.
2. **Create a Snippet (Create - POST /api/posts)**:
   - Click the blue **`Post Code`** button in the navbar.
   - Enter a title (e.g., `Quick Binary Search in JavaScript`), select language, paste 3 lines of code, and click **Publish to Feed**.
   - Show your teacher that the post immediately appears at the top of the feed with status 201 Created.
3. **Upvote Snippet (Update - PUT /api/posts/:id)**:
   - Click the upvote arrow on any snippet. The vote count increments and updates via `PUT /api/posts/:id/upvote`.
4. **View Single Post (Read One - GET /api/posts/:id)**:
   - Click on the title of any post. It opens the full review view where users can click on a specific line number to add an inline review comment.

---

### Part B: Demonstrate EXP NO. 5 (Secure REST API & Password Security)
1. **Explain the Middlewares in `server.js`**:
   - Show your teacher lines 16–27 in `backend/server.js`:
     - `helmet()` adds secure HTTP headers (e.g., prevents clickjacking and XSS).
     - `cors()` allows the React frontend on port 5173 to communicate with port 5000.
     - `rateLimit()` prevents DoS (Denial of Service) attacks by limiting IPs to 300 requests per 15 minutes.
2. **Show Password Hashing (`bcryptjs`)**:
   - Open `backend/controllers/userController.js`.
   - Show line 34: `await bcrypt.hash(password, 10);`.
   - Explain to the teacher: *"Passwords are never saved in plain text; we use bcrypt with a salt round of 10."*
3. **Demonstrate Input Validation (`express-validator`)**:
   - In the frontend, navigate to **Register**.
   - Type a short password like `123` or an invalid email.
   - Click Submit: the form immediately displays the validation message required by EXP 5: *"Password must contain at least 6 characters"*.

---

### Part C: Demonstrate EXP NO. 6 (JWT Authentication & RBAC User Roles)
1. Navigate to the **Sign In** page.
2. Notice the two **1-Click Viva Demo Buttons**:
   - Click **`Student (User)`**: Automatically signs in as a normal user with role `"user"`.
   - Notice the top navbar changes to show **`STUDENT`** badge.
3. On the **Developer Dashboard**, show your teacher the **Live Test Bench**:
   - **Click Button 1**: *"Test Protected Profile (EXP 5)"*  
     -> Output: **`HTTP 200 OK`**. Shows the decoded profile fetched using `Authorization: Bearer <token>`.
   - **Click Button 2**: *"Test Admin Route (EXP 6)"*  
     -> Output: **`HTTP 403 Forbidden`**!  
     Explain to the teacher: *"Because I am logged in as a regular user, the `adminOnly` middleware rejects the request with HTTP 403."*
4. **Now Switch to Admin**:
   - Click the button **`Switch to Admin`** at the top right (or log in via the *"Teacher (Admin)"* quick button).
   - Notice the top navbar badge updates to **`ADMIN`**.
   - Click Button 2 again: *"Test Admin Route"*  
     -> Output: **`HTTP 200 OK: Admin authorization verified successfully!`**
5. **Show Admin Deletion in Action**:
   - Go back to the home feed.
   - Notice red **`Admin Delete`** buttons appear on the posts because the active role is Admin.
   - Click **Admin Delete** on any test post: The post is permanently removed from the database!
   - Explain: *"Regular users do not have delete buttons; only Admin JWT tokens can execute DELETE /api/posts/:id."*

---

## 5. Postman Testing Cheatsheet

If your teacher asks you to test using **Postman** (as specified in EXP 4 & EXP 5), use these exact requests:

### 1. Register User (EXP 5)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/users/register`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "Prasad Mahajan",
  "email": "prasad@test.com",
  "password": "password123",
  "role": "user"
}
```
- **Expected Status:** `201 Created`

---

### 2. Login User & Get JWT (EXP 5 & 6)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/users/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "prasad@test.com",
  "password": "password123"
}
```
- **Expected Status:** `200 OK`
- **Copy the `token` string from the response!**

---

### 3. Access Protected Profile (EXP 5)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users/profile`
- **Headers:**  
  `Authorization: Bearer <paste_token_here>`
- **Expected Status:** `200 OK` (Returns user details without password)
- **Test without Token:** Send request with no header -> Returns `401 Unauthorized: Access denied. No token provided.`

---

### 4. Test Role-Based Access Control (EXP 6)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users/admin-dashboard`
- **Headers:** `Authorization: Bearer <paste_token_here>`
- **If User Token:** Returns `403 Forbidden: Admin privileges required.`
- **If Admin Token:** Returns `200 OK: Admin authorization verified successfully!`

---

### 5. Create Code Post (EXP 4 CRUD: Create)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/posts`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "title": "Reverse Linked List in Python",
  "code": "prev = None\ncurr = head\nwhile curr:\n    nxt = curr.next\n    curr.next = prev\n    prev = curr\n    curr = nxt",
  "language": "python",
  "author": "Prasad Mahajan",
  "tags": ["python", "dsa"]
}
```
- **Expected Status:** `201 Created`

---

### 6. Get All Posts (EXP 4 CRUD: Read)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/posts`
- **Expected Status:** `200 OK`

---

## 6. Top 10 Viva Questions & Exact Answers

#### Q1: What is Mongoose and why do we use it with MongoDB?
> **Answer:** MongoDB is a NoSQL, schema-less document database. Mongoose is an Object Data Modeling (ODM) library for Node.js. It allows us to define rigid data schemas, enforce type validation, define defaults, and perform CRUD operations easily.

#### Q2: Why should passwords never be stored in plain text?
> **Answer:** If the database is compromised, attackers can read plain text passwords. We use `bcryptjs` with salt rounds to perform a one-way mathematical cryptographic hash. Even if an attacker reads the hash, they cannot easily reverse it to obtain the original password.

#### Q3: What is a Salt in bcrypt?
> **Answer:** A salt is random cryptographic data added to the password input before hashing. This ensures that two users with the exact same password will have completely different hashes, preventing dictionary and Rainbow Table attacks.

#### Q4: What is JSON Web Token (JWT) and what are its 3 parts?
> **Answer:** A JWT is a compact, URL-safe means of securely transmitting claims between parties. Its 3 parts separated by dots (`.`) are:
> 1. **Header:** Contains the token type (JWT) and hashing algorithm (e.g., HS256).
> 2. **Payload:** Contains the claims/data (e.g., `user id`, `role`).
> 3. **Signature:** Created by hashing Header + Payload with a secret key known only to the server.

#### Q5: What is the difference between Authentication and Authorization?
> **Answer:**
> - **Authentication** verifies *who you are* (Login with email & password to receive a JWT).
> - **Authorization** verifies *what you are allowed to do* (Role-Based Access Control: checking if `role === 'admin'` before allowing post deletion or admin access).

#### Q6: What is the difference between HTTP Status Code 401 and 403?
> **Answer:**
> - **401 Unauthorized:** The user is not authenticated (no token or expired token provided).
> - **403 Forbidden:** The user is authenticated, but does not have the necessary permissions (e.g., a student trying to access an admin-only route).

#### Q7: Why do we use Helmet middleware in Express?
> **Answer:** `helmet` sets various secure HTTP response headers (e.g., `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`) to protect against common web vulnerabilities like Cross-Site Scripting (XSS) and clickjacking.

#### Q8: What does the `rateLimit` middleware do?
> **Answer:** It limits the number of requests a single client IP address can make within a defined time window (e.g., max 300 requests per 15 minutes). This mitigates Denial of Service (DoS) and brute-force password guessing attacks.

#### Q9: What is CORS?
> **Answer:** Cross-Origin Resource Sharing. By default, web browsers block frontend scripts running on one origin (e.g., `http://localhost:5173`) from making HTTP requests to another origin (e.g., `http://localhost:5000`). The `cors()` middleware enables this cross-origin communication safely.

#### Q10: How does the Express `protect` middleware work?
> **Answer:** When an incoming request reaches a protected route, the `protect` middleware reads the `Authorization: Bearer <token>` header, verifies the signature using `jwt.verify(token, secret)`, extracts the decoded user object, attaches it to `req.user`, and calls `next()`. If invalid or missing, it stops execution and returns `401 Unauthorized`.
