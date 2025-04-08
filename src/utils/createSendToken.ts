import { instanceToInstance } from "class-transformer";
import { Response } from "express";
import { User } from "../entities/mssql/user.entity";
import redisService from "../services/redis.service";
import { signToken } from "../utils/signToken";
import { v4 as uuidv4 } from "uuid";

const createSendToken = (user: User, statusCode: number, res: Response) => {
  const jid = uuidv4();
  const token = signToken(user.id, jid);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  redisService.set(`user_jid:${user.id}`, `${jid}`);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: instanceToInstance(user),
    },
  });
};

export { createSendToken };
