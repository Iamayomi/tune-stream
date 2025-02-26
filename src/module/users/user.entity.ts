import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { Exclude } from 'class-transformer';
import { Artist } from 'src/module/artists/artist.entity';
import { Playlist } from 'src/module/playlists/playlist.entity';
import { Subscription } from '../subscription/subscription.entity';
import {
  generateUUID,
  getRandomNumbers,
} from '../../common/library/helper/utils';
import { UserRole } from './types';
import { IUser, IUserMethods } from './interfaces';
import { timeIn } from '../../common';

@Entity('users')
export class User implements IUser, IUserMethods {
  // @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  fullName: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ type: 'varchar', default: 'user' })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', default: 'free' })
  subscription: string;

  @Column({ type: 'boolean', default: 'false' })
  terms_of_service: boolean;

  @Column('text', { array: true, default: [UserRole.USER] })
  roles: UserRole[];

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'varchar' })
  api_key: string;

  @Column({ type: 'boolean', default: false })
  verified_email: boolean;

  @Column({ type: 'boolean', default: false })
  verified_phone: boolean;

  @OneToMany(() => Subscription, (subscription) => subscription.user, {
    cascade: true,
  })
  subscriptions: Subscription[];

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];

  @OneToOne(() => Artist, (artist) => artist.user)
  artist: Artist;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeInsert()
  async generateAPIkey() {
    if (!this.api_key) {
      this.api_key = await generateUUID(30);
    }
  }

  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  async createAccessToken(
    expiresAt: number | string | undefined,
  ): Promise<string> {
    return jwt.sign(
      {
        userId: this.id,
        roles: this.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: expiresAt },
    );
  }

  async createEmailVerificationToken(length?: number, exp?: string) {
    const { code } = getRandomNumbers(length);

    const data = {
      code,
      email: this.email,
    };

    const token = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: `${exp || timeIn.hours[1]}`,
    });

    return { ...data, token };
  }
}
