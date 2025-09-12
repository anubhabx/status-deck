import type { AuthObject, User } from "@clerk/express";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthObject;
      user?: { id: string; email?: string };
    }
  }
}
