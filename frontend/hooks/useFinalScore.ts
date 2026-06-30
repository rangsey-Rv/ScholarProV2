import * as React from "react";
import { apiClient } from "@/api/api";
import { API_ENDPOINTS } from "@/api/endpoint";

export type FinalScoreResult = {
  interviewScore?: number | null;
  mathScore?: number | null;
  englishScore?: number | null;
  finalScore?: number | null;
  batchRank?: number | null;
  batchTotal?: number | null;
  interviewWeight?: number | null;
  mathWeight?: number | null;
  englishWeight?: number | null;
  raw?: unknown;
};

export function useFinalScore(applicationId?: string) {
  const [data, setData] = React.useState<FinalScoreResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!applicationId) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(
        `${API_ENDPOINTS.FINAL_SCORE}?applicationId=${encodeURIComponent(String(applicationId))}`,
      );
      const payload = res?.data?.data ?? res?.data ?? null;

      // Normalize payload: some responses return an array with a single record
      const record = Array.isArray(payload) ? payload[0] : payload;

      // Helper to find subject object by name (case-insensitive)
      type Subject = {
        subjectName?: string;
        score?: number | string | null;
        weight?: number | string | null;
        [key: string]: unknown;
      };

      const findSubject = (name: string) => {
        const subjects = record?.subjects as unknown as Subject[] | undefined;
        if (!Array.isArray(subjects)) return null;
        return (
          subjects.find((s) => {
            const n = String(s?.subjectName ?? "").toLowerCase();
            return n === name.toLowerCase();
          }) ?? null
        );
      };

      const interviewSub = findSubject("interview");
      const mathSub = findSubject("math");
      const englishSub = findSubject("english");

      const interviewFromSubjects = interviewSub
        ? typeof interviewSub.score === "number"
          ? interviewSub.score
          : Number(interviewSub.score)
        : null;
      const mathFromSubjects = mathSub
        ? typeof mathSub.score === "number"
          ? mathSub.score
          : Number(mathSub.score)
        : null;
      const englishFromSubjects = englishSub
        ? typeof englishSub.score === "number"
          ? englishSub.score
          : Number(englishSub.score)
        : null;

      const interviewWeight = interviewSub
        ? typeof interviewSub.weight === "number"
          ? interviewSub.weight
          : Number(interviewSub.weight)
        : null;
      const mathWeight = mathSub
        ? typeof mathSub.weight === "number"
          ? mathSub.weight
          : Number(mathSub.weight)
        : null;
      const englishWeight = englishSub
        ? typeof englishSub.weight === "number"
          ? englishSub.weight
          : Number(englishSub.weight)
        : null;

      const result: FinalScoreResult = {
        interviewScore:
          interviewFromSubjects ??
          record?.interviewScore ??
          record?.interview ??
          record?.avgInterview ??
          null,
        mathScore:
          mathFromSubjects ?? record?.mathScore ?? record?.math ?? null,
        englishScore:
          englishFromSubjects ??
          record?.englishScore ??
          record?.english ??
          null,
        interviewWeight:
          interviewWeight ??
          record?.interviewWeight ??
          record?.interview_weight ??
          null,
        mathWeight:
          mathWeight ?? record?.mathWeight ?? record?.math_weight ?? null,
        englishWeight:
          englishWeight ??
          record?.englishWeight ??
          record?.english_weight ??
          null,
        finalScore:
          record?.totalFinalScore ??
          record?.finalScore ??
          record?.score ??
          null,
        batchRank: record?.batchRank ?? record?.rank ?? null,
        batchTotal: record?.batchTotal ?? record?.batchSize ?? null,
        raw: record,
      };

      setData(result);
      return result;
    } catch (err) {
      setError(err as unknown);
      return null;
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData } as const;
}
