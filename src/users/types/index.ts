export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  ARTIST = 'artist',
  MODERATOR = 'moderator',
}

export interface UserAuthRes {
  success: boolean;
  message: string;
}

export interface SendEmailResponse {
  accessToken: string;
  message: string;
}
