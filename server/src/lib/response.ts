import type { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Sends a consistent API response.
 * @param res - The Express response object.
 * @param statusCode - The HTTP status code.
 * @param message - A descriptive message for the response.
 * @param data - The payload to send in the response.
 */
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) => {
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data
  };
  return res.status(statusCode).json(response);
};
