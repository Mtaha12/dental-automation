import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import { createServer } from "node:http";
import { Server } from "socket.io";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reservedSlotRoutes from "./routes/reservedSlotRoutes.js";
import { seedDoctors } from "./controllers/doctorController.js";

const app = express();
const httpServer = createServer(app);

const configuredClientUrl = process.env.CLIENT_URL || "http://localhost:5173";

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (origin === configuredClientUrl) return true;

  try {
    const parsedOrigin = new URL(origin);
    return ["localhost", "127.0.0.1", "::1"].includes(parsedOrigin.hostname);
  } catch (_error) {
    return false;
  }
}

const io = new Server(httpServer, {
  cors: {
    origin: isAllowedOrigin,
    methods: ["GET", "POST", "PATCH", "PUT"],
  },
});

app.set("io", io);

app.use(helmet());
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const proto = req.headers["x-forwarded-proto"];
    if (proto && proto !== "https") {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
  }
  return next();
});
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/reserved-slots", reservedSlotRoutes);

io.on("connection", (socket) => {
  socket.on("join-admin", () => {
    socket.join("admins");
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = Number(process.env.PORT || 5000);
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dentist";

function startHttpServer(port) {
  const maxAttempts = 10;
  let currentPort = port;

  const tryListen = () => {
    httpServer.removeAllListeners("error");
    httpServer.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        if (currentPort - port >= maxAttempts - 1) {
          console.error(`Ports ${port}-${currentPort} are already in use. Stop one of them or set PORT to a free value.`);
          process.exit(1);
        }

        currentPort += 1;
        console.warn(`Port ${currentPort - 1} is in use. Trying ${currentPort}...`);
        tryListen();
        return;
      }

      console.error("Server failed to start:", error.message);
      process.exit(1);
    });

    httpServer.listen(currentPort, () => {
      console.log(`Server running on port ${currentPort}`);
      if (currentPort !== port) {
        console.log(`Requested port ${port} was busy, so the server switched to ${currentPort}.`);
      }
    });
  };

  tryListen();
}

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    await seedDoctors();
    startHttpServer(PORT);
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
