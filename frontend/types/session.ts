export interface Session {
  jti: string;
  current: boolean;
  createdAt?: string | number;
  ip?: string;
  userAgent?: string;
}

export type Sessions = Session[];
