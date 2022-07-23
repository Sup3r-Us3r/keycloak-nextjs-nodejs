interface IAppError {
  errorCode: string;
  message: string;
}

class AppError {
  public readonly errorCode: string;
  public readonly message: string;

  constructor({ errorCode, message }: IAppError) {
    this.errorCode = errorCode;
    this.message = message;
  }
}

export { AppError, type IAppError };
