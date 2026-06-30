import { apiClient } from "../api";
import { API_ENDPOINTS } from "../endpoint";

// Get all criteria
export const getCriteriaList = async () => {
  const response = await apiClient.get(API_ENDPOINTS.CITERIA);
  return response.data;
};

// Create new criterion
export const createCriterion = async (data: {
  name: string;
  weight: number;
  isActive?: boolean;
}) => {
  const response = await apiClient.post(API_ENDPOINTS.CREATE_CRITERIA, {
    ...data,
    isActive: data.isActive ?? true,
  });
  return response.data;
};

// Update criterion
export const updateCriterion = async (
  id: number,
  data: {
    name: string;
    weight: number;
  },
) => {
  const response = await apiClient.post(API_ENDPOINTS.CREATE_CRITERIA, {
    id,
    ...data,
  });
  return response.data;
};

// Toggle criterion active status
export const toggleCriterion = async (id: number, isActive: boolean) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.DEACTIVATE_CRITERIA(id),
    {
      isActive,
    },
  );
  return response.data;
};

// Delete criterion
export const deleteCriterion = async (id: number) => {
  const response = await apiClient.delete(`${API_ENDPOINTS.CITERIA}/${id}`);
  return response.data;
};
