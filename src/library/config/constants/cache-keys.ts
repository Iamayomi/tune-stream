export const SESSION_USER = (userId: string) => `SESSION_USER-${userId}`;

export const RP_SESSION_USER = (userId: string) => `RP_SESSION_USER-${userId}`;

export const REFRESH_TOKEN = (userId: string) => `REFRESH_TOKEN-${userId}`;

export const RP_TOKEN = (userId: string) => `RP_TOKEN-${userId}`;

export const NP_TOKEN = (userId: string) => `NP_TOKEN-${userId}`;

export const VERIFY_EMAIL = (email: string) => `VERIFY_EMAIL-${email}`;

export const STATS_SONG = (time: string) => `STATS_SONG-${time}`;

export const STATS_ALBUM = (time: string) => `STATS_ALBUM-${time}`;

export const STATS_ARTIST = (time: string) => `STATS_ARTIST-${time}`;

export const STATS_USER = (userId: string, category: string, time: string) =>
  `STATS_USER-${userId}-${category}-${time}`;
