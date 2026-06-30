import { apiClient } from "../api";
import { API_ENDPOINTS } from "../endpoint";

// Get all criteria
export const getsubjectList = async () => {
  const response = await apiClient.get(API_ENDPOINTS.GET_ALL_SUBJECTS);
  return response.data;
};

// Create new criterion
export const createSubject = async (data: {
  subjectName: string;
  weight: number;
  isActive?: boolean;
}) => {
  const response = await apiClient.post(API_ENDPOINTS.CREATE_SUBJECT, {
    ...data,
    isActive: data.isActive ?? true,
  });
  return response.data;
};

// Update criterion
export const updateSubject = async (
  id: number,
  data: {
    subjectName: string;
    weight: number;
  },
) => {
  const response = await apiClient.patch(API_ENDPOINTS.UPDATE_SUBJECT(id), {
    id,
    ...data,
  });
  return response.data;
};

// Toggle criterion active status
// export const toggleSubject = async (id: number, isActive: boolean) => {
//   const response = await apiClient.patch(
//     API_ENDPOINTS.DEACTIVATE_CRITERIA(id),
//     {
//       isActive,
//     },
//   );
//   return response.data;
// };
