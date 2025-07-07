export interface Player {
  PERSON_ID: number;
  DISPLAY_FIRST_LAST: string;
  TEAM_ABBREVIATION: string;
  POSITION_CATEGORY: string;
  AGE: number;
  EXPERIENCE_YEARS: number;
  HEIGHT_INCHES: number;
  WEIGHT: number;
  BMI: number;
  DRAFT_POSITION: number;
  TOP_10_PICK: boolean;
  LOTTERY_PICK: boolean;
}

export interface PlayerStats {
  PERSON_ID: number;
  DISPLAY_FIRST_LAST: string;
  TEAM_ABBREVIATION: string;
  POSITION_CATEGORY: string;
  Points: number;
  REB: number;
  AST: number;
  STL: number;
  BLK: number;
  TO: number;
  Minutes: number;
  FGM: number;
  FGA: number;
  'FG%': number;
  '3PM': number;
  '3PA': number;
  '3P%': number;
  FTM: number;
  FTA: number;
  'FT%': number;
  OREB: number;
  DREB: number;
  PF: number;
  GAME_EFFICIENCY: number;
  TRUE_SHOOTING_PCT: number;
  USAGE_RATE: number;
  Points_5G_AVG: number;
  REB_5G_AVG: number;
  AST_5G_AVG: number;
  STL_5G_AVG: number;
  BLK_5G_AVG: number;
  TO_5G_AVG: number;
  Minutes_5G_AVG: number;
  GAME_EFFICIENCY_5G_AVG: number;
  Points_10G_AVG: number;
  REB_10G_AVG: number;
  AST_10G_AVG: number;
  STL_10G_AVG: number;
  BLK_10G_AVG: number;
  TO_10G_AVG: number;
  Minutes_10G_AVG: number;
  GAME_EFFICIENCY_10G_AVG: number;
  AGE: number;
  EXPERIENCE_YEARS: number;
  HEIGHT_INCHES: number;
  WEIGHT: number;
  BMI: number;
  DRAFT_POSITION: number;
  TOP_10_PICK: boolean;
  LOTTERY_PICK: boolean;
  PPG_mean: number;
  RPG_mean: number;
  APG_mean: number;
  SPG_mean: number;
  BPG_mean: number;
  TOPG_mean: number;
  MPG_mean: number;
  TS_PCT_mean: number;
  AST_TO_RATIO_mean: number;
  SEASONS_PLAYED: number;
  IS_HOME: number;
  IS_WIN: number;
  MONTH: number;
  DAY_OF_WEEK: number;
  IS_PLAYOFFS: number;
}

export interface FantasyScoring {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointsMade: number;
  threePointsAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
}

export interface FantasyProjection {
  player: Player;
  stats: PlayerStats;
  projectedFantasyPoints: number;
  projectedStats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    turnovers: number;
  };
  rank: number;
}

export interface ScoringWeights {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointsMade: number;
  threePointsAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
}

export interface DashboardStats {
  totalPlayers: number;
  averageAge: number;
  averageExperience: number;
  topScorers: PlayerStats[];
  mostEfficient: PlayerStats[];
  bestRookies: PlayerStats[];
  positionBreakdown: Record<string, number>;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface PositionStats {
  position: string;
  avgPoints: number;
  avgRebounds: number;
  avgAssists: number;
  avgSteals: number;
  avgBlocks: number;
  playerCount: number;
} 