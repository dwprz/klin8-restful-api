export class ResponseError extends Error {
  constructor(status, message) {
    super(message);
  }
}
