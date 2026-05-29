import * as bcrypt from 'bcrypt';
import { IHasherProvider } from '../../application/providers/hasher.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptHasherProvider implements IHasherProvider {
  private readonly saltRounds = 10;

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashedText);
  }
}
