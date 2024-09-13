import { User } from "../src/config/passport";

declare module 'passport' {
    interface Authenticator {
      serializeUser<TID>(fn: (user: User, done: (err: any, id?: TID) => void) => void): void;
      deserializeUser<TID>(fn: (id: TID, done: (err: any, user?: User) => void) => void): void;
    }
  }