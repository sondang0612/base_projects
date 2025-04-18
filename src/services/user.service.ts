import { UserEntity } from "../database/entities/mssql/user.entity";
import TypeOrmBaseService from "./typeorm-base.service";

class UserService extends TypeOrmBaseService<UserEntity> {}

const userService = new UserService(UserEntity);

export default userService;
