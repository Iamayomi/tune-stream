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

import { Exclude } from 'class-transformer';
import { Artist } from 'src/module/artists/artist.entity';
import { Playlist } from 'src/module/playlists/playlist.entity';
import { Subscription } from '../subscription/subscription.entity';
import { generateUUID } from '../../common/library/helper/utils';

@Entity('users')
export class User {
  // @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', default: 'free' })
  subscription: string;

  @Column({ type: 'varchar', default: 'false' })
  terms_of_service: boolean;

  @Column()
  @Exclude()
  password: string;

  @Column()
  apiKey: string;

  @Column({ nullable: true })
  refresh_token?: string;

  @Column({ default: false })
  verified_email: boolean;

  @Column({ default: false })
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
    if (!this.apiKey) {
      this.apiKey = await generateUUID(30);
    }
  }

  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
