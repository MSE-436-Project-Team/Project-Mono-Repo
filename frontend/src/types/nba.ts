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
  POSITION: string;
  HEIGHT: string;
  WEIGHT: number;
  Points: number;
  REB: number;
  AST: number;
  STL: number;
  BLK: number;
  TO: number;
  FGM: number;
  FGA: number;
  '3PM': number;
  '3PA': number;
  FTM: number;
  FTA: number;
  OREB: number;
  DREB: number;
  PF: number;
  // Prediction fields
  next_Points?: number;
  next_REB?: number;
  next_AST?: number;
  next_STL?: number;
  next_BLK?: number;
  next_TO?: number;
  next_FGM?: number;
  next_FGA?: number;
  next_3PM?: number;
  next_3PA?: number;
  next_FTM?: number;
  next_FTA?: number;
  next_OREB?: number;
  next_DREB?: number;
  next_PF?: number;
  next_Minutes?: number;
  next_USAGE_RATE?: number;
  next_3P?: number;
  next_FT?: number;
  next_FG?: number;
  next_GAME_EFFICIENCY?: number;
  modelType?: string;
  '3P%'?: number;
  'FT%'?: number;
  'FG%'?: number;
  GAME_EFFICIENCY?: number;
}

export interface PlayerInfo {
  PERSON_ID: number;
  DISPLAY_FIRST_LAST: string;
  SCHOOL: string;
  TEAM_ID: number;
  TEAM_ABBREVIATION: string;
  DRAFT_YEAR: number;
  DRAFT_ROUND: number;
  DRAFT_NUMBER: number;
  FROM_YEAR: number;
  TO_YEAR: number;
  POSITION: string;
  HEIGHT: string;
  WEIGHT: number;
  BIRTHDATE: string;
  CURRENT_AGE: number;
}

export interface ModelPrediction {
  PERSON_ID: number;
  SEASON_ID: string;
  INPUT_SEASON_ID: string;
  next_Points: number;
  next_FTM: number;
  next_FTA: number;
  next_FGM: number;
  next_FGA: number;
  next_TO: number;
  next_STL: number;
  next_BLK: number;
  next_PF: number;
  next_USAGE_RATE: number;
  next_OREB: number;
  next_DREB: number;
  next_AST: number;
  next_REB: number;
  next_Minutes: number;
  next_3PM: number;
  next_3PA: number;
  'next_3P%': number;
  'next_FT%': number;
  'next_FG%': number;
  next_GAME_EFFICIENCY: number;
}

export type ModelType = 
  | 'bayesian'
  | 'ridge'
  | 'lightgbm'
  | 'xgboost'
  | 'lstm'
  | 'transformer'
  | 'ensemble_simple'
  | 'ensemble_weighted'
  | 'ensemble_stacking';

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
  offensiveRebounds: number;
  defensiveRebounds: number;
  personalFouls: number;
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
  offensiveRebounds: number;
  defensiveRebounds: number;
  personalFouls: number;
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