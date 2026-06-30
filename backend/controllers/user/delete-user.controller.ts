import { Request, Response } from 'express';
import { DeleteUserService } from '@services/user/delete-user.service';
import { asyncHandler } from '@utils/async-handler';
import { success } from 'zod';

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = String(req.params.id);

  if (!userId || typeof userId !== "string") {
    res.status(401).json({
      success: false,
      message: "User ID not found or invalid",
    });
    return;
  }

  const performedBy = req.user
    ? { id: req.user.id, role: req.user.role }
    : undefined;
  const deletedUser = await DeleteUserService.deleteUser(userId , performedBy);

  res.status(200).json({
    success: true,
    message: 'User deactivated successfully',
    data: deletedUser,
  });
});
