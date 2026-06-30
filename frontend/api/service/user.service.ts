import { apiClient } from "../api";
import { API_ENDPOINTS } from "../endpoint";

// 1. Get Profile
export const getProfile = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ME);
  return response.data;
};

// 2. Update Profile
export const updateProfile = async (
  data: Record<string, unknown> | FormData,
) => {
  const isFormData = data instanceof FormData;
  return await apiClient.patch(API_ENDPOINTS.ME, data, {
    headers: {
      "Content-Type": isFormData ? undefined : "application/json",
    },
  });
};
