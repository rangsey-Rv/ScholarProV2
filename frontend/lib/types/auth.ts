export interface OAuthCallbackResponse {
  data?: {
    accessToken: string;
    refreshToken?: string;
  };
}
