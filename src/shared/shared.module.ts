import { Global, Module } from '@nestjs/common';
import { BcryptHasherProvider } from './infrastructure/providers/bcrypt-hasher.provider';

export const HASHER_PROVIDER_TOKEN = 'HASHER_PROVIDER_TOKEN';

@Global()
@Module({
  providers: [
    {
      provide: HASHER_PROVIDER_TOKEN,
      useClass: BcryptHasherProvider,
    },
  ],
  exports: [HASHER_PROVIDER_TOKEN],
})
export class SharedModule {}
