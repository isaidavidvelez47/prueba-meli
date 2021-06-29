class AppError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class InvalidUser extends AppError {}

export default AppError;
