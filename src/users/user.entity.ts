import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';

import { Exclude } from 'class-transformer';
import { Artist } from 'src/artists/artist.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { generateUUID, getRandomAvatarUrl } from '../library/utils';
import { UserRole } from './types';
import { IUser, IUserMethods } from './interfaces';
import { Song } from 'src/songs/song.entity';
import { Album } from 'src/albums/album.entity';
import { Comment } from 'src/comments/comment.entity';
import { Notification } from 'src/notification/notification.entity';

@Entity('users')
export class User implements IUser, IUserMethods {
  // @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  fullName: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true, default: getRandomAvatarUrl() })
  profileUrl: string;

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

  @OneToMany(() => Subscription, (subscription) => subscription.ownerUsererId, {
    cascade: true,
  })
  subscriptions: Subscription;

  @OneToMany(() => Playlist, (playlist) => playlist.creator)
  playlists: Playlist[];

  @OneToOne(() => Artist, (artist) => artist.user)
  artist: Artist;

  @ManyToMany(() => Song, (song) => song.likedByUsers)
  likedSongs: Song[];

  @ManyToMany(() => Album, (album) => album.followers)
  followedAlbums: Album[];

  @ManyToMany(() => Artist, (artist) => artist.followers)
  followedArtists: Artist[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @Column({ unique: true, nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  firebaseToken: string;

  @Column({ type: 'timestamp', nullable: true })
  firebaseTokenUpdatedAt: Date;

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
