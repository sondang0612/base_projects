import { EGameTransactionType } from "../constants/game-transaction-type.enum";
import { GameTransactionDto } from "../dtos/deva/game-transaction.dto";
import { User } from "../entities/mssql/user.entity";
import TypeOrmBaseService from "./typeorm-base.service";

class UserService extends TypeOrmBaseService<User> {
  async addGameTransaction(args: GameTransactionDto, user: User) {
    console.log(user);
  }
}

const userService = new UserService(User);

export default userService;
