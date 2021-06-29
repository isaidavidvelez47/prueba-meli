export enum HttpStatus {
  OK = 200,
  ACCEPTED = 202,
}

export enum HttpErrors {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  SOCKET_ERROR = 700,
}

class HttpError extends Error {
  constructor(public status: HttpErrors, public message: string) {
    super(message);
  }
}

export default HttpError;
