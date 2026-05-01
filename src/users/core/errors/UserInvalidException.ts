import { ResourceInvalidException } from '../../../errors/ResourceInvalidException';

export class UserInvalidException extends ResourceInvalidException {
  constructor(message: string) {
    super(message);
    this.name = 'UserInvalidException';
  }
}
