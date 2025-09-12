import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { sendResponse } from "../lib/response";
import { ApiError } from "../lib/error";
import type { Check } from "@prisma/client";

const checkSchema = z.object({
  monitorId: z.string()
});

// Controller to get checks for a specific monitor
export const getChecks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userInDb = await prisma.user.findUnique({
      where: { clerkId: req.user?.id }
    });

    if (!userInDb) {
      return next(new ApiError(404, "User not found"));
    }

    const { monitorId } = checkSchema.parse(req.params);

    console.log("Fetching checks for monitorId:", monitorId);

    const monitorInDb = await prisma.monitor.findUnique({
      where: { id: monitorId, userId: userInDb?.id }
    });

    if (!monitorInDb) {
      return next(new ApiError(404, "Monitor not found"));
    }

    if (monitorInDb.userId !== userInDb.id) {
      return next(
        new ApiError(403, "Forbidden: Access to this monitor is denied")
      );
    }

    const checks: Check[] = await prisma.check.findMany({
      where: { monitorId },
      orderBy: { createdAt: "desc" }
    });

    return sendResponse(res, 200, "Checks retrieved successfully", checks);
  } catch (error) {
    return next(error);
  }
};
