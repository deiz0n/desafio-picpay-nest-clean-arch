export class ResourceInvalidException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceInvalidException';
  }
}
