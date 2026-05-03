import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Allow all origins — works for both local and deployed frontend
app.use(cors({ origin: '*', credentials: false }));
app.options('*', cors());
app.use(express.json({ limit: "10mb" }));

// Serve uploaded resumes
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

app.use("/api/auth",          authRoutes);
app.use("/api/jobs",          jobRoutes);
app.use("/api/candidates",    candidateRoutes);
app.use("/api/applications",  applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/saved-jobs",    savedJobRoutes);
app.use("/api/interviews",    interviewRoutes);

app.get("/api/health", (_req, res) => res.json({ message: "Backend Running!", timestamp: new Date() }));
app.get("/", (_req, res) => res.json({ message: "ATS Backend API v2.0" }));

// Emergency admin reset — remove after use
app.get("/api/reset-admin-now", async (_req, res) => {
  try {
    const User = (await import('./models/User.js')).default;
    const bcrypt = (await import('bcryptjs')).default;
    await User.deleteMany({ email: 'recruithubadmin@gmail.com' });
    const hash = await bcrypt.hash('Admin@123', 10);
    await User.create({
      name: 'Admin User',
      email: 'recruithubadmin@gmail.com',
      password: 'Admin@123',
      role: 'admin',
      phoneNumber: '0000000000',
      gender: 'male',
    });
    const saved = await User.findOne({ email: 'recruithubadmin@gmail.com' });
    const ok = await bcrypt.compare('Admin@123', saved.password);
    res.json({ success: true, passwordMatch: ok, hash: saved.password.substring(0,20) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.use((err, _req, res, _next) => res.status(500).json({ error: err.message }));

const startServer = async () => {
  await connectDB();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(PORT, () => {
    console.log(` 🚀 ATS Backend running on http://localhost:${PORT}`);
    console.log(` ⚡ Socket.IO enabled\n`);
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") { console.error(`Port ${PORT} in use`); process.exit(1); }
    else { console.error(err); process.exit(1); }
  });
};

startServer();
