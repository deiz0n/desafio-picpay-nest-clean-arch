export class ForbiddenActionException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenActionException';
  }
}
