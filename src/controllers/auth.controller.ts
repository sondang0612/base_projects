import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import redisService from "../services/redis.service";
import userService from "../services/user.service";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import { createSendToken } from "../utils/createSendToken";
import { ERole } from "../constants/role.enum";

/**
 * @api {post} /api/v1/users/login User Login
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiParam {String} userName The user's username.
 * @apiParam {String} password The user's password.
 *
 * @apiSuccess {String} token The JWT token for the authenticated user.
 * @apiSuccess {String} userName The user's username.
 * @apiSuccess {Number} statusCode HTTP status code.
 *
 * @apiError (400) BadRequest Please provide both username and password.
 * @apiError (401) Unauthorized Incorrect username or password, or user already logged in.
 *
 * @apiDescription This endpoint allows a user to log in by providing a username and password.
 * If the credentials are correct, a JWT token is sent back to the user for authentication.
 * The user cannot log in if they are already logged in (based on session check in Redis).
 */
const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName, password } = req.body;

    const user = await userService._findOne({ where: { userName } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    createSendToken(user, 200, res);
  }
);

/**
 *
 * @api {post} /api/v1/users/signup User Signup
 * @apiName SignupUser
 * @apiGroup User
 *
 * @apiParam {String} userName The user's email or username.
 * @apiParam {String} password The user's password.
 * @apiParam {String} fullName The user's full name.
 *
 * @apiSuccess {String} token The JWT token for the newly created user.
 * @apiSuccess {String} userName The user's username.
 * @apiSuccess {String} fullName The user's full name.
 * @apiSuccess {Number} statusCode HTTP status code.
 *
 * @apiError (400) BadRequest Please provide all required information (userName, password, fullName).
 * @apiError (500) InternalServerError An error occurred while creating the user.
 *
 * @apiDescription This endpoint allows a new user to sign up by providing their username, password, and full name.
 * The password will be hashed before storing it in the database.
 * After a successful signup, a JWT token is returned to the user for authentication.
 */
const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, role } = req.body;

    const newUser = await userService._create({
      ...req.body,
      password: await bcrypt.hash(password, 12),
      role: role || ERole.USER,
    });
    createSendToken(newUser, 201, res);
  }
);

/**
 * @api {post} /api/v1/users/logout User Logout
 * @apiName LogoutUser
 * @apiGroup User
 *
 * @apiSuccess {String} message A message confirming that the user has logged out successfully.
 * @apiSuccess {Number} statusCode HTTP status code.
 *
 * @apiError (401) Unauthorized User is not authenticated.
 *
 * @apiDescription This endpoint allows the user to log out by removing their session from Redis.
 * The session key associated with the user's ID is deleted from the Redis store, effectively logging the user out.
 */
const logout = catchAsync(async (req: Request, res: Response) => {
  redisService.remove(`user_jid:${req.user?.id}`);

  return res.send({ message: "Logout successfully!" });
});

/**
 * @api {get} /api/v1/users/info Get User Info
 * @apiName GetUserInfo
 * @apiGroup User
 *
 * @apiSuccess {String} message A message confirming the request was successful.
 * @apiSuccess {Object} user The details of the authenticated user.
 * @apiSuccess {String} user.userName The username of the authenticated user.
 * @apiSuccess {String} user.fullName The full name of the authenticated user.
 * @apiSuccess {Number} statusCode HTTP status code.
 *
 * @apiError (401) Unauthorized User is not authenticated.
 *
 * @apiDescription This endpoint retrieves the details of the authenticated user.
 * It returns the user's information if the user is authenticated.
 */
const info = catchAsync(async (req: Request, res: Response) => {
  return res.send({ message: "User details", data: { user: req?.user } });
});

const authController = { login, signup, logout, info };

export { authController };
