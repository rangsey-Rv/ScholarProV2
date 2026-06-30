// src/api/service/schedule.service.ts
import {
  apiClient,
  fetchValidatedData,
  postValidatedData,
  putValidatedData,
} from "@/api/api";
import { API_ENDPOINTS } from "@/api/endpoint";
import { z } from "zod"; // Import Zod
import {
  BatchApiResponseSchema,
  CommitteesApiResponseSchema,
  FacultyApiResponseSchema,
  GetAllSessionsApiResponseSchema,
  RawBatchesResponseSchema,
  WrappedExamSessionResponseSchema,
  WrappedInterviewSessionResponseSchema,
  WrappedUnifiedDetailResponseSchema,
} from "@/lib/schema/schedule/response-schema";
import type {
  CreateInterviewSessionPayload,
  CreateExamSessionPayload,
} from "@/lib/schema/schedule/schedule-schema";

// Helper type for a simple "message" response that many backends use for PUT/DELETE
const SimpleMessageResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string(),
});

export const scheduleService = {
  // List batches
  listBatches: async () => {
    // Manually handle the inconsistent batches API response
    const response = await apiClient.get(API_ENDPOINTS.LIST_BATCH);
    const rawData = RawBatchesResponseSchema.parse(response.data); // Validate raw response

    // Transform to match the ApiResponseSchema structure expected by components
    return BatchApiResponseSchema.parse({ data: rawData.batches });
  },

  // Get all committees
  getAllCommittees: async () => {
    // Uses fetchValidatedData for runtime safety
    return fetchValidatedData(
      API_ENDPOINTS.GET_ALL_COMMITTEE,
      CommitteesApiResponseSchema,
    );
  },

  // Get all faculties
  getFaculties: async () => {
    // Uses fetchValidatedData for runtime safety
    return fetchValidatedData(
      API_ENDPOINTS.GET_FACULTY,
      FacultyApiResponseSchema,
    );
  },

  // Create exam session
  createExamSession: async (
    batchId: string,
    data: CreateExamSessionPayload, // Input type is inferred Zod type
  ) => {
    // Uses postValidatedData to POST the input (already validated by the form)
    // and validate the response data against the response schema
    return postValidatedData(
      API_ENDPOINTS.SCHEDULE.CREATE_EXAM(batchId),
      data,
      WrappedExamSessionResponseSchema, // Validate the response body
    );
  },

  // Create interview session
  createInterviewSession: async (
    batchId: string,
    data: CreateInterviewSessionPayload, // Input type is inferred Zod type
  ) => {
    return postValidatedData(
      API_ENDPOINTS.SCHEDULE.CREATE_EXAM(batchId), // Same endpoint
      data,
      WrappedInterviewSessionResponseSchema, // Validate the response body (different schema than exam)
    );
  },

  // Get exam session details
  getExamSessionDetail: async (id: string) => {
    // Uses fetchValidatedData for GET request runtime safety
    // NOTE: This endpoint is used for both exams and interviews, which have different response shapes.
    // We are now using a unified schema to handle both cases.
    return fetchValidatedData(
      API_ENDPOINTS.SCHEDULE.GET_EXAM_SESSION_DETAIL(id),
      WrappedUnifiedDetailResponseSchema,
    );
  },

  // Update exam session
  updateExamSession: async (
    id: string,
    data: CreateExamSessionPayload, // Input type is inferred Zod type
  ) => {
    // Use postValidatedData utility for PUT request runtime safety
    return postValidatedData(
      API_ENDPOINTS.SCHEDULE.UPDATE_EXAM(id),
      data,
      WrappedExamSessionResponseSchema,
    );
  },

  // Update interview session
  updateInterviewSession: async (
    id: string,
    data: CreateInterviewSessionPayload, // Input type is inferred Zod type
  ) => {
    return putValidatedData(
      API_ENDPOINTS.SCHEDULE.UPDATE_EXAM(id),
      data,
      WrappedInterviewSessionResponseSchema,
    );
  },

  // Delete exam session
  deleteExamSession: async (id: string) => {
    // We cannot use postValidatedData easily with a DELETE request without a body.
    // We can use a standard apiClient.delete and manually parse the response data.
    const response = await apiClient.delete(
      API_ENDPOINTS.SCHEDULE.DELETE_SESSION(id),
    );
    // Manually validate just this response data:
    return SimpleMessageResponseSchema.parse(response.data);
  },

  // Get all sessions for a batch
  getAllSessions: async (batchId: string) => {
    // Uses fetchValidatedData for GET request runtime safety
    return fetchValidatedData(
      API_ENDPOINTS.SCHEDULE.GET_ALL_SESSIONS(batchId),
      GetAllSessionsApiResponseSchema,
    );
  },
};
