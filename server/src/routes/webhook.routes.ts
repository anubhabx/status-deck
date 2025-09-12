import { Router } from "express";
import { clerkWebhookHandler } from "../webhooks/clerk.webhook";

const router = Router();

router.post("/", clerkWebhookHandler);

export default router;
