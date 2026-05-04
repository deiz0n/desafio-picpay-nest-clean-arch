import { Injectable } from '@nestjs/common';
import Opossum from 'opossum';

export interface IHttpCircuitBreaker {
  fire<T>(action: () => Promise<T>): Promise<T>;
}

@Injectable()
export class HttpCircuitBreaker implements IHttpCircuitBreaker {
  private readonly breaker: Opossum<any, any>;

  constructor() {
    this.breaker = new Opossum(
      async <T>(action: () => Promise<T>): Promise<T> => {
        return await action();
      },
      {
        timeout: 3000,
        errorThresholdPercentage: 50,
        resetTimeout: 30000,
      },
    );
  }

  async fire<T>(action: () => Promise<T>): Promise<T> {
    return this.breaker.fire(action) as Promise<T>;
  }
}
