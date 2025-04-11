import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import userService from "../services/user.service";
import { instanceToInstance } from "class-transformer";
import { sendResponse } from "../utils/sendResponse";

const getAll = catchAsync(async (_: Request, res: Response) => {
  const users = await userService.repository.find({
    where: { isDeleted: false },
  });
  return sendResponse(res, { users: instanceToInstance(users) });
});

const userController = { getAll };

export { userController };
