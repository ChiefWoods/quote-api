import { NextFunction, Request, Response } from "express";
import { ApiError } from "./errors";

export function basicAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ApiError("Authorization header is missing.", 401);
  }

  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  if (
    !username ||
    !password ||
    username !== process.env.AUTH_USERNAME ||
    password !== process.env.AUTH_PASSWORD
  ) {
    throw new ApiError("Unauthorized access.", 401);
  }

  next();
}
