import { GetUsersService } from "@services/user/get-users.service";
import { asyncHandler } from "@utils/async-handler";
import { getPagination } from "@utils/pagination";

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const isActive =
    req.query.isActive !== undefined
      ? req.query.isActive === "true"
      : undefined;
  const result = await GetUsersService.getAllUsers(isActive,page, limit);
  
  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getUsersByRole = asyncHandler(async (req, res) => {
  const role = req.params.role as 'admin' | 'committee';
  const { page, limit } = getPagination(req.query);
  const isActive =
    req.query.isActive !== undefined
      ? req.query.isActive === "true"
      : undefined;
  
  const result = await GetUsersService.getUsersByRole(role, isActive, page, limit);
  
  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const userId = String(req.user?.id);
  
  const result = await GetUsersService.getUserById(userId);
  
  res.status(200).json({
    success: true,
    data: result,
  });
});
