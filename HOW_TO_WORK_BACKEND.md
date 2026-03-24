# 🔧 How to Work with Backend - Complete Guide

## 1️⃣ START THE BACKEND

### Option A: Run Both Frontend + Backend (Recommended)
```bash
npm run dev:all
```
- This starts both servers automatically
- Frontend: http://localhost:5177
- Backend: http://localhost:5000

### Option B: Run Backend Only
```bash
npm run dev:backend
```
- Backend will run on http://localhost:5000
- You need frontend running in another terminal

---

## 2️⃣ BACKEND STRUCTURE EXPLAINED

```
backend/
│
├── server.js                          # 🎯 Main Express server
├── package.json                       # 📦 Dependencies
├── .env                               # ⚙️ Configuration
│
├── routes/
│   ├── authRoutes.js                 # 🔐 Login/Auth endpoints
│   ├── candidateRoutes.js            # 👥 Candidate endpoints
│   └── jobRoutes.js                  # 💼 Job endpoints
│
├── controllers/
│   ├── authController.js             # 🎯 Login logic
│   ├── candidateController.js        # 🎯 Candidate logic
│   └── jobController.js              # 🎯 Job logic
│
└── models/
    └── data.js                       # 💾 Sample data (in-memory)
```

---

## 3️⃣ HOW BACKEND WORKS

### Data Flow Diagram

```
Frontend Request
       ↓
API Call (fetch)
       ↓
http://localhost:5000/api/candidates
       ↓
Router (candidateRoutes.js)
       ↓
Controller (candidateController.js)
       ↓
Data (models/data.js)
       ↓
Response (JSON)
       ↓
Frontend receives data
```

---

## 4️⃣ API ENDPOINTS REFERENCE

### 🔐 AUTHENTICATION

#### Login User
```
POST http://localhost:5000/api/auth/login

Body:
{
  "email": "admin@gmail.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "admin@gmail.com",
    "role": "admin",
    "name": "Admin User"
  },
  "token": "dummy-jwt-token-1"
}
```

#### Get User Profile
```
GET http://localhost:5000/api/auth/profile/1

Response:
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@gmail.com",
    "role": "admin",
    "name": "Admin User"
  }
}
```

---

### 👥 CANDIDATES

#### Get All Candidates
```
GET http://localhost:5000/api/candidates

Optional Query Parameters:
- ?status=Shortlisted    (Filter by status)
- ?search=john           (Search by name/email)
- ?status=Interview&search=doe

Response:
{
  "success": true,
  "candidates": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "position": "Frontend Developer",
      "status": "Interview",
      "rating": 4.5,
      "experience": "3 years",
      "phone": "+1-555-0101",
      "resume": "john_resume.pdf",
      "appliedDate": "2024-03-01"
    },
    ...
  ],
  "total": 5
}
```

#### Get Single Candidate
```
GET http://localhost:5000/api/candidates/1

Response:
{
  "success": true,
  "candidate": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    ...
  }
}
```

#### Add New Candidate
```
POST http://localhost:5000/api/candidates

Body:
{
  "name": "Alex Smith",
  "email": "alex@example.com",
  "position": "React Developer",
  "phone": "+1-555-9999"
}

Response:
{
  "success": true,
  "message": "Candidate added",
  "candidate": {
    "id": 6,
    "name": "Alex Smith",
    "email": "alex@example.com",
    ...
  }
}
```

#### Update Candidate Status
```
PUT http://localhost:5000/api/candidates/1/status

Body:
{
  "status": "Selected"
}

Allowed Status Values:
- Applied
- Shortlisted
- Interview
- Selected
- Rejected

Response:
{
  "success": true,
  "message": "Status updated",
  "candidate": {
    "id": 1,
    "status": "Selected",
    ...
  }
}
```

#### Delete Candidate
```
DELETE http://localhost:5000/api/candidates/1

Response:
{
  "success": true,
  "message": "Candidate deleted",
  "candidate": { ... }
}
```

---

### 💼 JOBS

#### Get All Jobs
```
GET http://localhost:5000/api/jobs

Optional Query Parameters:
- ?search=frontend   (Search by title/company)

Response:
{
  "success": true,
  "jobs": [
    {
      "id": 1,
      "title": "Frontend Developer",
      "company": "Tech Startup Co.",
      "location": "Remote",
      "salary": "$80k - $120k",
      "type": "Full-time",
      "description": "Build responsive web applications...",
      "requirements": "3+ years experience with React...",
      "tags": ["React", "JavaScript", "CSS"],
      "applications": 24,
      "postedDate": "2024-02-15"
    },
    ...
  ],
  "total": 6
}
```

#### Get Single Job
```
GET http://localhost:5000/api/jobs/1

Response:
{
  "success": true,
  "job": { ... }
}
```

#### Create New Job
```
POST http://localhost:5000/api/jobs

Body:
{
  "title": "Vue.js Developer",
  "company": "StartupX",
  "location": "Remote",
  "salary": "$75k - $110k",
  "type": "Full-time",
  "description": "Build amazing apps with Vue.js",
  "requirements": "2+ years Vue.js experience",
  "tags": ["Vue", "JavaScript", "CSS"]
}

Response:
{
  "success": true,
  "message": "Job created successfully",
  "job": { ... }
}
```

#### Update Job
```
PUT http://localhost:5000/api/jobs/1

Body:
{
  "salary": "$90k - $130k",
  "applications": 30
}

Response:
{
  "success": true,
  "message": "Job updated",
  "job": { ... }
}
```

#### Delete Job
```
DELETE http://localhost:5000/api/jobs/1

Response:
{
  "success": true,
  "message": "Job deleted",
  "job": { ... }
}
```

#### Get Job Statistics
```
GET http://localhost:5000/api/jobs/stats

Response:
{
  "success": true,
  "stats": {
    "activeJobs": 6,
    "totalApplications": 137,
    "averageApplications": 22
  }
}
```

---

## 5️⃣ TEST BACKEND WITH CURL/COMMAND LINE

### Check if Backend is Running
```bash
curl http://localhost:5000/api/health
```

### Get All Candidates
```bash
curl http://localhost:5000/api/candidates
```

### Get All Jobs
```bash
curl http://localhost:5000/api/jobs
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin123"}'
```

### Add New Candidate
```bash
curl -X POST http://localhost:5000/api/candidates \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","position":"Developer","phone":"+1-555-0000"}'
```

### Update Candidate Status
```bash
curl -X PUT http://localhost:5000/api/candidates/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"Selected"}'
```

---

## 6️⃣ TEST BACKEND WITH POSTMAN

1. **Open Postman** (or use Insomnia)
2. **Create New Request**
3. **Set Method**: GET, POST, PUT, DELETE
4. **Set URL**: `http://localhost:5000/api/...`
5. **Add Headers**: `Content-Type: application/json`
6. **Add Body** (JSON): Request data
7. **Click Send**

Example in Postman:
```
GET http://localhost:5000/api/candidates

Headers:
- Content-Type: application/json

Result: Shows all 5 candidates with details
```

---

## 7️⃣ HOW FRONTEND CONNECTS TO BACKEND

### Frontend Code (frontend/services/api.js)

```javascript
// Fetch all candidates from backend
const response = await fetch('http://localhost:5000/api/candidates');
const data = await response.json();
console.log(data.candidates);
```

### In React Components

```javascript
import { candidateService } from '../services/api';

// Inside component
const getCandidates = async () => {
  const result = await candidateService.getAllCandidates();
  console.log(result.candidates);
};
```

---

## 8️⃣ MODIFY BACKEND CODE

### Add New Data Field (Example)

**File**: `backend/models/data.js`

```javascript
// Add 'department' field to candidate
export const candidatesData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    position: "Frontend Developer",
    department: "Engineering",  // ← NEW FIELD
    status: "Interview",
    ...
  },
];
```

The change takes effect immediately (hot reload)!

---

### Add New Endpoint (Example)

**File**: `backend/routes/candidateRoutes.js`

```javascript
import { getCandidatesByDepartment } from "../controllers/candidateController.js";

// Add new route
router.get("/department/:dept", getCandidatesByDepartment);
```

**File**: `backend/controllers/candidateController.js`

```javascript
export const getCandidatesByDepartment = (req, res) => {
  const { dept } = req.params;
  const filtered = candidatesData.filter(c => c.department === dept);
  res.json({ success: true, candidates: filtered });
};
```

Now use it:
```bash
curl http://localhost:5000/api/candidates/department/Engineering
```

---

## 9️⃣ SAMPLE DATA LOCATION

### Candidates Data
**File**: `backend/models/data.js`

- 5 default candidates
- Modify here to change sample data
- Changes apply on next server restart

### Jobs Data
**File**: `backend/models/data.js`

- 6 default jobs
- All editable
- Add/remove as needed

### Users Data
**File**: `backend/models/data.js`

```javascript
export const usersData = [
  { email: "admin@gmail.com", password: "admin123", role: "admin" },
  { email: "user@gmail.com", password: "user123", role: "user" },
];
```

---

## 🔟 IMPORTANT NOTES

⚠️ **This is NOT a Database!**
- Data is stored in memory (JavaScript arrays)
- Data resets when server restarts
- Perfect for development/testing
- For production: Use MongoDB/PostgreSQL

⚠️ **No Password Hashing**
- Passwords stored as plain text for demo
- In production: Use bcrypt or similar

⚠️ **CORS Enabled**
- Backend allows requests from:
  - localhost:5177 (frontend)
  - localhost:5173
  - Any origin (*)

---

## 1️⃣1️⃣ NEXT STEPS

To make backend production-ready:

1. ✅ Replace in-memory data with MongoDB
2. ✅ Add JWT authentication
3. ✅ Hash passwords with bcrypt
4. ✅ Add file upload for resumes
5. ✅ Add email notifications
6. ✅ Add validation middleware
7. ✅ Add error handling
8. ✅ Deploy to cloud (Heroku, Railway, etc.)

---

## 1️⃣2️⃣ TROUBLESHOOTING

**Backend won't start?**
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

**Frontend can't connect to backend?**
- Check backend is running: `curl http://localhost:5000/api/health`
- Verify API URL in `frontend/services/api.js`
- Check browser console (F12) for errors

**Data not persisting?**
- This is normal! Data is in-memory
- Restart server = data resets
- Add MongoDB to persist data

---

**Ready to work with backend? 🚀**

Start with: `npm run dev:all`

