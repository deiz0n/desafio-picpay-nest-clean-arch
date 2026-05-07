import { ResourceNotFoundException } from '../../../errors/ResourceNotFoundException';

export class AccountNotFoundException extends ResourceNotFoundException {
  constructor(message: string) {
    super(message);
    this.name = 'AccountNotFoundException';
  }
}
