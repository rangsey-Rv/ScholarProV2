declare module "bakong-khqr" {
  export class MerchantInfo {
    constructor(
      merchantId: string,
      merchantName: string,
      merchantCity: string,
      merchantAccountInformation: string,
      acquiringBank: string,
      optionalData?: Record<string, unknown>
    );
  }

  export class BakongKHQR {
    generateMerchant(merchantInfo: MerchantInfo): {
      status?: {
        code?: number;
      };
      data: {
        qr: string;
        md5: string;
      };
    };
  }

  export const khqrData: {
    currency: {
      usd: unknown;
      khr: unknown;
    };
  };
}
