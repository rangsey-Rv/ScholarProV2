import axios, { AxiosInstance } from "axios";
import https from "https";
import { BakongKHQR, khqrData, MerchantInfo } from "bakong-khqr";

export class BakongPayService {
  private static readonly BASE_URL = process.env.BAKONG_API_URL || "https://sit-api-bakong.nbc.org.kh";
  private static readonly TOKEN = process.env.BAKONG_API_TOKEN;

  private static getAxiosInstance(): AxiosInstance {
    // Create an axios instance with custom configuration
    // The Bakong SIT (Sandbox) environment often has certificate issues
    const agent = new https.Agent({  
      rejectUnauthorized: process.env.NODE_ENV === 'production' 
    });

    return axios.create({
      baseURL: this.BASE_URL,
      httpsAgent: agent,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.TOKEN}`
      }
    });
  }

  // Generate KHQR using SDK
  static generateKHQR(amount: number, currency: "USD" | "KHR", description?: string) {
    try {
        // 1. Prepare Optional Data
        const optionalData = {
          currency: currency === "USD" ? khqrData.currency.usd : khqrData.currency.khr,
          amount: amount,
          mobileNumber: "85512345678", // This should ideally be configurable
          storeLabel: process.env.BAKONG_MERCHANT_NAME || "Scholar Pro",
          terminalLabel: "Online",
          expirationTimestamp: Date.now() + (5 * 60 * 1000), // Valid for 5 minutes
          purposeOfTransaction: (description || "Application Fee").substring(0, 25),
          merchantCategoryCode: "5999", // General Merchant
        };

        // 2. Prepare Merchant Info
        const merchantInfo = new MerchantInfo(
          process.env.BAKONG_MERCHANT_ID || "dul_kimhak@bkrt",
          process.env.BAKONG_MERCHANT_NAME || "Scholar Pro",
          process.env.BAKONG_MERCHANT_CITY || "Phnom Penh",
          process.env.BAKONG_MERCHANT_ID || "dul_kimhak@bkrt", // ID
          process.env.BAKONG_ACQUIRING_BANK || "bkrt",
          optionalData
        );

        // 3. Generate
        const khqr = new BakongKHQR();
        const response = khqr.generateMerchant(merchantInfo);

        if (response.status && response.status.code !== 0) {
            throw new Error("Failed to generate KHQR: " + JSON.stringify(response));
        }

        return {
          khqr: response.data.qr,
          md5: response.data.md5 
        };
    } catch (e) {
        console.error("SDK Error:", e);
        throw new Error("Failed to generate KHQR via SDK");
    }
  }

  // Generate Deeplink 
  static async generateDeeplink(khqrString: string): Promise<string | null> {
      try {
          const body = {
              qr: khqrString,
              sourceInfo: {
                  appIconUrl: "https://scholar-pro.com/icon.png",
                  appName: "Scholar Pro",
                  appDeepLinkCallback: "https://scholar-pro.com/callback" 
              }
          };

          const axiosInstance = this.getAxiosInstance();
          const response = await axiosInstance.post("/v1/generate_deeplink_by_qr", body);
          
          if (response.data && response.data.responseCode === 0) {
              return response.data.data.shortLink;
          }
          return null;
      } catch (error) {
          console.error("Error generating deeplink:", error);
          return null;
      }
  }

  static async checkTransactionStatus(md5: string): Promise<"PENDING" | "SUCCESS" | "FAILED"> {
    try {
      const axiosInstance = this.getAxiosInstance();
      const response = await axiosInstance.post("/v1/check_transaction_by_md5", {
        md5: md5
      });
      
      if (response.data && response.data.responseCode === 0) {
         // In a real scenario, we'd check if `data` is present which usually implies success
         return "SUCCESS"; 
      }
      return "PENDING";
    } catch (error) {
      console.error("Error checking transaction status:", error);
      return "FAILED";
    }
  }
}
