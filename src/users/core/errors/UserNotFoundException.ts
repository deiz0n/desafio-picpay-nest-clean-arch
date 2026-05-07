import { ResourceNotFoundException } from '../../../errors/ResourceNotFoundException';

export class UserNotFoundException extends ResourceNotFoundException {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundException';
  }
}
