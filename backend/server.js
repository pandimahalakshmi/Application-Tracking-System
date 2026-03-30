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

dotenv.config();
connectDB();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use("/api/auth",          authRoutes);
app.use("/api/jobs",          jobRoutes);
app.use("/api/candidates",    candidateRoutes);
app.use("/api/applications",  applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/saved-jobs",    savedJobRoutes);

app.get("/api/health", (_req, res) => res.json({ message: "Backend Running!", timestamp: new Date() }));
app.get("/", (_req, res) => res.json({ message: "ATS Backend API v2.0" }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

import http from "http";

let currentServer = null;

const startServer = (port, retries = 5) => {
  if (currentServer) {
    currentServer.close();
    currentServer = null;
  }

  const server = http.createServer(app);

  const onListening = () => {
    console.log(`\n ATS Backend Server running on http://localhost:${port}`);
    console.log(` API Documentation: http://localhost:${port}`);
    console.log(`\n CORS enabled for frontend communication\n`);
  };

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n Port ${port} is already in use.`);
      console.error(` Run this to free it: npx kill-port ${port}\n`);
      process.exit(1);
    } else {
      console.error(err);
      process.exit(1);
    }
  });

  server.listen(port, onListening);
  currentServer = server;
};

startServer(PORT);
