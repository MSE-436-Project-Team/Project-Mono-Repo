import type { PlayerStats, PlayerInfo, ModelPrediction, ModelType } from '../types/nba';

// FastAPI service base URL
const API_BASE_URL = 'http://localhost:8001';

// Model types available
export const MODEL_TYPES: ModelType[] = [
  'bayesian',
  'ridge',
  'lightgbm',
  'xgboost',
  'lstm',
  'transformer',
  'ensemble_simple',
  'ensemble_weighted',
  'ensemble_stacking'
];

// Load player data from FastAPI
export async function loadPlayerData(): Promise<PlayerInfo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/players`);
    if (!response.ok) {
      throw new Error(`Failed to load player data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Loaded players:', data.length);
    console.log('Sample player:', data[0]);
    return data;
  } catch (error) {
    console.error('Error loading player data:', error);
    return [];
  }
}

// Load model predictions from FastAPI
export async function loadModelPredictions(modelType: ModelType): Promise<ModelPrediction[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/predictions/${modelType}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${modelType} predictions: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Loaded ${modelType} predictions:`, data.length);
    console.log('Sample prediction:', data[0]);
    return data;
  } catch (error) {
    console.error(`Error loading ${modelType} predictions:`, error);
    return [];
  }
}

// Check available models
export async function getAvailableModels(): Promise<Record<string, { available: boolean; filename: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/models/available`);
    if (!response.ok) {
      throw new Error(`Failed to get available models: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting available models:', error);
    return {};
  }
}

// Load player career history
export async function loadPlayerHistory(playerId: number): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/player/${playerId}/history`);
    if (!response.ok) {
      throw new Error(`Failed to load player history: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Loaded player history:', data);
    return data.history || [];
  } catch (error) {
    console.error('Error loading player history:', error);
    return [];
  }
}

// Get all available model predictions
export async function loadAllModelPredictions(): Promise<Record<ModelType, ModelPrediction[]>> {
  const predictions: Record<ModelType, ModelPrediction[]> = {} as Record<ModelType, ModelPrediction[]>;
  
  // First check which models are available
  const availableModels = await getAvailableModels();
  
  for (const modelType of MODEL_TYPES) {
    if (availableModels[modelType]?.available) {
      predictions[modelType] = await loadModelPredictions(modelType);
    } else {
      console.warn(`Model ${modelType} is not available`);
      predictions[modelType] = [];
    }
  }
  
  return predictions;
}

// Combine player info with predictions
export function combinePlayerDataWithPredictions(
  players: PlayerInfo[],
  predictions: ModelPrediction[],
  modelType: ModelType
): PlayerStats[] {
  console.log('Combining data:', { playersCount: players.length, predictionsCount: predictions.length });
  
  // Ensure PERSON_ID is always an integer for both arrays
  const playerMap = new Map(players.map(p => [Number(p.PERSON_ID), p]));
  console.log('Player map size:', playerMap.size);
  console.log('Sample player IDs:', Array.from(playerMap.keys()).slice(0, 5));

  const combined = predictions.map(prediction => {
    const personId = Number(prediction.PERSON_ID);
    const player = playerMap.get(personId);
    if (!player) {
      console.log('No player found for prediction ID:', personId);
      return null;
    }
    // Map next_* fields to display fields
    const playerStats: PlayerStats = {
      ...player,
      ...prediction,
      Points: prediction.next_Points,
      REB: prediction.next_REB,
      AST: prediction.next_AST,
      STL: prediction.next_STL,
      BLK: prediction.next_BLK,
      TO: prediction.next_TO,
      FGM: prediction.next_FGM,
      FGA: prediction.next_FGA,
      '3PM': prediction.next_3PM,
      '3PA': prediction.next_3PA,
      FTM: prediction.next_FTM,
      FTA: prediction.next_FTA,
      OREB: prediction.next_OREB,
      DREB: prediction.next_DREB,
      PF: prediction.next_PF,
      '3P%': prediction['next_3P%'],
      'FT%': prediction['next_FT%'],
      'FG%': prediction['next_FG%'],
      GAME_EFFICIENCY: prediction.next_GAME_EFFICIENCY,
      modelType
    };
    return playerStats;
  }).filter(Boolean) as PlayerStats[];
  
  console.log('Combined players count:', combined.length);
  return combined;
}

// Calculate fantasy points for a player
export function calculatePlayerFantasyPoints(
  player: PlayerStats,
  weights: any
): number {
  let fantasyPoints = 0;
  
  // Basic stats
  fantasyPoints += (player.next_Points || 0) * weights.points;
  fantasyPoints += (player.next_REB || 0) * weights.rebounds;
  fantasyPoints += (player.next_AST || 0) * weights.assists;
  fantasyPoints += (player.next_STL || 0) * weights.steals;
  fantasyPoints += (player.next_BLK || 0) * weights.blocks;
  fantasyPoints += (player.next_TO || 0) * weights.turnovers;
  
  // Shooting stats
  fantasyPoints += (player.next_FGM || 0) * weights.fieldGoalsMade;
  fantasyPoints += (player.next_FGA || 0) * weights.fieldGoalsAttempted;
  fantasyPoints += (player.next_3PM || 0) * weights.threePointsMade;
  fantasyPoints += (player.next_3PA || 0) * weights.threePointsAttempted;
  fantasyPoints += (player.next_FTM || 0) * weights.freeThrowsMade;
  fantasyPoints += (player.next_FTA || 0) * weights.freeThrowsAttempted;
  
  // Additional stats
  fantasyPoints += (player.next_OREB || 0) * weights.offensiveRebounds;
  fantasyPoints += (player.next_DREB || 0) * weights.defensiveRebounds;
  fantasyPoints += (player.next_PF || 0) * weights.personalFouls;
  
  return fantasyPoints;
}

// Sort players by fantasy points
export function sortPlayersByFantasyPoints(
  players: PlayerStats[],
  weights: any
): PlayerStats[] {
  return [...players].sort((a, b) => {
    const aPoints = calculatePlayerFantasyPoints(a, weights);
    const bPoints = calculatePlayerFantasyPoints(b, weights);
    return bPoints - aPoints;
  });
}

// Filter players by position
export function filterPlayersByPosition(
  players: PlayerStats[],
  position: string
): PlayerStats[] {
  if (!position || position === 'All') return players;
  return players.filter(player => 
    player.POSITION?.toLowerCase().includes(position.toLowerCase())
  );
}

// Filter players by team
export function filterPlayersByTeam(
  players: PlayerStats[],
  team: string
): PlayerStats[] {
  if (!team || team === 'All') return players;
  return players.filter(player => 
    player.TEAM_ABBREVIATION === team
  );
}

// Get unique teams from players
export function getUniqueTeams(players: PlayerStats[]): string[] {
  const teams = [...new Set(players.map(p => p.TEAM_ABBREVIATION).filter(Boolean))];
  return teams.sort();
}

// Get unique positions from players
export function getUniquePositions(players: PlayerStats[]): string[] {
  const positions = [...new Set(players.map(p => p.POSITION).filter(Boolean))];
  return positions.sort();
}

// Get model display name
export function getModelDisplayName(modelType: ModelType): string {
  const displayNames: Record<ModelType, string> = {
    bayesian: 'Bayesian Regression',
    ridge: 'Ridge Regression',
    lightgbm: 'LightGBM',
    xgboost: 'XGBoost',
    lstm: 'LSTM Neural Network',
    transformer: 'Transformer Neural Network',
    ensemble_simple: 'Simple Ensemble',
    ensemble_weighted: 'Weighted Ensemble',
    ensemble_stacking: 'Stacking Ensemble'
  };
  return displayNames[modelType] || modelType;
}

// Get model description
export function getModelDescription(modelType: ModelType): string {
  const descriptions: Record<ModelType, string> = {
    bayesian: 'Probabilistic regression using PyMC with MatrixNormal distribution',
    ridge: 'Linear regression with L2 regularization',
    lightgbm: 'Gradient boosting framework optimized for speed and memory',
    xgboost: 'Extreme gradient boosting with advanced regularization',
    lstm: 'Long Short-Term Memory neural network for sequence modeling',
    transformer: 'Transformer architecture with self-attention mechanisms',
    ensemble_simple: 'Simple average of all individual model predictions',
    ensemble_weighted: 'Weighted average of individual model predictions',
    ensemble_stacking: 'Meta-learning ensemble using stacking approach'
  };
  return descriptions[modelType] || 'No description available';
} 