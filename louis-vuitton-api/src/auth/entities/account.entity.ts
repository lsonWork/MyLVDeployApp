import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AccountRole } from '../account-role.enum';
import { Exclude } from 'class-transformer';
@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column()
  role: AccountRole;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  status: boolean;

  @Column({ nullable: true })
  otp: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpired: Date;
}
