import {Request, Response} from "express";
import {UpdateUserService} from "@services/user/update-user.service";
import {asyncHandler} from "@utils/async-handler";

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = String(req.user?.id);
    const updatedUser = await UpdateUserService.updateUser(userId, req.body);
    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
    });
});