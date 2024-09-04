declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: number;
        oAuthId: string;
        jti?: string;
      };
    }
  }
}