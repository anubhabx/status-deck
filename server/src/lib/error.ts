import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { env } from "./env";

/**
 * Custom error class for API errors.
 * @param statusCode - The HTTP status code.
 * @param message - The error message.
 */
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

/**
 * Express error handling middleware.
 * This should be the last middleware in your Express app.
 */
export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error for debugging purposes
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.format()
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === "P2002") {
      return res.status(409).json({
        message: `Unique constraint failed on the field(s): ${err.meta?.target}`
      });
    }
    // Record to update or delete does not exist
    if (err.code === "P2025") {
      return res.status(404).json({
        message: err.meta?.cause || "Record not found."
      });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: "Invalid input data."
    });
  }

  const isProduction = env.NODE_ENV === "production";
  return res.status(500).json({
    message: "An internal server error occurred.",
    // Only include stack trace in development
    stack: isProduction ? undefined : err.stack
  });
};
