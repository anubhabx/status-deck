import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { ApiError } from "../lib/error";
import { sendResponse } from "../lib/response";

const monitorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.url("Invalid URL format"),
  interval: z.string().min(1, "Interval is required")
});

// Controller to create monitor for authenticated user
export const createMonitor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, url, interval } = monitorSchema.parse(req.body);

    const userInDb = await prisma.user.findUnique({
      where: { clerkId: req.user?.id }
    });

    if (!userInDb) {
      return next(new ApiError(404, "User not found"));
    }

    const createdMonitor = await prisma.monitor.create({
      data: {
        name,
        url,
        interval,
        userId: userInDb.id
      }
    });

    return sendResponse(
      res,
      201,
      "Monitor created successfully",
      createdMonitor
    );
  } catch (error) {
    next(error);
  }
};

// Controller to get public monitor data by ID
export const getPublicMonitor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const monitor = await prisma.monitor.findUnique({
      where: { id },
      include: {
        checks: {
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    if (!monitor) {
      return next(new ApiError(404, "Monitor not found"));
    }

    const { checks } = monitor;
    const averageResponseTime =
      checks.length > 0
        ? checks.reduce((acc, check) => acc + check.responseTime, 0) /
          checks.length
        : 0;

    const successfulChecks = checks.filter(
      (check) => check.statusCode >= 200 && check.statusCode < 300
    ).length;
    const uptime =
      checks.length > 0 ? (successfulChecks / checks.length) * 100 : 0;

    const publicData = {
      name: monitor.name,
      status: monitor.status,
      lastChecked: monitor.lastChecked,
      averageResponseTime,
      uptime,
      checks
    };

    return sendResponse(
      res,
      200,
      "Public monitor data retrieved successfully",
      publicData
    );
  } catch (error) {
    next(error);
  }
};

// Controller to get monitors for authenticated user
export const getMonitors = async (
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

    const monitors = await prisma.monitor.findMany({
      where: { userId: userInDb.id },
      orderBy: { createdAt: "desc" },
      include: {
        checks: {
          orderBy: {
            createdAt: "desc"
          },
          take: 5
        }
      }
    });

    if (!monitors) {
      return next(new ApiError(404, "No monitors found for this user"));
    }

    return sendResponse(res, 200, "Monitors retrieved successfully", monitors);
  } catch (error) {
    next(error);
  }
};

// Controller to delete a monitor by ID for authenticated user
export const deleteMonitor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const userInDb = await prisma.user.findUnique({
      where: { clerkId: req.user?.id }
    });

    if (!userInDb) {
      return next(new ApiError(404, "User not found"));
    }

    const result = await prisma.monitor.deleteMany({
      where: { id: String(id), userId: userInDb.id }
    });

    if (result.count === 0) {
      return next(new ApiError(404, "Monitor not found or not owned by user"));
    }

    return sendResponse(res, 200, "Monitor deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Controller to update a monitor by ID for authenticated user
export const updateMonitor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const dataToUpdate = monitorSchema.partial().parse(req.body);

    const userInDb = await prisma.user.findUnique({
      where: { clerkId: req.user?.id }
    });

    if (!userInDb) {
      return next(new ApiError(404, "User not found"));
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return next(new ApiError(400, "No fields to update provided"));
    }

    const monitor = await prisma.monitor.findFirst({
      where: { id: String(id), userId: userInDb.id }
    });

    if (!monitor) {
      return next(new ApiError(404, "Monitor not found or not owned by user"));
    }

    const updatedMonitor = await prisma.monitor.update({
      where: { id: String(id) },
      data: dataToUpdate
    });

    return sendResponse(
      res,
      200,
      "Monitor updated successfully",
      updatedMonitor
    );
  } catch (error) {
    next(error);
  }
};
