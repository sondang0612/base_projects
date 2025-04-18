import { EDefaultEmail } from "../constants/default-email.enum";
import { GameTransactionDto } from "../dtos/deva/game-transaction.dto";
import { UpdateUserBalanceAndCreateTransactionParamters } from "../database/parameters/deva";
import { MssqlService } from "./mssql.service";
import TypeOrmBaseService from "./typeorm-base.service";
import { GameTransactionEntity } from "../database/entities/mssql/game-transaction.entity";
import { UserEntity } from "../database/entities/mssql/user.entity";

class GameTransactionsService extends TypeOrmBaseService<GameTransactionEntity> {
  async create(args: GameTransactionDto, user: UserEntity) {
    const result =
      await MssqlService.executeProcedure<UpdateUserBalanceAndCreateTransactionParamters>(
        "UpdateUserBalanceAndCreateTransaction",
        {
          PlayerCode: args.playerCode,
          Uuid: args.uuid,
          ProviderCode: args.providerCode,
          GameCode: args.gameCode,
          GameName: args.gameName,
          GameNameEn: args.gameName_en,
          GameCategory: args.gameCategory,
          RoundId: args.roundId,
          Type: args.type,
          Amount: args.amount,
          ReferenceUuid: args.referenceUuid,
          RoundStarted: args.roundStarted ? 1 : 0,
          RoundFinished: args.roundFinished ? 1 : 0,
          Details: args.details,
          CreatedBy: EDefaultEmail.DEVA_GENERATED,
        },
        [
          { name: "Status", type: "NVARCHAR(50)", asName: "status" },
          {
            name: "UpdatedBalance",
            type: "DECIMAL(16, 4)",
            asName: "updateBalance",
          },
        ]
      );

    return {
      result: { balance: result?.updateBalance || user.balance },
      status: result?.status || "OK",
    };
  }
}

const gameTransactionsService = new GameTransactionsService(
  GameTransactionEntity
);

export default gameTransactionsService;
