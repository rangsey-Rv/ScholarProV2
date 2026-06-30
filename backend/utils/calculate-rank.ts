interface RankableItem {
  applicationId: number;
  totalApplicationScore: number;
}

export function calculateRanks(applicants: RankableItem[] ): Map<number, number> {
  
    const sorted = [...applicants].sort(
    (a, b) => b.totalApplicationScore - a.totalApplicationScore
  );

  const rankMap = new Map<number, number>();
  let currentRank = 1;

  for (let i = 0; i < sorted.length; i++) {
    if (
      i > 0 &&
      sorted[i].totalApplicationScore !== sorted[i - 1].totalApplicationScore
    ) {
      currentRank = i + 1;
    }

    rankMap.set(sorted[i].applicationId, currentRank);
  }

  return rankMap;
}
