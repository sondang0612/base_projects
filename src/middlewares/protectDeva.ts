import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import userService from "../services/user.service";

const protectDeva = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  // if (!authorization) {
  //   return sendResponse(res, null, "Unauthorized");
  // }

  let playerCode = `${req?.query?.playerCode || req?.body?.playerCode}`;

  const user = await userService._findOne({ where: { playerCode } });
  if (!user) {
    return sendResponse(res, null, "PlayerNotFound");
  }

  req.user = user;

  next();
};

export { protectDeva };
