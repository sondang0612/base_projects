import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";
import { EGameTransactionType } from "../../constants/game-transaction-type.enum";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { ETableName } from "../../constants/table-name.enum";

@Entity(ETableName.GAME_TRANSACTIONS)
export class GameTransactionEntity extends BaseEntity {
  @Column({ unique: true })
  uuid: string;

  @Column()
  playerCode: string;

  @Column()
  providerCode: string;

  @Column()
  gameCode: string;

  @Column()
  gameName: string;

  @Column()
  gameName_en: string;

  @Column({ nullable: true })
  gameCategory: string;

  @Column()
  roundId: string;

  @Column({
    type: "varchar",
    enum: EGameTransactionType,
  })
  type: EGameTransactionType;

  @Column("decimal", { precision: 16, scale: 4 })
  amount: number;

  @Column({ nullable: true })
  referenceUuid: string;

  @Column({ default: false })
  roundStarted: boolean;

  @Column({ default: false })
  roundFinished: boolean;

  @Column({ nullable: true })
  details: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.gameTransactions)
  @JoinColumn({ name: "playerCode", referencedColumnName: "playerCode" })
  user: User;
}
