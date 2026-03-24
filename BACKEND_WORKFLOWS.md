# 🎯 Backend - Practical Examples & Workflows

## SCENARIO 1: Adding a New Candidate from Frontend

### Step 1: User fills form in Frontend
```
Frontend: AddCandidate.jsx
├── User enters: Name, Email, Position, Phone
└── Clicks "Add Candidate" button
```

### Step 2: Frontend sends to Backend
```javascript
// File: frontend/services/api.js (Frontend)
const response = await fetch('http://localhost:5000/api/candidates', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "John Smith",
    email: "john@company.com",
    position: "React Developer",
    phone: "+1-555-1234"
  })
});
```

### Step 3: Backend receives request
```
Backend receives POST at: http://localhost:5000/api/candidates
↓
Routes to: backend/routes/candidateRoutes.js
↓
Calls Controller: addCandidate()
```

### Step 4: Controller adds to database
```javascript
// File: backend/controllers/candidateController.js
export const addCandidate = (req, res) => {
  const { name, email, position, phone } = req.body;
  
  const newCandidate = {
    id: candidatesData.length + 1,      // Auto-increment ID
    name,
    email,
    position,
    status: "Applied",                   // Default status
    rating: 4.0,                         // Default rating
    experience: "2 years",
    phone,
    resume: "resume.pdf",
    appliedDate: new Date()
  };
  
  candidatesData.push(newCandidate);     // Add to array
  
  // Send response back
  res.json({ 
    success: true, 
    message: "Candidate added", 
    candidate: newCandidate 
  });
};
```

### Step 5: Frontend receives response
```javascript
// Data now shows up in Frontend:
// ✅ New candidate appears in Candidates table
// ✅ Total count updates to 6
```

---

## SCENARIO 2: Filtering Candidates by Status

### User Action
```
Candidates Page → Select Status Filter: "Shortlisted"
```

### Frontend Request
```javascript
// src/services/api.js
const candidates = await candidateService.getAllCandidates("Shortlisted");
// Calls: http://localhost:5000/api/candidates?status=Shortlisted
```

### Backend Processing
```javascript
// backend/controllers/candidateController.js
export const getAllCandidates = (req, res) => {
  const { status, search } = req.query;  // Get query params
  let filtered = [...candidatesData];
  
  if (status && status !== "All") {
    filtered = filtered.filter(c => c.status === status);
    // Returns only candidates with status: "Shortlisted"
  }
  
  res.json({ success: true, candidates: filtered });
};
```

### Result
```
Backend returns: Only Sarah Smith (Shortlisted)
Frontend displays: 1 candidate instead of 5
```

---

## SCENARIO 3: Updating Candidate Status

### User clicks "Update Status"
```
Frontend: Change John Doe status from "Applied" → "Interview"
```

### API Request
```javascript
// src/services/api.js
const response = await fetch(
  'http://localhost:5000/api/candidates/1/status',
  {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: "Interview" })
  }
);
```

### Backend Updates
```javascript
// backend/controllers/candidateController.js
export const updateCandidateStatus = (req, res) => {
  const { id } = req.params;           // id = 1
  const { status } = req.body;         // status = "Interview"
  
  const candidate = candidatesData.find(c => c.id == id);
  candidate.status = status;            // Update in memory
  
  res.json({ 
    success: true, 
    message: "Status updated", 
    candidate 
  });
};
```

### Result
```
✅ John Doe status updated to "Interview"
✅ UI reflects change immediately
```

---

## SCENARIO 4: Creating a New Job Posting

### Admin fills Job Form
```
Frontend: JobForm.jsx
├── Title: "Angular Developer"
├── Company: "TechCorp"
├── Salary: "$85k - $120k"
└── Clicks "Post Job"
```

### Submit to Backend
```javascript
// src/services/api.js
await jobService.createJob({
  title: "Angular Developer",
  company: "TechCorp",
  location: "New York",
  salary: "$85k - $120k",
  type: "Full-time",
  description: "Build enterprise applications...",
  requirements: "5+ years Angular experience",
  tags: ["Angular", "TypeScript", "RxJS"]
});
```

### Backend Creates Job
```javascript
// backend/controllers/jobController.js
export const createJob = (req, res) => {
  const { title, company, location, salary, type, description, requirements, tags } = req.body;
  
  const newJob = {
    id: jobsData.length + 1,
    title,
    company,
    location,
    salary,
    type,
    description,
    requirements,
    tags,
    applications: 0,
    postedDate: new Date().toISOString()
  };
  
  jobsData.push(newJob);
  
  res.json({ 
    success: true, 
    message: "Job created successfully", 
    job: newJob 
  });
};
```

### Result
```
✅ New job appears in Jobs list (7 total now)
✅ Users can apply to this job
```

---

## SCENARIO 5: Searching Jobs

### User types in Search Box
```
Search: "React"
```

### API Request
```javascript
// src/services/api.js
const jobs = await jobService.getAllJobs("React");
// Calls: http://localhost:5000/api/jobs?search=React
```

### Backend Search
```javascript
// backend/controllers/jobController.js
export const getAllJobs = (req, res) => {
  const { search } = req.query;
  let filtered = [...jobsData];
  
  if (search) {
    filtered = filtered.filter(
      j => j.title.toLowerCase().includes(search.toLowerCase()) ||
           j.company.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({ success: true, jobs: filtered });
};
```

### Result
```
Shows:
✓ Frontend Developer (has React)
✓ Products 3 results matching "React"
```

---

## 📊 DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│  http://localhost:5177                                      │
│                                                              │
│  Pages:                                                     │
│  ├─ Login.jsx          → Calls /api/auth/login             │
│  ├─ AdminDashboard.jsx → Calls /api/candidates, /api/jobs  │
│  ├─ Candidates.jsx     → Calls /api/candidates with filters│
│  ├─ Jobs.jsx           → Calls /api/jobs with search       │
│  └─ JobForm.jsx        → Calls POST /api/jobs              │
│                                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     │ (fetch / axios)
                     ↓
    ┌────────────────────────────────────┐
    │  NETWORK / INTERNET                 │
    │  http://localhost:5000              │
    └────────────────┬───────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                 │
│  http://localhost:5000                                      │
│                                                              │
│  Routes (in routes/):                                       │
│  ├─ /api/auth/*          → authRoutes.js                   │
│  ├─ /api/candidates/*    → candidateRoutes.js              │
│  └─ /api/jobs/*          → jobRoutes.js                    │
│                                                              │
│  Controllers (in controllers/):                             │
│  ├─ authController.js    → login(), getProfile()           │
│  ├─ candidateController  → get(), add(), update(), delete()│
│  └─ jobController.js     → get(), add(), update(), delete()│
│                                                              │
│  Models (in models/):                                       │
│  └─ data.js             → Sample data (arrays)             │
│      ├─ candidatesData[] → 5 candidates                    │
│      ├─ jobsData[]      → 6 jobs                          │
│      └─ usersData[]     → 2 users                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 REQUEST & RESPONSE EXAMPLES

### Example 1: Get All Candidates

**REQUEST:**
```
GET http://localhost:5000/api/candidates
```

**RESPONSE:**
```json
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
      "experience": "3 years"
    },
    ...
  ],
  "total": 5
}
```

---

### Example 2: Add New Candidate

**REQUEST:**
```
POST http://localhost:5000/api/candidates

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "position": "Backend Developer",
  "phone": "+1-555-9999"
}
```

**RESPONSE:**
```json
{
  "success": true,
  "message": "Candidate added",
  "candidate": {
    "id": 6,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "position": "Backend Developer",
    "status": "Applied",
    "phone": "+1-555-9999",
    "appliedDate": "2026-03-05T..."
  }
}
```

---

### Example 3: Update Status

**REQUEST:**
```
PUT http://localhost:5000/api/candidates/1/status

{
  "status": "Selected"
}
```

**RESPONSE:**
```json
{
  "success": true,
  "message": "Status updated",
  "candidate": {
    "id": 1,
    "name": "John Doe",
    "status": "Selected",
    ...
  }
}
```

---

## 🛠️ MODIFY BACKEND - STEP BY STEP

### Task: Add "Department" field to Candidates

**Step 1: Update Sample Data**
```javascript
// File: backend/models/data.js

export const candidatesData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    position: "Frontend Developer",
    status: "Interview",
    rating: 4.5,
    department: "Engineering",        // ← ADD THIS
    experience: "3 years",
    phone: "+1-555-0101",
    resume: "john_resume.pdf",
    appliedDate: "2024-03-01",
  },
  // ... other candidates
];
```

**Step 2: Update Add Candidate Function**
```javascript
// File: backend/controllers/candidateController.js

export const addCandidate = (req, res) => {
  const { name, email, position, phone, department } = req.body; // ← ADD
  
  const newCandidate = {
    id: candidatesData.length + 1,
    name,
    email,
    position,
    department,                       // ← ADD
    status: "Applied",
    rating: 4.0,
    experience: "2 years",
    phone,
    resume: "resume.pdf",
    appliedDate: new Date().toISOString(),
  };
  
  candidatesData.push(newCandidate);
  res.json({ success: true, message: "Candidate added", candidate: newCandidate });
};
```

**Step 3: Update Frontend to Send Department**
```javascript
// File: frontend/pages/CandidateForm.jsx

const addCandidate = async () => {
  await candidateService.addCandidate({
    name: formData.name,
    email: formData.email,
    position: formData.position,
    phone: formData.phone,
    department: formData.department,  // ← ADD
  });
};
```

**Result:**
- New candidates now have department field
- Shows in table/details pages
- Can filter by department later

---

## 🧪 TESTING WORKFLOWS

### Test 1: Create and Update Candidate

```bash
# 1. Add candidate
curl -X POST http://localhost:5000/api/candidates \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","position":"Developer","phone":"+1-555-0000"}'

# 2. Get all candidates (should include new one)
curl http://localhost:5000/api/candidates

# 3. Update status to "Interview"
curl -X PUT http://localhost:5000/api/candidates/6/status \
  -H "Content-Type: application/json" \
  -d '{"status":"Interview"}'

# 4. Get candidate #6 (to verify update)
curl http://localhost:5000/api/candidates/6
```

---

### Test 2: Search and Filter Jobs

```bash
# 1. Get all jobs
curl http://localhost:5000/api/jobs

# 2. Search for "React"
curl "http://localhost:5000/api/jobs?search=React"

# 3. Create new job
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Vue Developer",
    "company":"StartupX",
    "location":"SF",
    "salary":"75k-110k",
    "type":"Full-time",
    "description":"Build apps",
    "requirements":"Vue exp",
    "tags":["Vue","JS"]
  }'

# 4. Get job statistics
curl http://localhost:5000/api/jobs/stats
```

---

## ⚡ QUICK REFERENCE

| Task | Command |
|------|---------|
| Start Backend | `npm run dev:backend` |
| Start Both | `npm run dev:all` |
| Get Candidates | `curl http://localhost:5000/api/candidates` |
| Get Jobs | `curl http://localhost:5000/api/jobs` |
| Check Status | `curl http://localhost:5000/api/health` |
| API Docs | `BACKEND_SETUP.md` |

---

**Now you understand how backend works! 🚀**
