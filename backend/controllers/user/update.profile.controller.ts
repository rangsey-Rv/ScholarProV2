import {Request, Response} from "express";
import updateProfileService from "@services/user/update-profile.service";
import { updateProfileSchema } from "@validation/user/user.schema";
import { allowedImageMimeTypes } from "@middleware/multer";
import validateFileType from "@utils/validate-file-type"
export default async (req: Request, res: Response) => {
    const userId = String(req.user?.id);
    const payload = {
        ...req.body,
        ...(req.file && { profileUrl: `/image/${req.file.filename}` }) // Add file path if uploaded
    };

    if (req.file) {
        const fileCheck = await validateFileType(
          req.file.path,
          allowedImageMimeTypes
        );
        if (!fileCheck || fileCheck.success === false) {
          return res.status(400).json({
            success: false,
            message: fileCheck?.msg || "Invalid file type.",
          });
        }
    }

    const validateData = updateProfileSchema.parse(payload); 
    
    const result = await updateProfileService(userId, validateData);
    
    if(!result){
        res.status(404).json({
            success: false,
            message: "Fail to update profile"
        })
    }

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: result,
    });
};