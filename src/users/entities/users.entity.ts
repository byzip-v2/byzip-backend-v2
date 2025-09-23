import {
  UsersGenderEnum,
  UsersModelDto,
  UsersRolesEnum,
  UsersStatusEnum,
} from 'src/types/dto/user/user.dto';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UsersModel implements UsersModelDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  profileImageUrl?: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: string;

  @Column({
    type: 'enum',
    enum: Object.values(UsersGenderEnum),
    default: UsersGenderEnum.OTHER,
  })
  gender: UsersGenderEnum;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column({
    type: 'enum',
    enum: Object.values(UsersStatusEnum),
    default: UsersStatusEnum.PENDING_VERIFICATION,
  })
  status: UsersStatusEnum;

  @Column({
    type: 'enum',
    enum: Object.values(UsersRolesEnum),
    default: UsersRolesEnum.USER,
  })
  role: UsersRolesEnum;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  phoneVerified: boolean;
}
