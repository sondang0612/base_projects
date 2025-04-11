import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany } from "typeorm";
import { ERole } from "../../constants/role.enum";
import { ETableName } from "../../constants/table-name.enum";
import { BaseEntity } from "./base.entity";
import { GameTransactionEntity } from "./game-transaction.entity";

@Entity(ETableName.USER)
export class User extends BaseEntity {
  @Column({ unique: true })
  userName: string;

  @Column()
  fullName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: "varchar", enum: ERole, default: ERole.USER })
  role: ERole;

  @Column()
  balance: number;

  @Column({ unique: true })
  playerCode: string;

  @OneToMany(() => GameTransactionEntity, (transaction) => transaction.user)
  gameTransactions: GameTransactionEntity[];
}
