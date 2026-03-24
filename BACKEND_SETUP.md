# ATS Backend Setup Guide

## 📦 Backend Architecture

The backend is built using **Node.js + Express** with a modular structure:

```
backend/
├── server.js              # Main server file
├── package.json
├── .env                   # Environment variables
├── routes/
│   ├── authRoutes.js      # Authentication endpoints
│   ├── candidateRoutes.js # Candidate management endpoints
│   └── jobRoutes.js       # Job management endpoints
├── controllers/
│   ├── authController.js      # Auth logic
│   ├── candidateController.js # Candidate logic
│   └── jobController.js       # Job logic
└── models/
    └── data.js            # Sample data store
```

---

## 🚀 Quick Start

### Step 1: Install Dependencies for Both Frontend & Backend

```bash
npm run install:all
```

This command will:
- Install frontend dependencies
- Install backend dependencies automatically

---

### Step 2: Run Frontend & Backend Together

```bash
npm run dev:all
```

This will start:
- ✅ **Frontend**: http://localhost:5177 (Vite)
- ✅ **Backend**: http://localhost:5000 (Express)

---

### Step 3: Optional - Run Separately

**Run Frontend Only:**
```bash
npm run dev
```

**Run Backend Only (in new terminal):**
```bash
npm run dev:backend
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile/:id` - Get user profile

### Candidates
- `GET /api/candidates` - Get all candidates (with filters)
- `GET /api/candidates/:id` - Get candidate by ID
- `POST /api/candidates` - Add new candidate
- `PUT /api/candidates/:id/status` - Update candidate status
- `DELETE /api/candidates/:id` - Delete candidate

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `GET /api/jobs/stats` - Get job statistics
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

---

## 🔌 Test API Endpoints

### Using curl or Postman:

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin123"}'
```

**Get All Candidates:**
```bash
curl http://localhost:5000/api/candidates
```

**Get All Jobs:**
```bash
curl http://localhost:5000/api/jobs
```

---

## 🧪 Test Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@gmail.com | admin123 | Admin |
| user@gmail.com | user123 | User |

---

## ⚙️ Environment Variables

Edit `backend/.env`:
```
PORT=5000
NODE_ENV=development
```

---

## 🌐 Frontend API Integration

The frontend uses API service (`frontend/services/api.js`) to communicate with backend:

```javascript
import { candidateService, jobService, authService } from './services/api';

// Get all candidates
const candidates = await candidateService.getAllCandidates();

// Get all jobs
const jobs = await jobService.getAllJobs();

// Login
const result = await authService.login(email, password);
```

---

## 📊 Sample Data

### Candidates (5 mock candidates)
- John Doe (Frontend Developer)
- Sarah Smith (UI/UX Designer)
- Mike Johnson (Backend Engineer)
- Emma Wilson (QA Engineer)
- Alex Brown (Product Manager)

### Jobs (6 mock jobs)
- Frontend Developer @ Tech Startup Co.
- UI/UX Designer @ Creative Agency
- Backend Engineer @ Enterprise Solutions
- QA Engineer @ Tech Corp
- Data Scientist @ AI Innovations
- Product Manager @ SaaS Platform

---

## 🔄 CORS Configuration

Backend has CORS enabled for:
- Frontend on `http://localhost:5177`
- Frontend on `http://localhost:5173`
- Add more allowed origins in `server.js` if needed

---

## ❌ Troubleshooting

**Backend not connecting?**
- Make sure backend is running on `http://localhost:5000`
- Check if port 5000 is not in use: `lsof -i :5000`

**CORS Error?**
- Ensure backend CORS middleware is enabled
- Check backend is running on correct port

**Dependencies not installed?**
- Run `npm run install:all` again
- Delete `node_modules` folders and reinstall

---

## 📈 Next Steps

1. ✅ Connect frontend to backend API
2. ⏳ Add MongoDB for persistent data
3. ⏳ Add JWT authentication
4. ⏳ Add file upload for resumes
5. ⏳ Add email notifications
6. ⏳ Deploy to production

---

## 🆘 Support

For issues:
1. Check terminal for error messages
2. Verify both frontend and backend are running
3. Check network request in browser DevTools (F12 → Network)
4. Review backend error logs

---

**Happy Coding! 🎉**
