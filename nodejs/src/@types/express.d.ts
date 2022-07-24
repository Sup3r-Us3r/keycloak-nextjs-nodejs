declare namespace Express {
  export interface Request {
    kauth: {
      grant: {
        access_token: {
          token: string;
          clientId: string;
          header: object;
          content: object;
          signature: Buffer | any;
          signed: string;
        };
      }
    };
  }
}
