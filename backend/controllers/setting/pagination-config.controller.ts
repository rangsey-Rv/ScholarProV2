import { asyncHandler } from "@utils/async-handler";
import { PaginationConfigService } from "@services/setting/pagination-config.service";

export const UpdatePaginationLimit = asyncHandler(async (req, res) => {
  const { limit } = req.body;

  if (!limit || isNaN(limit) || limit < 1) {
    res.status(400).json({
      success: false,
      message: "Limit must be a positive number",
    });
    return; // stop execution
  }

  const result = await PaginationConfigService.updateDefaultLimit(Number(limit));

  res.status(200).json({
    success: true,
    message: "Default pagination limit updated successfully",
    data: result,
  });
});
