# 🚀 ATS System - Quick Start Guide

## What's Running?

✅ **Frontend**: http://localhost:5177  
✅ **Backend**: http://localhost:5000

---

## 🎯 Quick Commands

### Start Everything (Frontend + Backend)
```bash
npm run dev:all
```

### Start Only Frontend
```bash
npm run dev
```

### Start Only Backend (in new terminal)
```bash
npm run dev:backend
```

---

## 📝 Test Login

**Admin Account:**
- Email: `admin@gmail.com`
- Password: `admin123`

**User Account:**
- Email: `user@gmail.com`  
- Password: `user123`

---

## 🔌 Backend API Endpoints

Test these URLs in your browser or Postman:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Check if backend is running |
| `/api/candidates` | GET | Get all candidates |
| `/api/jobs` | GET | Get all jobs |
| `/api/auth/login` | POST | User login |

### Example: Get All Candidates
```bash
curl http://localhost:5000/api/candidates
```

### Example: Get All Jobs
```bash
curl http://localhost:5000/api/jobs
```

---

## 📂 Backend Structure

```
backend/
├── server.js              # Main Express server
├── package.json
├── .env                   # Configuration
├── routes/                # API endpoints
├── controllers/           # Business logic
└── models/
    └── data.js           # Sample data
```

---

## 🌐 Frontend Integration

The frontend is pre-configured to:
- Call backend API at `http://localhost:5000/api`
- Use `frontend/services/api.js` for all API calls
- Automatically save/load data from backend

No additional setup needed! ✅

---

## ⚡ Features Powered by Backend

✅ Candidate Management  
✅ Job Postings  
✅ User Authentication  
✅ Status Updates  
✅ Search & Filtering  

---

## 🆘 Troubleshooting

**Backend not responding?**
- Verify port 5000 is free
- Check if backend process is running
- Look at terminal for errors

**Frontend can't connect to backend?**
- Ensure both servers are running
- Check browser DevTools (F12) → Network tab
- Verify API URL in `src/services/api.js`

**Port already in use?**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📖 Full Documentation

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed info

---

**Happy Building! 🎉**
