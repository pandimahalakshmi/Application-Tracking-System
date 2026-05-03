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

app.use(cors({ origin: '*', credentials: false }));
app.options('*', cors());
app.use(express.json({ limit: "10mb" }));

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

export default app;
