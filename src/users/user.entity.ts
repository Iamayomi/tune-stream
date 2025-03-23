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

import { Exclude, Expose } from 'class-transformer';
import { Artist } from 'src/artists/artist.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { Subscription } from '../subscription/subscription.entity';
import {
  generateUUID,
  getRandomAvatarUrl,
  getRandomNumbers,
} from '../library/utils';
import { UserRole } from './types';
import { IUser, IUserMethods } from './interfaces';
import { TIME_IN } from '../library/config/constants';

@Entity('users')
export class User implements IUser, IUserMethods {
  // @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', nullable: true })
  fullName: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true, default: getRandomAvatarUrl() })
  profileImage: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ type: 'varchar', nullable: true })
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

  @Column({ type: 'varchar', nullable: true })
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

  @Column({ unique: true, nullable: true })
  refresh_token: string;

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
    return await bcrypt.compare(password, this.password);
  }

  toJSON() {
    return this;
  }
}
