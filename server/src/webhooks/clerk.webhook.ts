import { verifyWebhook, type WebhookEvent } from "@clerk/express/webhooks";
import type { Request, Response } from "express";
import * as z from "zod";
import prisma from "../lib/prisma";
import { env } from "../lib/env";

export const clerkWebhookSchema = z.object<typeof verifyWebhook>;

export const clerkWebhookHandler = async (req: Request, res: Response) => {
  try {
    const event = (await verifyWebhook(req, {
      signingSecret: env.CLERK_WEBHOOK_SIGNING_SECRET
    })) as WebhookEvent;

    switch (event.type) {
      case "user.created":
        const userData = event.data;

        await prisma.user.upsert({
          where: { clerkId: userData.id },
          update: {
            email: userData.email_addresses[0]?.email_address,
            name:
              `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
              null
          },
          create: {
            clerkId: userData.id,
            email: userData.email_addresses[0]?.email_address || "",
            name:
              `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
              null
          }
        });

        break;
      case "user.updated":
        const updatedUserData = event.data;

        await prisma.user.update({
          where: { clerkId: updatedUserData.id },
          data: {
            email: updatedUserData.email_addresses[0]?.email_address || "",
            name:
              `${updatedUserData.first_name || ""} ${updatedUserData.last_name || ""}`.trim() ||
              null
          }
        });

        break;
      case "user.deleted":
        const deletedUserData = event.data;

        await prisma.user.delete({
          where: { clerkId: deletedUserData.id }
        });

        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
        res.status(400).send("Unhandled event type");
        return;
    }
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(400).send("Error handling webhook");
    return;
  }
};
