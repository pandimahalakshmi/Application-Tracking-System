import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: false }));
app.options('*', cors());
app.use(express.json({ limit: "10mb" }));

// Connect DB on every cold start
connectDB().catch(err => console.error('DB connect error:', err.message));

app.use("/api/auth",          authRoutes);
app.use("/api/jobs",          jobRoutes);
app.use("/api/candidates",    candidateRoutes);
app.use("/api/applications",  applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/saved-jobs",    savedJobRoutes);
app.use("/api/interviews",    interviewRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true, timestamp: new Date() }));
app.get("/", (_req, res) => res.json({ message: "ATS Backend API v2.0" }));
app.use((err, _req, res, _next) => res.status(500).json({ error: err.message }));

// Local dev server
if (process.env.NODE_ENV !== 'production') {
  import("http").then(({ default: http }) => {
    import("./socket.js").then(({ initSocket }) => {
      const server = http.createServer(app);
      initSocket(server);
      const PORT = Number(process.env.PORT) || 5000;
      server.listen(PORT, () => console.log(`🚀 Running on http://localhost:${PORT}`));
    });
  });
}

export default app;
