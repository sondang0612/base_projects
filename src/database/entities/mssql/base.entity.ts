// base.entity.ts
import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Exclude()
  @CreateDateColumn({ type: "datetime2" })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: "datetime2" })
  updatedAt: Date;

  @Exclude()
  @Column({ default: false })
  isDeleted: boolean;

  @Exclude()
  @Column()
  createdBy: string;
}
