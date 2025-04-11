import { EDefaultEmail } from "../constants/default-email.enum";
import { EGameTransactionType } from "../constants/game-transaction-type.enum";
import { GameTransactionDto } from "../dtos/deva/game-transaction.dto";
import { GameTransactionEntity } from "../entities/mssql/game-transaction.entity";
import { User } from "../entities/mssql/user.entity";
import { MssqlService } from "./mssql.service";
import TypeOrmBaseService from "./typeorm-base.service";

class GameTransactionsService extends TypeOrmBaseService<GameTransactionEntity> {
  async create(args: GameTransactionDto, user: User) {
    const { uuid, type, amount, referenceUuid } = args;
    const existingTx = await gameTransactionsService._findOne({
      where: { uuid },
    });
    if (existingTx) {
      return {
        result: { balance: user?.balance },
        status: "AlreadyProcessed",
      };
    }

    let updatedBalance = user.balance;
    let realAmount = amount;

    switch (type) {
      case EGameTransactionType.BET: {
        if (amount > user.balance) {
          return {
            result: { balance: user?.balance },
            status: "InsufficientPlayerBalance",
          };
        }
        updatedBalance -= amount;
        break;
      }

      case EGameTransactionType.WIN: {
        updatedBalance += amount;
        break;
      }

      case EGameTransactionType.CANCEL_BET: {
        const refTx = await gameTransactionsService._findOne({
          where: { uuid: referenceUuid, type: EGameTransactionType.BET },
        });
        if (!refTx) {
          return {
            result: { balance: user?.balance },
            status: "ReferenceNotFound",
          };
        }
        realAmount = amount ?? refTx.amount;
        updatedBalance += realAmount;
        break;
      }

      case EGameTransactionType.CANCEL_WIN: {
        const refTx = await gameTransactionsService._findOne({
          where: { uuid: referenceUuid, type: EGameTransactionType.WIN },
        });
        if (!refTx) {
          return {
            result: { balance: user?.balance },
            status: "ReferenceNotFound",
          };
        }
        realAmount = amount ?? refTx.amount;
        if (realAmount > user.balance) {
          return {
            result: { balance: user?.balance },
            status: "InsufficientPlayerBalance",
          };
        }
        updatedBalance -= realAmount;
        break;
      }

      case EGameTransactionType.OTHER: {
        if (amount < 0 && user.balance + amount < 0) {
          return {
            result: { balance: user?.balance },
            status: "InsufficientPlayerBalance",
          };
        }
        updatedBalance += amount;
        break;
      }

      default:
        return {
          result: { balance: user?.balance },
          status: "UnhandledTransactionType",
        };
    }

    const queryRunner = MssqlService.getDataSource().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(User).update(user.id, {
        balance: updatedBalance,
      });

      await queryRunner.manager.getRepository(GameTransactionEntity).save({
        ...args,
        createdBy: EDefaultEmail.DEVA_GENERATED,
      } as any);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      return {
        result: { balance: user?.balance },
        status: "TransactionFailed",
      };
    } finally {
      await queryRunner.release();
    }

    return {
      result: { balance: updatedBalance },
      status: "OK",
    };
  }
}

const gameTransactionsService = new GameTransactionsService(
  GameTransactionEntity
);

export default gameTransactionsService;
