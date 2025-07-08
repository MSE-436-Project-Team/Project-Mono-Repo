import type { PlayerStats, ScoringWeights, FantasyProjection } from '../types/nba';

// Default fantasy scoring weights (standard points league)
export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  points: 1.0,
  rebounds: 1.2,
  assists: 1.5,
  steals: 3.0,
  blocks: 3.0,
  turnovers: -1.0,
  fieldGoalsMade: 0,
  fieldGoalsAttempted: 0,
  threePointsMade: 0,
  threePointsAttempted: 0,
  freeThrowsMade: 0,
  freeThrowsAttempted: 0,
  offensiveRebounds: 1.2,
  defensiveRebounds: 1.2,
  personalFouls: -0.5,
};

/**
 * Calculate fantasy points for a player based on their stats and scoring weights
 */
export function calculateFantasyPoints(
  stats: PlayerStats,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): number {
  const {
    Points,
    REB,
    AST,
    STL,
    BLK,
    TO,
    FGM,
    FGA,
    '3PM': threePM,
    '3PA': threePA,
    FTM,
    FTA,
    OREB,
    DREB,
    PF,
  } = stats;

  let fantasyPoints = 0;

  // Basic stats
  fantasyPoints += Points * weights.points;
  fantasyPoints += REB * weights.rebounds;
  fantasyPoints += AST * weights.assists;
  fantasyPoints += STL * weights.steals;
  fantasyPoints += BLK * weights.blocks;
  fantasyPoints += TO * weights.turnovers;

  // Shooting stats (if included in scoring)
  fantasyPoints += FGM * weights.fieldGoalsMade;
  fantasyPoints += FGA * weights.fieldGoalsAttempted;
  fantasyPoints += threePM * weights.threePointsMade;
  fantasyPoints += threePA * weights.threePointsAttempted;
  fantasyPoints += FTM * weights.freeThrowsMade;
  fantasyPoints += FTA * weights.freeThrowsAttempted;

  // Additional fantasy stats
  fantasyPoints += OREB * weights.offensiveRebounds;
  fantasyPoints += DREB * weights.defensiveRebounds;
  fantasyPoints += PF * weights.personalFouls;

  return Math.round(fantasyPoints * 100) / 100; // Round to 2 decimal places
}

/**
 * Project player stats for next game based on recent performance
 */
export function projectPlayerStats(stats: PlayerStats): {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
} {
  // Use 5-game average as base projection with some regression to career mean
  const recentWeight = 0.7;
  const careerWeight = 0.3;

  const projectedPoints = 
    (stats.Points_5G_AVG * recentWeight + stats.Points * careerWeight) || stats.Points;
  const projectedRebounds = 
    (stats.REB_5G_AVG * recentWeight + stats.REB * careerWeight) || stats.REB;
  const projectedAssists = 
    (stats.AST_5G_AVG * recentWeight + stats.AST * careerWeight) || stats.AST;
  const projectedSteals = 
    (stats.STL_5G_AVG * recentWeight + stats.STL * careerWeight) || stats.STL;
  const projectedBlocks = 
    (stats.BLK_5G_AVG * recentWeight + stats.BLK * careerWeight) || stats.BLK;
  const projectedTurnovers = 
    (stats.TO_5G_AVG * recentWeight + stats.TO * careerWeight) || stats.TO;

  return {
    points: Math.round(projectedPoints * 10) / 10,
    rebounds: Math.round(projectedRebounds * 10) / 10,
    assists: Math.round(projectedAssists * 10) / 10,
    steals: Math.round(projectedSteals * 10) / 10,
    blocks: Math.round(projectedBlocks * 10) / 10,
    turnovers: Math.round(projectedTurnovers * 10) / 10,
  };
}

/**
 * Generate fantasy projections for all players
 */
export function generateFantasyProjections(
  players: PlayerStats[],
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): FantasyProjection[] {
  const projections: FantasyProjection[] = players.map((player) => {
    const projectedStats = projectPlayerStats(player);
    
    // Create a projected stats object for fantasy point calculation
    const projectedStatsForCalculation: PlayerStats = {
      ...player,
      Points: projectedStats.points,
      REB: projectedStats.rebounds,
      AST: projectedStats.assists,
      STL: projectedStats.steals,
      BLK: projectedStats.blocks,
      TO: projectedStats.turnovers,
    };

    const projectedFantasyPoints = calculateFantasyPoints(projectedStatsForCalculation, weights);

    return {
      player: {
        PERSON_ID: player.PERSON_ID,
        DISPLAY_FIRST_LAST: player.DISPLAY_FIRST_LAST,
        TEAM_ABBREVIATION: player.TEAM_ABBREVIATION,
        POSITION_CATEGORY: player.POSITION_CATEGORY,
        AGE: player.AGE,
        EXPERIENCE_YEARS: player.EXPERIENCE_YEARS,
        HEIGHT_INCHES: player.HEIGHT_INCHES,
        WEIGHT: player.WEIGHT,
        BMI: player.BMI,
        DRAFT_POSITION: player.DRAFT_POSITION,
        TOP_10_PICK: player.TOP_10_PICK,
        LOTTERY_PICK: player.LOTTERY_PICK,
      },
      stats: player,
      projectedFantasyPoints,
      projectedStats,
      rank: 0, // Will be set after sorting
    };
  });

  // Sort by projected fantasy points and assign ranks
  return projections
    .sort((a, b) => b.projectedFantasyPoints - a.projectedFantasyPoints)
    .map((projection, index) => ({
      ...projection,
      rank: index + 1,
    }));
}

/**
 * Filter projections by position
 */
export function filterProjectionsByPosition(
  projections: FantasyProjection[],
  position: string | 'ALL'
): FantasyProjection[] {
  if (position === 'ALL') return projections;
  return projections.filter(p => p.player.POSITION_CATEGORY === position);
}

/**
 * Get top N projections
 */
export function getTopProjections(
  projections: FantasyProjection[],
  count: number = 20
): FantasyProjection[] {
  return projections.slice(0, count);
}

/**
 * Calculate position breakdown
 */
export function getPositionBreakdown(players: PlayerStats[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  
  players.forEach(player => {
    const position = player.POSITION_CATEGORY;
    breakdown[position] = (breakdown[position] || 0) + 1;
  });
  
  return breakdown;
}

/**
 * Calculate average stats by position
 */
export function getAverageStatsByPosition(players: PlayerStats[]): Record<string, {
  avgPoints: number;
  avgRebounds: number;
  avgAssists: number;
  avgSteals: number;
  avgBlocks: number;
  playerCount: number;
}> {
  const positionStats: Record<string, {
    totalPoints: number;
    totalRebounds: number;
    totalAssists: number;
    totalSteals: number;
    totalBlocks: number;
    playerCount: number;
  }> = {};

  players.forEach(player => {
    const position = player.POSITION_CATEGORY;
    if (!positionStats[position]) {
      positionStats[position] = {
        totalPoints: 0,
        totalRebounds: 0,
        totalAssists: 0,
        totalSteals: 0,
        totalBlocks: 0,
        playerCount: 0,
      };
    }

    positionStats[position].totalPoints += player.Points;
    positionStats[position].totalRebounds += player.REB;
    positionStats[position].totalAssists += player.AST;
    positionStats[position].totalSteals += player.STL;
    positionStats[position].totalBlocks += player.BLK;
    positionStats[position].playerCount += 1;
  });

  const averages: Record<string, {
    avgPoints: number;
    avgRebounds: number;
    avgAssists: number;
    avgSteals: number;
    avgBlocks: number;
    playerCount: number;
  }> = {};

  Object.entries(positionStats).forEach(([position, stats]) => {
    averages[position] = {
      avgPoints: Math.round((stats.totalPoints / stats.playerCount) * 10) / 10,
      avgRebounds: Math.round((stats.totalRebounds / stats.playerCount) * 10) / 10,
      avgAssists: Math.round((stats.totalAssists / stats.playerCount) * 10) / 10,
      avgSteals: Math.round((stats.totalSteals / stats.playerCount) * 10) / 10,
      avgBlocks: Math.round((stats.totalBlocks / stats.playerCount) * 10) / 10,
      playerCount: stats.playerCount,
    };
  });

  return averages;
} 