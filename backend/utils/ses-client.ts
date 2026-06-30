import { SESv2Client } from "@aws-sdk/client-sesv2";
import dotenv from "dotenv";
dotenv.config({
  path: [`.env.${process.env.NODE_ENV || "dev"}`, ".env"],
});

const sesClient = new SESv2Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
  ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        },
      }
    : {}),
});

export default sesClient;
