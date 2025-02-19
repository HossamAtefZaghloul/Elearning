import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';

import { User } from './user.entity';

@Entity()
export class UserProfile extends BaseEntity {
  @Column()
  fullName: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
