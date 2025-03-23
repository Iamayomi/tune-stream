import { UserRole } from '../types';
import { Artist } from 'src/artists/artist.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { Subscription } from 'src/subscription/subscription.entity';

export interface IUser {
  /** User's id **/
  userId: number;

  /** User's fullname **/
  fullName: string;

  /** User's bio **/
  bio: string;

  /** user avatar url **/
  profileImage: string;

  /** User's username **/
  username: string;

  /** User's phone number **/
  phone: string;

  /** User's email **/
  email: string;

  /** Status checking terms and conditions of service */
  terms_of_service: boolean;

  /** Roles */
  roles: UserRole[];

  /** User's login password **/
  password: string;

  /** User's api key **/
  api_key: string;

  /** Email verification status. If email is not verified, their accounts cannot be accessed */
  verified_email: boolean;

  /** Phone verification status. If phone is not verified, their accounts cannot be accessed */
  verified_phone: boolean;

  subscriptions: Subscription[];

  /** user's playlist **/
  playlists: Playlist[];

  /** user's artist **/
  artist: Artist;

  /** user's refresh_token **/
  refresh_token: string;

  /** user's date created **/
  createdAt: Date;

  /** user's date updated **/
  updatedAt: Date;
}

/** Interface describing custom methods associated with the `User` Entity */
export interface IUserMethods {
  /** Verifies the provided password by comparing it with the password of the user. */
  verifyPassword: (candidatePassword: string) => Promise<boolean>;
}
