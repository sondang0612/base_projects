import { Exclude } from "class-transformer";
import { Column, Entity } from "typeorm";
import { ERole } from "../../constants/role.enum";
import { ETableName } from "../../constants/table-name.enum";
import { BaseEntity } from "./base.entity";

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
}
