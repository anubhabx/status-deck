import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../lib/error";
import { clerkClient, getAuth } from "@clerk/express";

export const attachUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);

    if (userId) {
      const user = await clerkClient.users.getUser(userId);

      if (!user) {
        return next(new ApiError(401, "Unauthorized"));
      }

      req.user = { id: user.id, email: user.emailAddresses[0]?.emailAddress };
    }

    return next();
  } catch (error) {
    return next(new ApiError(401, "Unauthorized"));
  }
};
