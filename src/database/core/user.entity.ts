import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
}

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ length: 20 })
  name: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Column({ select: false, nullable: true })
  refreshToken?: string;
}
