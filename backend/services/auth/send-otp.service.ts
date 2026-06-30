// import { db } from "@db";
// import { inviteUsers } from "@db/schema/invite-user";
// import { sendEmail } from "@services/email/send-email.service";
// import bcrypt from "bcryptjs";
// import { eq, and } from "drizzle-orm";
// import generatePassword from "@utils/generate-temporary-password";

// export default async (token: string) => {
//   const [verifyEmail] = await db
//     .select({
//       name: inviteUsers.name,
//       email: inviteUsers.email,
//       status: inviteUsers.status,
//       expiresAt: inviteUsers.expiresAt,
//     })
//     .from(inviteUsers)
//     .where(eq(inviteUsers.id, token));


//   if (verifyEmail.expiresAt <= new Date()) {
//     await db
//       .update(inviteUsers)
//       .set({ status: "fail" })
//       .where(eq(inviteUsers.id, token));

//     return {
//       success: false,
//       msg: "Invalid or expired token",
//     };
//   }   
//   else if(verifyEmail.status === "accept"){
//     return {
//       success: false,
//       msg: "User already exist in the system",
//     };
//   }
//   if (!verifyEmail) {
//     return {
//       success: false,
//       msg: "Invalid email address",
//     };
//   }

//   const password = generatePassword(10);

//   const hashPassword = await bcrypt.hash(password, 10);

//   const record = await db
//     .update(inviteUsers)
//     .set({
//       otp: hashPassword,
//       isUsedOtp: false,
//       otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
//     })
//     .where(eq(inviteUsers.id, token));

//   const subject = "Your ScholarPro one time password";
//   const bodyHtml = `<div style="font-family: sans-serif; line-height: 1.5;">
//   <h2>Hello {{name}},</h2>

//   <p>Your one-time password (OTP) for completing your ScholarPro registration is:</p>

//   <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">
//     {{otp}}
//   </div>

//   <p>This code is valid for <strong>5 minutes</strong>. Please use it as soon as possible.</p>

//   <p>If you did not request this code, you can ignore this email.</p>

//   <p>Thanks,<br/>ScholarPro Team</p>
// </div>`;

//   const variable = {
//     otp: password,
//     name: verifyEmail.name || "",
//   };

//   const email = verifyEmail.email;
//   const emailSend = await sendEmail(email, subject, bodyHtml, variable);

//   if (!emailSend?.MessageId) {
//     return {
//       success: false,
//       msg: "Failed to send otp. Please check the email address or try again.",
//     };
//   }

//   return {
//     success: true,
//     msg: "Otp send successfully",
//     data: emailSend,
//   };
// };
