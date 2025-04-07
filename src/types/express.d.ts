import { Request } from "express";
import User from "../entities/mssql/user.entity";

declare module "express-serve-static-core" {
  interface Request {
    requestTime?: string;
    user?: User;
  }
}
