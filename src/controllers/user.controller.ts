import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import userService from "../services/user.service";
import { instanceToInstance } from "class-transformer";

const getAll = catchAsync(async (_: Request, res: Response) => {
  const users = await userService.repository.find({
    where: { isDeleted: false },
  });
  return res.send({
    message: "List Active Users",
    data: { users: instanceToInstance(users) },
  });
});

const userController = { getAll };

export { userController };
