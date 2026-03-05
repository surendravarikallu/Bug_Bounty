# Bug Bounty Lite - Secure System Analysis

Welcome to the **Bug Bounty Lite** platform. This application is deliberately left vulnerable and was developed exclusively as an educational challenge for the **GALA 2K26** event at **KITS Akshar Institute of Technology**.

**WARNING:** DO NOT deploy this application on a public-facing server. It is built to be intentionally hacked in a locally controlled lab environment.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL (or an existing Neon DB configuration)

### 1. Database & Backend Setup
Navigate to the `backend` folder:
```bash
cd backend
npm install
```

Configure your environment variables in `backend/.env` (already pre-filled with the Neon DB string provided during development):
```env
PORT=5000
DATABASE_URL=postgresql://your_db_url_here
```

Initialize the database (creates tables and seed data automatically):
```bash
node init.js
```

Start the backend API server:
```bash
npm run start
```

### 2. Frontend Setup
Open a new terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.


## 👥 Sample Accounts
You can immediately log in using the seed accounts provided by the database init script:
- Admin Account: `admin` / `admin123`
- User Account: `user1` / `password123`

---

## 🎯 Vulnerabilities Guide (For Organizers)

This system contains **7 intentional security vulnerabilities** designed to be discoverable without relying exclusively on automated tools. Participants should use their browsers, network tools, and ingenuity to identify them.

### 1. SQL Injection (Authentication Bypass)
- **Location**: `POST /api/auth/login` (Login Page)
- **Description**: The authentication backend builds an SQL query using direct string concatenation (`'${username}'`) instead of parameterized queries.
- **Exploitation**: Participants can bypass login using classic payloads like `' OR '1'='1` in the username field.

### 2. Cross-Site Scripting (XSS)
- **Location**: `POST & GET /api/comments` (User Dashboard -> Community Support)
- **Description**: Comments are saved exactly as submitted without HTML sanitization. The React frontend then uses `dangerouslySetInnerHTML` to render them.
- **Exploitation**: Inserting `<img src=x onerror=alert(1)>` or a direct `<script>` tag will execute arbitrary JavaScript in the browsers of any user who views the dashboard.

### 3. Insecure Direct Object Reference (IDOR)
- **Location**: `GET /api/profile?id=x` (User Dashboard)
- **Description**: The profile fetching routine natively trusts the `?id=` parameter being passed from the frontend without validating whether the currently authenticated session actually belongs to that `id`.
- **Exploitation**: While logged in as `user1` (usually id `2`), intercepting the request or modifying the Javascript state to ask for `?id=1` will retrieve the profile data of the administrator.

### 4. Unrestricted File Upload
- **Location**: `POST /api/upload` (User Dashboard)
- **Description**: The `multer` configuration accepts any file and retains its exact original extension instead of strictly validating or renaming extensions to safe formats (e.g., locking to `.jpg`/`.png`).
- **Exploitation**: A user can submit arbitrary active server scripts (like a `.js` or `.php` file) or potentially malicious executables (`.exe`) to the system.

### 5. Broken Authentication
- **Location**: `/api/admin/*` (Admin Panel)
- **Description**: Access to administrative functionality relies entirely on a weak, client-provided custom header (`X-User-Role`). The server does not issue or validate a secure session token (like a JWT).
- **Exploitation**: Participants can spoof the `X-User-Role` header using tools like Burp Suite or easily manipulate their `localStorage` state to arbitrarily grant themselves access to the administrative portal.

### 6. Sensitive Information Disclosure
- **Location**: `GET /api/debug` (Hidden Route)
- **Description**: A legacy internal debugging route exists that dumps the server's Node.js environment variables.
- **Exploitation**: A participant querying `/api/debug` will discover out-of-bounds configuration data, including the raw `DATABASE_URL` and credentials.

### 7. Weak Password Storage
- **Location**: `POST /api/auth/register` (Registration system and Database)
- **Description**: Passwords submitted during registration are kept in plain text rather than being salted and hashed.
- **Exploitation**: Should a participant exploit SQL Injection to dump the `users` table or discover database credentials via the debug route, they immediately obtain all user passwords in plaintext.
