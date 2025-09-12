import { Router } from "express";
import {
  createMonitor,
  deleteMonitor,
  getMonitors,
  getPublicMonitor,
  updateMonitor
} from "../controllers/monitors.controller";
import { requireAuth } from "@clerk/express";
import { attachUser } from "../middleware/auth.middleware";

const router = Router();

// Public route to get monitor status
router.get("/public/:id", getPublicMonitor);

// Route to get all monitors for authenticated user
router.get("/", requireAuth(), attachUser, getMonitors);
// Route to create a new monitor for authenticated user
router.post("/", requireAuth(), attachUser, createMonitor);
// Route to update a monitor by ID for authenticated user
router.put("/:id", requireAuth(), attachUser, updateMonitor);
// Route to delete a monitor by ID for authenticated user
router.delete("/:id", requireAuth(), attachUser, deleteMonitor);

export default router;
