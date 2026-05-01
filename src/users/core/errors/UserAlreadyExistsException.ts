import { ResourceAlreadyExistsException } from '../../../errors/ResourceAlreadyExistsException';

export class UserAlreadyExistsException extends ResourceAlreadyExistsException {
  constructor(message: string) {
    super(message);
    this.name = 'UserAlreadyExistsException';
  }
}
