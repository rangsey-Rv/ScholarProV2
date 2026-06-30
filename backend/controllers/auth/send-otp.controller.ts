// import sendOtpService from "@services/auth/send-otp.service";
// import { Request, Response } from "express";
// import { tokenUrl } from "@validation/user/auth.schema";
// export default async(req: Request, res: Response)=>{
 
//     const  token  = tokenUrl.parse(req.params.token);

//     const result = await sendOtpService(token);

//     if (!result?.success || !result) {
//       return res.status(404).json({
//         success: false,
//         message: result.msg,
//       });
//     }

//     return res.status(200).json({
//         success: true,
//         message: result.msg,
//         data: result.data
//     })
// }