import { User } from "../entities/mssql/user.entity";
import TypeOrmBaseService from "./typeorm-base.service";

class UserService extends TypeOrmBaseService<User> {}

const userService = new UserService(User);

export default userService;
