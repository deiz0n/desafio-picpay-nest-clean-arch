import { ConfigService } from '@nestjs/config';
import { AuthorizationGatewayResponse } from '../../core/authorization-gateway-response';
import { IHttpCircuitBreaker } from './http-circuit-breaker';

export interface ITransactionAuthorizationGateway {
  authorize(): Promise<boolean>;
}

export class HttpAuthorizationGateway implements ITransactionAuthorizationGateway {
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly circuitBreaker: IHttpCircuitBreaker,
  ) {
    this.baseUrl = this.configService.get<string>('AUTHORIZATION_SERVICE_URL')!;
  }

  async authorize(): Promise<boolean> {
    try {
      const payload = await this.circuitBreaker.fire(async () => {
        const response = await fetch(this.baseUrl);
        return (await response.json()) as AuthorizationGatewayResponse;
      });

      return payload.status === 'success' && payload.data.authorization;
    } catch (error) {
      console.error('Error calling the authorization service:', error);
      return false;
    }
  }
}
