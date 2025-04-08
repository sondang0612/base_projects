import { instanceToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import userService from "../services/user.service";
import redisService from "../services/redis.service";

const protect = catchAsync(
  async (req: Request, _: Response, next: NextFunction) => {
    let token;
    // check authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError(
        "You are not logged in! Please log in to get access.",
        401
      );
    }

    // Verification token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as jwt.JwtPayload & { jid: string };

    // check if user still exists
    const freshUser = await userService._findOne({ where: { id: decoded.id } });
    if (!freshUser) {
      return next(
        new AppError("The user belong to this token does no longer exist.", 401)
      );
    }

    // token check
    const existingJid = await redisService.get(`user_jid:${freshUser.id}`);

    if (!existingJid || existingJid !== decoded.jid) {
      return next(
        new AppError(
          "Token is invalid or has been revoked. Please log in again.",
          401
        )
      );
    }

    // grant access
    req.user = instanceToInstance(freshUser);
    next();
  }
);

export { protect };
