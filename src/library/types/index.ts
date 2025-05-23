export type ErrorData = Record<string, any>;

export type Minutes =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59;

export type Hours =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24;

export type Days = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type TimeFrame = 'day' | 'month' | 'year' | 'total';

export type TimeInMilliseconds<T extends string | number | symbol> = {
  [key in T]: number;
};

export interface decoded {
  userId: number;
  email: string;
}

export interface PayloadType {
  email: string;
  userId: number;
  roles: Roles[];
  artistId?: number;
}

export enum Roles {
  USER = 'user',
  ADMIN = 'admin',
  ARTIST = 'artist',
}
