export interface AuthorizationGatewayResponse {
  status: string;
  data: {
    authorization: boolean;
  };
}
