# How to Test Vulnerabilities in Your Bug Bounty App

This guide walks you through exactly how to trigger the seeded vulnerabilities intentionally placed in this application.

---

## 1. Testing SQL Injection (Auth Bypass)

**Location:** Login Page (`/login`)
**Vulnerability:** The backend directly concatenates your username input into the SQL query without parametrizing it.
**How to exploit:**
1. Go to the login page.
2. In the **Username** field, enter the following payload:
   ```sql
   admin' OR '1'='1
   ```
3. Enter anything in the **Password** field.
4. Click Login.
5. **Result:** You will be logged in as `admin`, bypassing the password check entirely.

---

## 2. Testing IDOR (Insecure Direct Object Reference)

**Location:** Dashboard (Profile Information)
**Vulnerability:** The backend accepts an arbitrary `?id=` parameter to fetch user profiles without validating if that profile belongs to your current session.
**How to exploit:**
1. Log in normally (e.g., as `user1`).
2. Open your browser's Developer Tools (F12) and go to the **Network** tab.
3. Refresh the page to see the request to `http://localhost:5000/api/profile?id=2`.
4. Now, open a new tab or use Postman to directly visit/request: `http://localhost:5000/api/profile?id=1`.
5. **Result:** You will see the private profile data of user ID 1 (the Admin user).

---

## 3. Testing Stored Cross-Site Scripting (XSS)

**Location:** Dashboard (Community Support Discussion)
**Vulnerability:** The backend saves exactly what you type, and the React frontend renders it using `dangerouslySetInnerHTML`.
**How to exploit:**
1. In the comment box, paste the following exact payload:
   ```html
   <img src="x" onerror="alert('XSS triggered! Imagine this stealing your cookies.')" />
   ```
2. Click Post Comment.
3. **Result:** An alert box will instantly pop up. Every time *any other user* visits the dashboard, that script will execute in their browser!

---

## 4. Testing Command Injection (Remote Code Execution)

**Location:** Dashboard (Network Debug Ping)
**Vulnerability:** The backend receives the IP address and concatenates it directly into a standard terminal string: `ping -c 3 ${ip}`. 
**How to exploit:**
1. In the Ping Target box, enter one of these payloads: 
   
   **For Windows targets:**
   ```cmd
   127.0.0.1 && dir
   ```
   
   **For Mac/Linux targets (like Render):**
   ```bash
   127.0.0.1; ls -la
   ```
2. Click Ping.
3. **Result:** The system will ping localhost, and *then* execute the `dir/ls` command, returning the entire directory listing of your server to the screen. You have full control of the host machine!

---

## 5. Testing Directory Traversal (LFI)

**Location:** Dashboard (System File Viewer)
**Vulnerability:** The backend looks for a file using `path.join(__dirname, '../../', filename)` without doing any sanitization to prevent moving "up" directories.
**How to exploit:**
1. In the File Name box, instead of requesting a normal file like `package.json`, request:
   ```text
   ../backend/.env
   ```
2. Click View Content.
3. **Result:** You will read the raw contents of your backend's secret `.env` file, exposing database passwords and JWT secrets!

---

## 6. Testing Broken Access Control

**Location:** Backend Admin Routes (`/api/admin/users`)
**Vulnerability:** The backend checks if a user is an admin by blindly trusting an HTTP header `X-User-Role`, which an attacker can easily forge.
**How to exploit:**
1. Open Postman or your terminal.
2. Send a GET request to `http://localhost:5000/api/admin/users`.
3. Ensure you add this custom header to the request: `X-User-Role: admin`
4. **Result:** Even without a valid JWT token or logging in, the server will dump the entire list of all users in the database to you because you manipulated the header.

---

## 7. Testing No Rate Limiting (Brute Force)

**Location:** Login Page (`/login`)
**Vulnerability:** The backend does not implement any form of rate limiting on the authentication endpoint.
**How to exploit:**
1. Open Burp Suite and capture a failed login request (e.g., trying to log in as `user1`).
2. Send the captured request to **Intruder**.
3. Clear the payload positions and highlight just the password field value to set it as the payload position.
4. Load a small dictionary file (like `rockyou.txt` or a custom list containing `password123`) into the Payloads tab.
5. Start the attack.
6. **Result:** The server will process hundreds of requests per second without blocking your IP. You can identify the correct password by looking for the response with a different length or HTTP status code (200 OK vs 401 Unauthorized).

---

## 8. Testing Security Misconfiguration (Verbose Errors)

**Location:** Hidden Debug Route (`/api/debug/crash`)
**Vulnerability:** The server is configured to return full, unhandled stack traces and internal error messages directly to the client instead of logging them securely and returning a generic 500 status.
**How to exploit:**
1. Open up your browser or an API testing tool like Postman.
2. Send a GET request to `http://localhost:5000/api/debug/crash` (or the deployed URL).
3. **Result:** The server will throw a simulated database failure error. Instead of a user-friendly "Something went wrong" message, you will receive a raw HTML block or JSON response containing the exact file paths, line numbers, and the specific SQL query (`SELECT * FROM system_users`) that "failed." This exposes internal system architecture to attackers.
