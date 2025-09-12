import { Router } from "express";
import { getChecks } from "../controllers/check.controller";

const router = Router();

// Route to get checks for a specific monitor
router.get("/:monitorId", getChecks);

export default router;
