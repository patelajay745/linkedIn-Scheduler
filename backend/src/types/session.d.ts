export {};

declare module "express-session" {
  interface SessionData {
    authenticated: boolean;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}
