import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./lib/env";
import { globalErrorHandler } from "./lib/error";
import { clerkMiddleware, getAuth, requireAuth } from "@clerk/express";
import { sendResponse } from "./lib/response";

// Route imports
import webhookRoutes from "./routes/webhook.routes";
import monitorRoutes from "./routes/monitors.routes";
import checkRoutes from "./routes/checks.routes";
import morgan from "morgan";
import { attachUser } from "./middleware/auth.middleware";

const app = express();

// Middleware
app.use(helmet.hidePoweredBy());
app.use(
  cors({
    origin: (env.CLIENT_ENDPOINT as string).split(","),
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "cache-control"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());
app.use(morgan("dev"));

// Health check endpoint
app.get("/health", (req, res) => {
  return sendResponse(res, 200, "Server is healthy");
});

// Public Routes
app.get("/api/auth-check", requireAuth(), attachUser, async (req, res) => {
  console.log("Auth check user:", req.user?.id);

  return sendResponse(res, 200, "Authenticated", { user: req.user });
});

app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

// Protected Routes
app.use("/api/monitors", monitorRoutes);
app.use("/api/checks", requireAuth(), attachUser, checkRoutes);

// Global error handler
app.use(globalErrorHandler);

// Start the server
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
