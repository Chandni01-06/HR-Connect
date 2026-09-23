# HR Connect (MERN Stack) — Complete Practical & Viva Evaluation Solutions Guide

This guide is tailored specifically to your **HR Connect** project (`backend/` + `frontend/`). It provides exact code modifications, explanations, terminal commands, Postman/Thunder Client payloads, and viva scripts for all 10 questions.

---

## Table of Contents
1. [Question 1: MERN Project Architecture, Folder Structure & .env Usage](#question-1-mern-project-architecture-folder-structure--env-usage)
2. [Question 2: Modify an Existing MongoDB Schema by Adding a Field](#question-2-modify-an-existing-mongodb-schema-by-adding-a-field)
3. [Question 3: Modify the Corresponding Express Controller & API Route](#question-3-modify-the-corresponding-express-controller--api-route)
4. [Question 4: Modify the React Form & Add a 404 Route](#question-4-modify-the-react-form--add-a-404-route)
5. [Question 5: Display the New Data in the Frontend](#question-5-display-the-new-data-in-the-frontend)
6. [Question 6: Add Validation & Error Handling (Client & Server)](#question-6-add-validation--error-handling-client--server)
7. [Question 7: Test CRUD Operations & Demonstrate Invalid API Request](#question-7-test-crud-operations--demonstrate-invalid-api-request)
8. [Question 8: Commit & Push to GitHub, Recent Commits, & .gitignore](#question-8-commit--push-to-github-recent-commits--gitignore)
9. [Question 9: Production Architecture & Deployment Process](#question-9-production-architecture--deployment-process)
10. [Question 10: Troubleshooting Deployed App Database & API Connection Errors](#question-10-troubleshooting-deployed-app-database--api-connection-errors)

---

## Question 1: MERN Project Architecture, Folder Structure & .env Usage

### A. High-Level MERN Architecture
**HR Connect** is designed as a **3-Tier Full-Stack Web Application**:
1. **Presentation Tier (Frontend - React + Vite):** Runs in the client's browser, handles UI rendering, state management (hooks), and initiates asynchronous HTTP requests.
2. **Application Tier (Backend - Node.js + Express):** Acts as the REST API server, runs business logic, executes route handlers and controllers, and applies JWT authentication middleware.
3. **Data Tier (Database - MongoDB via Mongoose):** A NoSQL document database storing collections as BSON documents. Mongoose acts as the Object Data Modeling (ODM) layer enforcing schema validation.

```
+-------------------------------------------------------------+
|                     Client Browser                          |
|             React 18 + Vite (Port: 5173)                    |
+-------------------------------------------------------------+
                              ↕  REST API Calls (JSON / Axios / Fetch)
+-------------------------------------------------------------+
|                  Express + Node.js Server                   |
|                       (Port: 5000)                          |
|  - Middleware (CORS, Express.json, JWT Auth)                |
|  - Routes (/api/employees, /api/auth, /api/leaves, etc.)    |
|  - Controllers (CRUD & Business Logic)                      |
+-------------------------------------------------------------+
                              ↕  Mongoose ODM
+-------------------------------------------------------------+
|                       MongoDB Server                        |
|                    Database: `hr_db`                        |
|       Collections: employees, users, leaves, departments    |
+-------------------------------------------------------------+
```

### B. Project Folder Structure
```text
Full_Stack_project/
├── backend/
│   ├── .env                     # Environment variables (port, db connection, secret keys)
│   ├── server.js                # Server entry point, middleware & route mounting
│   ├── package.json             # Backend dependencies (express, mongoose, cors, dotenv, etc.)
│   ├── config/
│   │   └── db.js                # MongoDB connection handler via mongoose.connect()
│   ├── models/                  # Data models (Employee.js, User.js, Leave.js, Department.js)
│   ├── controllers/             # Business controllers (empController.js, authController.js)
│   ├── routes/                  # Express routes (empRoutes.js, authRoutes.js, leaveRoutes.js)
│   ├── middleware/              # JWT authorization middleware (authMiddleware.js)
│   └── seed.js                  # Database initialization and sample data script
└── frontend/
    ├── index.html               # Main HTML entry file
    ├── vite.config.js           # Vite development and bundle configuration
    ├── package.json             # Frontend dependencies (react, lucide-react, tailwindcss)
    └── src/
        ├── main.jsx             # React entry point, mounts root component
        ├── App.jsx              # Central component managing authentication state
        ├── index.css            # Global CSS and Tailwind directives
        ├── pages/
        │   ├── LoginPage.jsx    # User authentication screen
        │   └── DashboardPage.jsx# Main portal orchestrating navigation and sub-views
        └── components/
            ├── Sidebar.jsx      # Navigation sidebar
            ├── Header.jsx       # User profile and logout header
            ├── EmployeeModal.jsx# Form modal to add and edit employees
            ├── EmployeeRow.jsx  # Individual table row presentation
            └── EmployeesView.jsx# Employee table with search and department filtering
```

### C. How `.env` is Used in the Project
1. **Location:** `backend/.env`
2. **Contents:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/hr_db
   JWT_SECRET=supersecret_hr_jwt_key_123
   ```
3. **Loading Mechanism (`backend/server.js`):**
   ```javascript
   const dotenv = require('dotenv');
   dotenv.config(); // Loads .env into process.env

   const PORT = process.env.PORT || 5000;
   const uri = process.env.MONGODB_URI;
   ```
4. **Why `.env` is Essential:**
   - **Security:** Prevents sensitive credentials (database passwords, tokens) from being committed to Git.
   - **Environment Portability:** Allows changing configurations between development (localhost), staging, and production without altering the code.

> **Viva Pitch:**
> *"Our project separates concerns cleanly: the React frontend communicates with Express via standard RESTful endpoints. Sensitive settings such as the database URI and JWT secret are kept out of source code using environment variables configured through `dotenv`."*

---

## Question 2: Modify an Existing MongoDB Schema by Adding a Field

Let's modify the **Employee** schema to store an employee's **`phone`** number.

### File: `backend/models/Employee.js`
Add the `phone` field with validation rules:

```javascript
const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add employee name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add employee email'],
        unique: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    // ============================================
    // NEW FIELD ADDED: phone
    // ============================================
    phone: {
        type: String,
        required: [true, 'Please add employee phone number'],
        trim: true,
        match: [/^[0-9+ -]{10,15}$/, 'Please enter a valid phone number (10-15 digits)']
    },
    // ============================================
    role: {
        type: String,
        required: [true, 'Please add employee job role'],
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Please add department'],
        trim: true
    },
    salary: {
        type: Number,
        required: [true, 'Please add employee salary']
    }
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
```

> **Viva Pitch:**
> *"MongoDB is naturally schemaless, but in enterprise systems we need schema validation. By adding the `phone` field to our Mongoose schema with `type: String`, `required: true`, and regex pattern matching, Mongoose rejects documents that fail this contract before contacting the database."*

---

## Question 3: Modify the Corresponding Express Controller & API Route

### File: `backend/controllers/empController.js`
Update the `createEmployee` and `updateEmployee` functions:

```javascript
// In createEmployee:
const createEmployee = async (req, res) => {
    // 1. Destructure phone from the incoming JSON body
    const { name, email, phone, role, department, salary } = req.body;

    try {
        const emailExists = await Employee.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Employee with this email already exists' });
        }

        // 2. Pass phone to the constructor
        const employee = new Employee({
            name,
            email,
            phone,
            role,
            department,
            salary
        });

        const createdEmployee = await employee.save();
        return res.status(201).json(createdEmployee);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// In updateEmployee:
const updateEmployee = async (req, res) => {
    const { name, email, phone, role, department, salary } = req.body;

    try {
        const employee = await Employee.findById(req.params.id);

        if (employee) {
            employee.name = name || employee.name;
            employee.email = email || employee.email;
            employee.phone = phone || employee.phone; // <-- Update phone
            employee.role = role || employee.role;
            employee.department = department || employee.department;
            employee.salary = salary !== undefined ? salary : employee.salary;

            const updatedEmployee = await employee.save();
            return res.json(updatedEmployee);
        } else {
            return res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
```

### Route Mapping in `backend/routes/empRoutes.js`:
Verify the routes connect to these controller methods:
```javascript
const express = require('express');
const router = express.Router();
const {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/empController');

router.route('/')
    .get(getEmployees)
    .post(createEmployee);

router.route('/:id')
    .put(updateEmployee)
    .delete(deleteEmployee);

module.exports = router;
```

> **Viva Pitch:**
> *"The controller extracts the new `phone` property from `req.body`, builds or modifies the document instance, and returns appropriate HTTP status codes: `201 Created` upon successful insertion or `400 Bad Request` if validation fails."*

---

## Question 4: Modify the React Form & Add a 404 Route

### Option A: Modify the React Form (`frontend/src/components/EmployeeModal.jsx`)

1. **Add state and reset logic:**
   ```javascript
   const [phone, setPhone] = useState('');
   ```

2. **Sync state in `useEffect`:**
   ```javascript
   useEffect(() => {
     if (employee) {
       setName(employee.name);
       setEmail(employee.email);
       setPhone(employee.phone || ''); // <-- populate when editing
       setRole(employee.role);
       setDepartment(employee.department);
       setSalary(employee.salary.toString());
     } else {
       setName('');
       setEmail('');
       setPhone(''); // <-- clear for new record
       setRole('');
       setDepartment('');
       setSalary('');
     }
     setError('');
   }, [employee, isOpen]);
   ```

3. **Pass `phone` inside `handleSubmit`:**
   ```javascript
   const handleSubmit = (e) => {
     e.preventDefault();
     setError('');

     if (!name || !email || !phone || !role || !department || !salary) {
       setError('Please fill in all fields including phone number.');
       return;
     }

     const employeeData = {
       name: name.trim(),
       email: email.trim(),
       phone: phone.trim(),
       role: role.trim(),
       department,
       salary: Number(salary)
     };

     onSubmit(employeeData);
   };
   ```

4. **Add the Input JSX:**
   ```jsx
   <div>
     <label className="block text-xs font-semibold text-[#6B6870] uppercase mb-1">
       Phone Number
     </label>
     <input
       type="tel"
       value={phone}
       onChange={(e) => setPhone(e.target.value)}
       placeholder="e.g. +91 9876543210"
       style={{ borderColor: '#E5DDE2' }}
       className="w-full px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D94F7A] text-[#2D2D35] text-sm"
     />
   </div>
   ```

---

### Option B: Add a 404 Page Not Found Route in React
Create a dedicated 404 component (`frontend/src/pages/NotFoundPage.jsx`):
```jsx
import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F3F4] text-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-lg border border-[#E5DDE2] max-w-md w-full">
        <h1 className="text-7xl font-extrabold text-[#D94F7A]">404</h1>
        <h2 className="text-2xl font-bold text-[#2D2D35] mt-3">Page Not Found</h2>
        <p className="text-sm text-[#6B6870] mt-2">
          The requested URL path does not exist in HR Connect.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 px-6 py-2.5 bg-[#D94F7A] text-white rounded-lg font-semibold hover:opacity-90 transition-all text-sm"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
```
In `App.jsx` with `react-router-dom`:
```jsx
<Routes>
  <Route path="/" element={<DashboardPage />} />
  <Route path="/login" element={<LoginPage />} />
  {/* Wildcard catch-all for undefined routes */}
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

---

## Question 5: Display the New Data in the Frontend

### 1. In `frontend/src/components/EmployeesView.jsx`:
Add the column header to the table (`<thead>`):
```jsx
<thead className="bg-[#F5F3F4] border-b text-xs font-semibold text-[#6B6870] uppercase tracking-wider">
  <tr>
    <th className="px-6 py-3.5">Employee</th>
    <th className="px-6 py-3.5">Email</th>
    <th className="px-6 py-3.5">Phone</th> {/* <-- NEW COLUMN */}
    <th className="px-6 py-3.5">Role</th>
    <th className="px-6 py-3.5">Department</th>
    <th className="px-6 py-3.5">Salary</th>
    <th className="px-6 py-3.5 text-center">Leave Count</th>
    <th className="px-6 py-3.5 text-right">Actions</th>
  </tr>
</thead>
```

### 2. In `frontend/src/components/EmployeeRow.jsx`:
Render the cell data (`<td>`) right after the email cell:
```jsx
<td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B6870]">
  {employee.phone || 'N/A'}
</td>
```

> **Viva Pitch:**
> *"React re-renders components using its Virtual DOM diffing mechanism. When state updates via `fetchEmployees()`, the employee array updates, causing `EmployeesView` and `EmployeeRow` to display the new phone numbers automatically."*

---

## Question 6: Add Validation & Error Handling (Client & Server)

### A. Client-Side Validation (`EmployeeModal.jsx`)
Prevents unnecessary network requests and provides instant visual feedback:
```javascript
// 1. Check for empty fields
if (!name.trim() || !email.trim() || !phone.trim()) {
    setError('Please fill out all required fields.');
    return;
}

// 2. Phone format validation (10 digits)
const cleanPhone = phone.replace(/[^0-9]/g, '');
if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    setError('Please enter a valid phone number (10 to 15 digits).');
    return;
}

// 3. Positive salary validation
if (isNaN(salary) || Number(salary) <= 0) {
    setError('Salary must be a positive number.');
    return;
}
```

### B. Server-Side Validation (`backend/models/Employee.js` & `empController.js`)
Guarantees database integrity even if requests bypass the frontend:
```javascript
// Model validation:
phone: {
    type: String,
    required: [true, 'Please add employee contact number'],
    match: [/^[0-9+ -]{10,15}$/, 'Phone number format is invalid']
}

// Controller error catcher:
try {
    const created = await employee.save();
    return res.status(201).json(created);
} catch (error) {
    // 400 Bad Request if validation rules fail
    return res.status(400).json({ message: error.message });
}
```

---

## Question 7: Test CRUD Operations & Demonstrate Invalid API Request

### Testing Tool: Thunder Client (VS Code) or Postman
**Base API Endpoint:** `http://localhost:5000/api/employees`

### 1. Complete CRUD Test Matrix

| # | Operation | Method | URL | Headers | Body (JSON) | Expected Status |
|---|-----------|--------|-----|---------|-------------|-----------------|
| 1 | **GET All** | `GET` | `http://localhost:5000/api/employees` | *None* | *None* | `200 OK` |
| 2 | **CREATE** | `POST` | `http://localhost:5000/api/employees` | `Content-Type: application/json` | Sample JSON below | `201 Created` |
| 3 | **UPDATE** | `PUT` | `http://localhost:5000/api/employees/<ID>` | `Content-Type: application/json` | Sample JSON below | `200 OK` |
| 4 | **DELETE** | `DELETE` | `http://localhost:5000/api/employees/<ID>` | *None* | *None* | `200 OK` |

#### Sample POST Body:
```json
{
  "name": "Kavita Sharma",
  "email": "kavita.sharma@company.com",
  "phone": "9876543210",
  "role": "Product Designer",
  "department": "Design",
  "salary": 75000
}
```

#### Sample PUT Body (Update salary & phone):
```json
{
  "salary": 82000,
  "phone": "9988776655"
}
```

---

### 2. Demonstrate an Invalid API Request (Negative Test)
1. **Send POST request with invalid phone / missing email:**
   ```json
   {
     "name": "Invalid Test",
     "phone": "123",
     "role": "Tester",
     "department": "Engineering",
     "salary": 50000
   }
   ```
2. **Server Response:**
   - **Status Code:** `400 Bad Request`
   - **Response Payload:**
     ```json
     {
       "message": "Employee validation failed: email: Please add employee email, phone: Phone number format is invalid"
     }
     ```
3. **How to Explain:**
   *"The server intercepts the invalid data in the Mongoose middleware. Since `email` is marked `required` and `phone` violates the regex pattern, Mongoose aborts insertion and our controller responds with HTTP `400 Bad Request`."*

---

## Question 8: Commit & Push to GitHub, Recent Commits, & .gitignore

### 1. Review `.gitignore`
Ensure `.gitignore` contains:
```gitignore
node_modules/
.env
dist/
.DS_Store
```
> **Explanation:** `node_modules/` is excluded because packages can be re-installed using `npm install`. `.env` is excluded to protect credentials.

### 2. Git Terminal Commands
Open terminal in project root:
```bash
# 1. Check status of edited files
git status

# 2. Stage all modifications
git add .

# 3. Commit changes with clear semantic message
git commit -m "feat: added phone field to employee schema, controller and UI"

# 4. Push changes to GitHub repository
git push origin main
```

### 3. Show Recent Commits to the Examiner
```bash
git log --oneline -n 5
```
Example terminal output:
```text
a1b2c3d (HEAD -> main, origin/main) feat: added phone field to employee schema, controller and UI
4f89e21 fix: add validation for employee salary and phone
7c12d4a feat: add department filter and attendance module
9821ef0 initial commit with HR Connect architecture
```

---

## Question 9: Production Architecture & Deployment Process

### 1. Production Architecture Diagram
```
[ User Browser ]
       │
       ▼ HTTPS (Port 443)
[ Vercel / Netlify ] ────────► React Static Production Bundle (Vite Build)
       │
       ▼ REST API (HTTPS)
[ Render / Railway ] ────────► Express Server (Node.js runtime)
       │
       ▼ TLS Connection (mongodb+srv://)
[ MongoDB Atlas ]   ────────► Managed Database Cluster (M0 Free Tier)
```

### 2. Step-by-Step Deployment Walkthrough

#### Step 1: Database (MongoDB Atlas)
1. Register on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free **M0 Sandbox Cluster**.
3. Under **Database Access**, create a user (e.g. `hr_user` with a strong password).
4. Under **Network Access**, click **Add IP Address** $\rightarrow$ select **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Copy the connection URI:
   `mongodb+srv://hr_user:<password>@cluster0.abcde.mongodb.net/hr_db?retryWrites=true&w=majority`

#### Step 2: Backend (Render / Railway)
1. Create a new **Web Service** on Render and link your GitHub repository.
2. Configure settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
3. Add **Environment Variables**:
   - `MONGODB_URI` = `mongodb+srv://hr_user:...`
   - `JWT_SECRET` = `production_secret_key_hr_99`
   - `PORT` = `5000`
4. Deploy and copy the public URL: `https://hr-connect-backend.onrender.com`.

#### Step 3: Frontend (Vercel)
1. Create a new project on Vercel and import your repository.
2. Configure settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add Environment Variable:
   - `VITE_API_URL` = `https://hr-connect-backend.onrender.com`
4. Click **Deploy**.

---

## Question 10: Troubleshooting Deployed App Database & API Connection Errors

When a deployed app shows **"Cannot connect to Database"** or **"Network Error"**, here are the **5 most common root causes and how to fix them**:

### 1. MongoDB Atlas IP Whitelist Issue (90% of cases)
- **Symptom:** Backend logs show `MongooseServerSelectionError: connection timed out` or `ECONNREFUSED`.
- **Cause:** Cloud platforms (Render, Vercel) use dynamic rotating IPs. If MongoDB Atlas only allows your local home IP, the server will be rejected.
- **Fix:** Go to MongoDB Atlas $\rightarrow$ **Network Access** $\rightarrow$ Click **Edit** $\rightarrow$ Choose **Allow Access from Anywhere (`0.0.0.0/0`)** $\rightarrow$ Save and wait 2 minutes.

### 2. Missing or Incorrect Environment Variables
- **Symptom:** Backend crashes with `Invalid connection string` or `process.env.MONGODB_URI is undefined`.
- **Cause:** `.env` was ignored by Git (as it should be), but the environment variables were not added in the Render/Vercel dashboard.
- **Special Trap:** If the database password contains special characters like `@`, `#`, or `/`, MongoDB connection strings break unless the characters are URL-encoded (e.g. `@` becomes `%40`).
- **Fix:** Open Render $\rightarrow$ Service $\rightarrow$ **Environment** and verify `MONGODB_URI` is set properly.

### 3. CORS (Cross-Origin Resource Sharing) Blocked
- **Symptom:** In Chrome DevTools (F12) Console: `Access to XMLHttpRequest at '...' from origin 'https://hr-connect.vercel.app' has been blocked by CORS policy`.
- **Cause:** Express server does not include the frontend's deployed domain in allowed origins.
- **Fix:** In `backend/server.js`, configure CORS:
  ```javascript
  const cors = require('cors');
  app.use(cors({
      origin: ['https://hr-connect.vercel.app', 'http://localhost:5173'],
      credentials: true
  }));
  ```

### 4. Hardcoded `localhost` in Frontend API Calls
- **Symptom:** The deployed Vercel app tries to make requests to `http://localhost:5000/api/employees` and fails with `net::ERR_CONNECTION_REFUSED`.
- **Cause:** Frontend code has `axios.get('http://localhost:5000/api/employees')` hardcoded.
- **Fix:** Use Vite's environment variable:
  ```javascript
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const response = await fetch(`${API_BASE}/api/employees`);
  ```

### 5. Render Free Tier Cold Start (Spin-Down Delay)
- **Symptom:** The first request takes 45–60 seconds or returns `504 Gateway Timeout`.
- **Cause:** Free tier services on Render spin down into sleep mode after 15 minutes of inactivity.
- **Fix:** This is normal behavior for free tiers. Sending an initial request wakes the instance back up within 30-40 seconds. For production, upgrade to a paid tier or set up a recurring cron ping.

---
*Created for Chandni Yadav — Full Stack Project (HR Connect)*
