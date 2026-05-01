import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

@Global()
@Module({
  providers: [
    {
      provide: 'DRIZZLE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) throw new Error('DATABASE_URL not defined');

        const client = postgres(databaseUrl);
        return drizzle(client, { schema: {} });
      },
    },
  ],
  exports: ['DRIZZLE'],
})
export class DrizzleModule {}
