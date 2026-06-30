export interface BakongDeeplinkResponse {
  responseCode: number;
  responseMessage: string;
  data: {
    shortLink: string;
  };
}

export interface BakongCheckTransactionResponse {
  responseCode: number;
  responseMessage: string;
  data?: any;
}

export interface BakongTokenResponse {
    responseCode: number;
    responseMessage: string;
    data: {
        token: string;
    }
}
