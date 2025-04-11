import { ERole } from "../constants/role.enum";
import { User } from "../entities/mssql/user.entity";
import userService from "../services/user.service";

const users: Partial<User>[] = [
  {
    userName: "admin",
    fullName: "Administrator",
    password: "$2b$12$m1ijcZnAaHyLb56BvR9BjOM3tUIoFguhQv.1zhTbStpBd68qCsMvm",
    role: ERole.ADMIN,
    isDeleted: false,
    playerCode: "admin",
    balance: 0,
  },
  {
    userName: "user1",
    fullName: "User 1",
    password: "$2b$12$m1ijcZnAaHyLb56BvR9BjOM3tUIoFguhQv.1zhTbStpBd68qCsMvm",
    role: ERole.USER,
    isDeleted: false,
    playerCode: "test1",
    balance: 0,
  },
  {
    userName: "user2",
    fullName: "User 2",
    password: "$2b$12$m1ijcZnAaHyLb56BvR9BjOM3tUIoFguhQv.1zhTbStpBd68qCsMvm",
    role: ERole.USER,
    isDeleted: false,
    playerCode: "test2",
    balance: 0,
  },
];

const initMockData = async () => {
  await Promise.all(
    users.map((user) =>
      userService._findOrCreate(
        {
          where: { userName: user.userName, playerCode: user.playerCode },
        },
        user
      )
    )
  );
};

export { initMockData };
