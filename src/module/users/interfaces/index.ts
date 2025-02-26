import { UserRole } from '../types';
import { Artist } from 'src/module/artists/artist.entity';
import { Playlist } from 'src/module/playlists/playlist.entity';
import { Subscription } from 'src/module/subscription/subscription.entity';

export interface IUser {
  /** User's id **/
  id: number;

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

  /** user's date created **/
  createdAt: Date;

  /** user's date updated **/
  updatedAt: Date;
}

/** Interface describing custom methods associated with the `User` Entity */
export interface IUserMethods {
  /** Verifies the provided password by comparing it with the password of the user. */
  verifyPassword: (candidatePassword: string) => Promise<boolean>;

  /** Creates and returns a `jwt` access token encoded with `userId`, `roles` and  properties */
  createAccessToken: (
    expiresAt?: number | string | undefined,
  ) => Promise<string>;

  /** Creates and returns a `jwt` token encoded with the `email`, `code`, and `expiresAt` properties that will be sent when there's a request to reset a forgotten password.
   * @param maxLength The maximum length of the code generated (i.e. number of digits)
   * @param expiresAt Code expiration time in `minutes`
   */
  // createResetPasswordToken: (
  //   maxLength?: number,
  //   expiresAt?: number,
  // ) => {
  //   code: number;
  //   expiresAt: number;
  //   token: string;
  //   email: string;
  // };

  /** Creates and returns a `jwt` token encoded with the `email` and `code` properties which is required to be sent along when there's a request to verify a user's email */
  createEmailVerificationToken: (
    maxLength?: number,
    exp?: string | number,
  ) => Promise<{
    code: number;
    token: string;
    email: string;
  }>;
}
