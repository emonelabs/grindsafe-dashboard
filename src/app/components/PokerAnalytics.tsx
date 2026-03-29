import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, ZAxis } from 'recharts';
import { TrendingUp, TrendingDown, Activity, ChevronDown, Grid3x3, PieChart, Dices, Users, ChevronRight } from 'lucide-react';

interface StatRow {
  name: string;
  hands: number;
  opportunities: string;
  hitsPerOne: number;
  statValue: number;
  won: number;
  actionProfit: number;
  actionProfitPerHand: number;
  dispersion: number;
  evDiff: number;
}

interface PositionStat {
  position: string;
  hands: number;
  opportunities: string;
  hitsPerOne: number;
  statValue: number;
  won: number;
  actionProfit: number;
  actionProfitPerHand: number;
  dispersion: number;
  evDiff: number;
}

interface AnalyticsCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  summary: {
    hit: string;
    opportunities: string;
    hitsPerThousand: string;
    continuationBet: string;
    allVillainsFold: string;
    oneVillainCall: string;
    villainRaise: string;
    actionProfit: number;
    actionProfitPerHand: number;
  };
  stats: StatRow[];
  positionStats: PositionStat[];
  graphData: Array<{ hands: string; value: number }>;
  rangeData: number[][];
  handStrengthData: Array<{ hand: string; equity: number; frequency: number }>;
}

const POSITION_ORDER = ['SB', 'BB', 'UTG', 'UTG+1', 'UTG+2', 'HJ', 'CO', 'BTN'];

const generatePositionStats = (baseMultiplier: number = 1): PositionStat[] => {
  const positions = ['SB', 'BB', 'UTG', 'UTG+1', 'UTG+2', 'HJ', 'CO', 'BTN'];
  return positions.map(pos => {
    const multiplier = pos === 'BTN' || pos === 'CO' ? 1.3 : 
                       pos === 'HJ' || pos === 'LJ' ? 1.1 : 
                       pos === 'UTG' || pos === 'UTG+1' || pos === 'UTG+2' ? 0.7 : 
                       pos === 'BB' ? 0.9 : 0.8;
    const hands = Math.round(150 * baseMultiplier * multiplier);
    const opportunities = Math.round(hands * 2.3);
    const statValue = Math.round(35 + Math.random() * 30);
    const won = (Math.random() * 400 - 100) * multiplier;
    const actionProfit = Math.round((Math.random() * 3000 + 500) * multiplier);
    
    return {
      position: pos,
      hands,
      opportunities: opportunities.toString(),
      hitsPerOne: parseFloat((Math.random() * 3 + 1).toFixed(1)),
      statValue,
      won: parseFloat(won.toFixed(2)),
      actionProfit,
      actionProfitPerHand: parseFloat((actionProfit / hands).toFixed(2)),
      dispersion: parseFloat((Math.random() * 20 + 10).toFixed(2)),
      evDiff: parseFloat(((Math.random() - 0.3) * 50).toFixed(2)),
    };
  });
};

const ANALYTICS_CATEGORIES: AnalyticsCategory[] = [
  {
    id: 'c-bet-flop',
    label: 'Continuation Bet Flop',
    icon: <TrendingUp className="w-4 h-4" />,
    summary: {
      hit: '3.5k',
      opportunities: '5.7k',
      hitsPerThousand: '39',
      continuationBet: '61',
      allVillainsFold: '43',
      oneVillainCall: '44',
      villainRaise: '12',
      actionProfit: 26200,
      actionProfitPerHand: 7.6,
    },
    stats: [
      { name: 'Fold to Raise', hands: 238, opportunities: '402', hitsPerOne: 2.7, statValue: 59, won: -626.5, actionProfit: 0, actionProfitPerHand: 0, dispersion: 5.75, evDiff: 0 },
      { name: 'Call Raise', hands: 115, opportunities: '402', hitsPerOne: 1.3, statValue: 29, won: 229.3, actionProfit: 2565, actionProfitPerHand: 22, dispersion: 45.86, evDiff: -12.4 },
      { name: '3-Bet', hands: 49, opportunities: '344', hitsPerOne: 0.6, statValue: 14, won: -23.04, actionProfit: 887.8, actionProfitPerHand: 18, dispersion: 58.95, evDiff: -93.69 },
      { name: 'Missed 2nd Barrel', hands: 854, opportunities: '1.4k', hitsPerOne: 9.6, statValue: 60, won: -190.7, actionProfit: 8240, actionProfitPerHand: 9.6, dispersion: 22.67, evDiff: 26.58 },
      { name: '2nd Barrel', hands: 577, opportunities: '1.4k', hitsPerOne: 6.5, statValue: 40, won: 1131, actionProfit: 10300, actionProfitPerHand: 18, dispersion: 32.13, evDiff: 67.72 },
      { name: '3rd Barrel', hands: 0, opportunities: '0', hitsPerOne: 0, statValue: 52, won: 0, actionProfit: 0, actionProfitPerHand: 0, dispersion: 0, evDiff: 0 },
      { name: 'Check Profit Rate', hands: 0, opportunities: '0', hitsPerOne: 0, statValue: 0, won: 0, actionProfit: 0, actionProfitPerHand: 3.4, dispersion: 0, evDiff: 0 },
    ],
    positionStats: [
      { position: 'SB', hands: 89, opportunities: '156', hitsPerOne: 1.8, statValue: 57, won: -123.5, actionProfit: 890, actionProfitPerHand: 10.0, dispersion: 15.8, evDiff: -23.4 },
      { position: 'BB', hands: 112, opportunities: '198', hitsPerOne: 1.8, statValue: 56, won: -287.5, actionProfit: 1234, actionProfitPerHand: 11.0, dispersion: 18.2, evDiff: -45.8 },
      { position: 'UTG', hands: 78, opportunities: '145', hitsPerOne: 1.9, statValue: 54, won: -89.2, actionProfit: 678, actionProfitPerHand: 8.7, dispersion: 12.5, evDiff: -12.3 },
      { position: 'UTG+1', hands: 95, opportunities: '167', hitsPerOne: 1.8, statValue: 57, won: 156.8, actionProfit: 1456, actionProfitPerHand: 15.3, dispersion: 16.9, evDiff: 23.1 },
      { position: 'UTG+2', hands: 102, opportunities: '178', hitsPerOne: 1.7, statValue: 57, won: 234.5, actionProfit: 1678, actionProfitPerHand: 16.5, dispersion: 17.8, evDiff: 34.2 },
      { position: 'HJ', hands: 134, opportunities: '234', hitsPerOne: 1.7, statValue: 57, won: 345.6, actionProfit: 2134, actionProfitPerHand: 15.9, dispersion: 19.2, evDiff: 45.6 },
      { position: 'CO', hands: 189, opportunities: '312', hitsPerOne: 1.6, statValue: 61, won: 567.8, actionProfit: 3456, actionProfitPerHand: 18.3, dispersion: 21.5, evDiff: 67.8 },
      { position: 'BTN', hands: 245, opportunities: '398', hitsPerOne: 1.6, statValue: 62, won: 789.2, actionProfit: 4567, actionProfitPerHand: 18.6, dispersion: 23.4, evDiff: 89.5 },
    ],
    graphData: [
      { hands: '1k', value: 45 }, { hands: '2k', value: 52 }, { hands: '3k', value: 48 },
      { hands: '4k', value: 55 }, { hands: '5k', value: 51 }, { hands: '6k', value: 58 },
      { hands: '7k', value: 54 }, { hands: '8k', value: 61 }, { hands: '9k', value: 57 },
      { hands: '10k', value: 63 }, { hands: '11k', value: 59 }, { hands: '12k', value: 65 },
    ],
    rangeData: generateMockRangeData(),
    handStrengthData: [
      { hand: 'Premium Pairs', equity: 85, frequency: 2.3 },
      { hand: 'Medium Pairs', equity: 68, frequency: 3.5 },
      { hand: 'Suited Connectors', equity: 52, frequency: 4.2 },
      { hand: 'Suited Gappers', equity: 48, frequency: 2.8 },
      { hand: 'Offsuit Combos', equity: 42, frequency: 8.5 },
      { hand: 'High Cards', equity: 55, frequency: 5.1 },
    ],
  },
  {
    id: 'donk-bet',
    label: 'Donk Bet',
    icon: <TrendingDown className="w-4 h-4" />,
    summary: {
      hit: '1.2k',
      opportunities: '3.8k',
      hitsPerThousand: '32',
      continuationBet: '45',
      allVillainsFold: '28',
      oneVillainCall: '52',
      villainRaise: '20',
      actionProfit: 15800,
      actionProfitPerHand: 5.2,
    },
    stats: [
      { name: 'Fold to Raise', hands: 156, opportunities: '289', hitsPerOne: 1.8, statValue: 54, won: -412.3, actionProfit: 0, actionProfitPerHand: 0, dispersion: 4.89, evDiff: 0 },
      { name: 'Call Raise', hands: 89, opportunities: '289', hitsPerOne: 0.9, statValue: 31, won: 178.5, actionProfit: 1890, actionProfitPerHand: 21, dispersion: 38.42, evDiff: -8.2 },
      { name: '3-Bet', hands: 44, opportunities: '289', hitsPerOne: 0.5, statValue: 15, won: -45.2, actionProfit: 670, actionProfitPerHand: 15, dispersion: 52.1, evDiff: -67.3 },
      { name: 'Missed 2nd Barrel', hands: 412, opportunities: '890', hitsPerOne: 4.6, statValue: 46, won: -123.8, actionProfit: 5120, actionProfitPerHand: 12, dispersion: 19.8, evDiff: 18.4 },
      { name: '2nd Barrel', hands: 298, opportunities: '890', hitsPerOne: 3.3, statValue: 33, won: 687.4, actionProfit: 6850, actionProfitPerHand: 23, dispersion: 28.5, evDiff: 42.1 },
      { name: '3rd Barrel', hands: 89, opportunities: '890', hitsPerOne: 1.0, statValue: 10, won: 234.6, actionProfit: 3560, actionProfitPerHand: 40, dispersion: 41.2, evDiff: 23.8 },
      { name: 'Check Profit Rate', hands: 0, opportunities: '0', hitsPerOne: 0, statValue: 0, won: 0, actionProfit: 0, actionProfitPerHand: 4.1, dispersion: 0, evDiff: 0 },
    ],
    positionStats: [
      { position: 'SB', hands: 67, opportunities: '123', hitsPerOne: 1.8, statValue: 54, won: -89.3, actionProfit: 567, actionProfitPerHand: 8.5, dispersion: 12.3, evDiff: -15.6 },
      { position: 'BB', hands: 89, opportunities: '156', hitsPerOne: 1.7, statValue: 57, won: -156.8, actionProfit: 789, actionProfitPerHand: 8.9, dispersion: 14.5, evDiff: -28.9 },
      { position: 'UTG', hands: 56, opportunities: '112', hitsPerOne: 2.0, statValue: 50, won: -45.2, actionProfit: 456, actionProfitPerHand: 8.1, dispersion: 10.8, evDiff: -8.4 },
      { position: 'UTG+1', hands: 72, opportunities: '134', hitsPerOne: 1.9, statValue: 54, won: 89.4, actionProfit: 923, actionProfitPerHand: 12.8, dispersion: 13.2, evDiff: 12.5 },
      { position: 'UTG+2', hands: 78, opportunities: '145', hitsPerOne: 1.8, statValue: 54, won: 123.6, actionProfit: 1089, actionProfitPerHand: 14.0, dispersion: 14.1, evDiff: 18.9 },
      { position: 'HJ', hands: 98, opportunities: '178', hitsPerOne: 1.8, statValue: 55, won: 234.5, actionProfit: 1567, actionProfitPerHand: 16.0, dispersion: 15.6, evDiff: 28.4 },
      { position: 'CO', hands: 134, opportunities: '234', hitsPerOne: 1.7, statValue: 57, won: 345.6, actionProfit: 2345, actionProfitPerHand: 17.5, dispersion: 17.8, evDiff: 42.3 },
      { position: 'BTN', hands: 178, opportunities: '298', hitsPerOne: 1.7, statValue: 60, won: 456.7, actionProfit: 3123, actionProfitPerHand: 17.5, dispersion: 19.2, evDiff: 56.7 },
    ],
    graphData: [
      { hands: '1k', value: 38 }, { hands: '2k', value: 42 }, { hands: '3k', value: 45 },
      { hands: '4k', value: 41 }, { hands: '5k', value: 48 }, { hands: '6k', value: 52 },
      { hands: '7k', value: 49 }, { hands: '8k', value: 55 }, { hands: '9k', value: 51 },
      { hands: '10k', value: 58 }, { hands: '11k', value: 54 }, { hands: '12k', value: 60 },
    ],
    rangeData: generateMockRangeData(),
    handStrengthData: [
      { hand: 'Premium Pairs', equity: 82, frequency: 2.1 },
      { hand: 'Medium Pairs', equity: 65, frequency: 3.8 },
      { hand: 'Suited Connectors', equity: 50, frequency: 4.5 },
      { hand: 'Suited Gappers', equity: 46, frequency: 3.2 },
      { hand: 'Offsuit Combos', equity: 40, frequency: 9.2 },
      { hand: 'High Cards', equity: 53, frequency: 5.6 },
    ],
  },
  {
    id: 'float',
    label: 'Float',
    icon: <Activity className="w-4 h-4" />,
    summary: {
      hit: '2.8k',
      opportunities: '4.2k',
      hitsPerThousand: '45',
      continuationBet: '38',
      allVillainsFold: '22',
      oneVillainCall: '62',
      villainRaise: '16',
      actionProfit: 22100,
      actionProfitPerHand: 6.8,
    },
    stats: [
      { name: 'Fold to Raise', hands: 178, opportunities: '312', hitsPerOne: 2.1, statValue: 57, won: -389.2, actionProfit: 0, actionProfitPerHand: 0, dispersion: 5.12, evDiff: 0 },
      { name: 'Call Raise', hands: 94, opportunities: '312', hitsPerOne: 1.1, statValue: 30, won: 256.8, actionProfit: 2134, actionProfitPerHand: 23, dispersion: 42.5, evDiff: -9.8 },
      { name: '3-Bet', hands: 40, opportunities: '312', hitsPerOne: 0.4, statValue: 13, won: -18.9, actionProfit: 745, actionProfitPerHand: 19, dispersion: 55.3, evDiff: -78.2 },
      { name: 'Missed 2nd Barrel', hands: 678, opportunities: '1.2k', hitsPerOne: 7.2, statValue: 56, won: -156.3, actionProfit: 6890, actionProfitPerHand: 10, dispersion: 21.4, evDiff: 21.3 },
      { name: '2nd Barrel', hands: 445, opportunities: '1.2k', hitsPerOne: 4.7, statValue: 37, won: 923.5, actionProfit: 8450, actionProfitPerHand: 19, dispersion: 29.8, evDiff: 54.6 },
      { name: '3rd Barrel', hands: 77, opportunities: '1.2k', hitsPerOne: 0.8, statValue: 6, won: 189.2, actionProfit: 2890, actionProfitPerHand: 38, dispersion: 38.9, evDiff: 19.5 },
      { name: 'Check Profit Rate', hands: 0, opportunities: '0', hitsPerOne: 0, statValue: 0, won: 0, actionProfit: 0, actionProfitPerHand: 3.8, dispersion: 0, evDiff: 0 },
    ],
    positionStats: [
      { position: 'SB', hands: 78, opportunities: '145', hitsPerOne: 1.9, statValue: 54, won: -98.5, actionProfit: 678, actionProfitPerHand: 8.7, dispersion: 11.8, evDiff: -18.4 },
      { position: 'BB', hands: 102, opportunities: '178', hitsPerOne: 1.8, statValue: 57, won: -234.6, actionProfit: 1023, actionProfitPerHand: 10.0, dispersion: 13.9, evDiff: -34.2 },
      { position: 'UTG', hands: 67, opportunities: '134', hitsPerOne: 2.0, statValue: 50, won: -67.8, actionProfit: 567, actionProfitPerHand: 8.5, dispersion: 10.2, evDiff: -10.2 },
      { position: 'UTG+1', hands: 85, opportunities: '156', hitsPerOne: 1.8, statValue: 54, won: 123.4, actionProfit: 1234, actionProfitPerHand: 14.5, dispersion: 12.8, evDiff: 18.9 },
      { position: 'UTG+2', hands: 92, opportunities: '167', hitsPerOne: 1.8, statValue: 55, won: 178.9, actionProfit: 1456, actionProfitPerHand: 15.8, dispersion: 13.5, evDiff: 25.6 },
      { position: 'HJ', hands: 118, opportunities: '212', hitsPerOne: 1.8, statValue: 56, won: 267.8, actionProfit: 1890, actionProfitPerHand: 16.0, dispersion: 14.8, evDiff: 34.8 },
      { position: 'CO', hands: 156, opportunities: '278', hitsPerOne: 1.8, statValue: 56, won: 389.5, actionProfit: 2567, actionProfitPerHand: 16.5, dispersion: 16.2, evDiff: 48.9 },
      { position: 'BTN', hands: 201, opportunities: '345', hitsPerOne: 1.7, statValue: 58, won: 523.4, actionProfit: 3456, actionProfitPerHand: 17.2, dispersion: 17.8, evDiff: 62.3 },
    ],
    graphData: [
      { hands: '1k', value: 42 }, { hands: '2k', value: 48 }, { hands: '3k', value: 44 },
      { hands: '4k', value: 51 }, { hands: '5k', value: 47 }, { hands: '6k', value: 54 },
      { hands: '7k', value: 50 }, { hands: '8k', value: 57 }, { hands: '9k', value: 53 },
      { hands: '10k', value: 59 }, { hands: '11k', value: 55 }, { hands: '12k', value: 62 },
    ],
    rangeData: generateMockRangeData(),
    handStrengthData: [
      { hand: 'Premium Pairs', equity: 84, frequency: 2.4 },
      { hand: 'Medium Pairs', equity: 67, frequency: 3.6 },
      { hand: 'Suited Connectors', equity: 51, frequency: 4.3 },
      { hand: 'Suited Gappers', equity: 47, frequency: 2.9 },
      { hand: 'Offsuit Combos', equity: 41, frequency: 8.8 },
      { hand: 'High Cards', equity: 54, frequency: 5.3 },
    ],
  },
  {
    id: 'check-raise',
    label: 'Check-Raise',
    icon: <TrendingUp className="w-4 h-4" />,
    summary: {
      hit: '890',
      opportunities: '2.1k',
      hitsPerThousand: '28',
      continuationBet: '52',
      allVillainsFold: '35',
      oneVillainCall: '48',
      villainRaise: '17',
      actionProfit: 12400,
      actionProfitPerHand: 9.4,
    },
    stats: [
      { name: 'Fold to Raise', hands: 112, opportunities: '198', hitsPerOne: 1.4, statValue: 56, won: -287.5, actionProfit: 0, actionProfitPerHand: 0, dispersion: 4.23, evDiff: 0 },
      { name: 'Call Raise', hands: 56, opportunities: '198', hitsPerOne: 0.7, statValue: 28, won: 145.2, actionProfit: 1456, actionProfitPerHand: 26, dispersion: 35.8, evDiff: -6.4 },
      { name: '3-Bet', hands: 30, opportunities: '198', hitsPerOne: 0.4, statValue: 15, won: -12.8, actionProfit: 534, actionProfitPerHand: 18, dispersion: 48.2, evDiff: -52.1 },
      { name: 'Missed 2nd Barrel', hands: 0, opportunities: '0', hitsPerOne: 0, statValue: 0, won: 0, actionProfit: 0, actionProfitPerHand: 0, dispersion: 0, evDiff: 0 },
      { name: '2nd Barrel', hands: 0, opportunities: '0', hitsPerOne: 0, statValue: 0, won: 0, actionProfit: 0, actionProfitPerHand: 0, dispersion: 0, evDiff: 0 },
      { name: '3rd Barrel', hands: 0, opportunities: '0', hitsPerOne: 0, statValue: 0, won: 0, actionProfit: 0, actionProfitPerHand: 0, dispersion: 0, evDiff: 0 },
      { name: 'Check Profit Rate', hands: 412, opportunities: '890', hitsPerOne: 4.6, statValue: 46, won: 534.8, actionProfit: 6890, actionProfitPerHand: 17, dispersion: 18.5, evDiff: 28.9 },
    ],
    positionStats: [
      { position: 'SB', hands: 45, opportunities: '89', hitsPerOne: 2.0, statValue: 51, won: -56.7, actionProfit: 456, actionProfitPerHand: 10.1, dispersion: 9.8, evDiff: -12.3 },
      { position: 'BB', hands: 67, opportunities: '123', hitsPerOne: 1.8, statValue: 54, won: -123.4, actionProfit: 789, actionProfitPerHand: 11.8, dispersion: 11.2, evDiff: -23.4 },
      { position: 'UTG', hands: 34, opportunities: '78', hitsPerOne: 2.3, statValue: 44, won: -34.5, actionProfit: 234, actionProfitPerHand: 6.9, dispersion: 8.5, evDiff: -6.7 },
      { position: 'UTG+1', hands: 45, opportunities: '89', hitsPerOne: 2.0, statValue: 51, won: 67.8, actionProfit: 678, actionProfitPerHand: 15.1, dispersion: 10.4, evDiff: 12.4 },
      { position: 'UTG+2', hands: 52, opportunities: '98', hitsPerOne: 1.9, statValue: 53, won: 89.2, actionProfit: 789, actionProfitPerHand: 15.2, dispersion: 10.9, evDiff: 15.8 },
      { position: 'HJ', hands: 68, opportunities: '123', hitsPerOne: 1.8, statValue: 55, won: 134.5, actionProfit: 1023, actionProfitPerHand: 15.0, dispersion: 11.8, evDiff: 21.2 },
      { position: 'CO', hands: 89, opportunities: '156', hitsPerOne: 1.7, statValue: 57, won: 189.6, actionProfit: 1345, actionProfitPerHand: 15.1, dispersion: 12.5, evDiff: 28.9 },
      { position: 'BTN', hands: 112, opportunities: '189', hitsPerOne: 1.7, statValue: 59, won: 245.8, actionProfit: 1789, actionProfitPerHand: 16.0, dispersion: 13.8, evDiff: 35.6 },
    ],
    graphData: [
      { hands: '1k', value: 35 }, { hands: '2k', value: 40 }, { hands: '3k', value: 38 },
      { hands: '4k', value: 44 }, { hands: '5k', value: 42 }, { hands: '6k', value: 48 },
      { hands: '7k', value: 45 }, { hands: '8k', value: 52 }, { hands: '9k', value: 49 },
      { hands: '10k', value: 55 }, { hands: '11k', value: 51 }, { hands: '12k', value: 58 },
    ],
    rangeData: generateMockRangeData(),
    handStrengthData: [
      { hand: 'Premium Pairs', equity: 88, frequency: 1.8 },
      { hand: 'Medium Pairs', equity: 70, frequency: 3.2 },
      { hand: 'Suited Connectors', equity: 54, frequency: 3.8 },
      { hand: 'Suited Gappers', equity: 50, frequency: 2.5 },
      { hand: 'Offsuit Combos', equity: 44, frequency: 7.5 },
      { hand: 'High Cards', equity: 57, frequency: 4.8 },
    ],
  },
  {
    id: '3-bet-pot',
    label: '3-Bet Pot',
    icon: <TrendingUp className="w-4 h-4" />,
    summary: {
      hit: '2.1k',
      opportunities: '3.4k',
      hitsPerThousand: '35',
      continuationBet: '68',
      allVillainsFold: '48',
      oneVillainCall: '38',
      villainRaise: '14',
      actionProfit: 19800,
      actionProfitPerHand: 8.2,
    },
    stats: [
      { name: 'Fold to Raise', hands: 145, opportunities: '256', hitsPerOne: 1.8, statValue: 57, won: -423.8, actionProfit: 0, actionProfitPerHand: 0, dispersion: 5.45, evDiff: 0 },
      { name: 'Call Raise', hands: 67, opportunities: '256', hitsPerOne: 0.8, statValue: 26, won: 189.4, actionProfit: 1789, actionProfitPerHand: 27, dispersion: 40.2, evDiff: -7.6 },
      { name: '3-Bet', hands: 44, opportunities: '256', hitsPerOne: 0.5, statValue: 17, won: -28.5, actionProfit: 623, actionProfitPerHand: 14, dispersion: 51.8, evDiff: -68.4 },
      { name: 'Missed 2nd Barrel', hands: 0, opportunities: '0', hitsPerOne: 0, statValue: 0, won: 0, actionProfit: 0, actionProfitPerHand: 0, dispersion: 0, evDiff: 0 },
      { name: '2nd Barrel', hands: 423, opportunities: '890', hitsPerOne: 4.7, statValue: 47, won: 856.3, actionProfit: 7230, actionProfitPerHand: 17, dispersion: 25.6, evDiff: 38.9 },
      { name: '3rd Barrel', hands: 467, opportunities: '890', hitsPerOne: 5.2, statValue: 52, won: 1234.5, actionProfit: 9850, actionProfitPerHand: 21, dispersion: 35.2, evDiff: 45.2 },
      { name: 'Check Profit Rate', hands: 0, opportunities: '0', hitsPerOne: 0, statValue: 0, won: 0, actionProfit: 0, actionProfitPerHand: 2.8, dispersion: 0, evDiff: 0 },
    ],
    positionStats: [
      { position: 'SB', hands: 56, opportunities: '112', hitsPerOne: 2.0, statValue: 50, won: -89.6, actionProfit: 567, actionProfitPerHand: 10.1, dispersion: 10.5, evDiff: -15.8 },
      { position: 'BB', hands: 78, opportunities: '145', hitsPerOne: 1.9, statValue: 54, won: -156.7, actionProfit: 890, actionProfitPerHand: 11.4, dispersion: 12.3, evDiff: -28.9 },
      { position: 'UTG', hands: 45, opportunities: '98', hitsPerOne: 2.2, statValue: 46, won: -45.8, actionProfit: 345, actionProfitPerHand: 7.7, dispersion: 9.2, evDiff: -8.9 },
      { position: 'UTG+1', hands: 58, opportunities: '112', hitsPerOne: 1.9, statValue: 52, won: 89.3, actionProfit: 789, actionProfitPerHand: 13.6, dispersion: 11.2, evDiff: 14.5 },
      { position: 'UTG+2', hands: 67, opportunities: '123', hitsPerOne: 1.8, statValue: 54, won: 112.4, actionProfit: 978, actionProfitPerHand: 14.6, dispersion: 11.8, evDiff: 19.8 },
      { position: 'HJ', hands: 89, opportunities: '156', hitsPerOne: 1.7, statValue: 57, won: 178.9, actionProfit: 1234, actionProfitPerHand: 13.9, dispersion: 12.8, evDiff: 25.6 },
      { position: 'CO', hands: 112, opportunities: '189', hitsPerOne: 1.7, statValue: 59, won: 234.5, actionProfit: 1678, actionProfitPerHand: 15.0, dispersion: 13.8, evDiff: 34.8 },
      { position: 'BTN', hands: 145, opportunities: '234', hitsPerOne: 1.6, statValue: 62, won: 312.6, actionProfit: 2234, actionProfitPerHand: 15.4, dispersion: 14.9, evDiff: 45.6 },
    ],
    graphData: [
      { hands: '1k', value: 48 }, { hands: '2k', value: 55 }, { hands: '3k', value: 52 },
      { hands: '4k', value: 60 }, { hands: '5k', value: 56 }, { hands: '6k', value: 64 },
      { hands: '7k', value: 59 }, { hands: '8k', value: 68 }, { hands: '9k', value: 63 },
      { hands: '10k', value: 71 }, { hands: '11k', value: 66 }, { hands: '12k', value: 74 },
    ],
    rangeData: generateMockRangeData(),
    handStrengthData: [
      { hand: 'Premium Pairs', equity: 90, frequency: 1.5 },
      { hand: 'Medium Pairs', equity: 72, frequency: 2.9 },
      { hand: 'Suited Connectors', equity: 56, frequency: 3.5 },
      { hand: 'Suited Gappers', equity: 52, frequency: 2.2 },
      { hand: 'Offsuit Combos', equity: 46, frequency: 6.8 },
      { hand: 'High Cards', equity: 59, frequency: 4.5 },
    ],
  },
  {
    id: 'multiway',
    label: 'Multiway Pot',
    icon: <Grid3x3 className="w-4 h-4" />,
    summary: {
      hit: '4.2k',
      opportunities: '6.8k',
      hitsPerThousand: '42',
      continuationBet: '35',
      allVillainsFold: '18',
      oneVillainCall: '68',
      villainRaise: '14',
      actionProfit: 15600,
      actionProfitPerHand: 4.8,
    },
    stats: [
      { name: 'Fold to Raise', hands: 89, opportunities: '178', hitsPerOne: 1.2, statValue: 50, won: -234.5, actionProfit: 0, actionProfitPerHand: 0, dispersion: 4.56, evDiff: 0 },
      { name: 'Call Raise', hands: 67, opportunities: '178', hitsPerOne: 0.9, statValue: 38, won: 123.8, actionProfit: 1234, actionProfitPerHand: 18, dispersion: 38.9, evDiff: -5.2 },
      { name: '3-Bet', hands: 22, opportunities: '178', hitsPerOne: 0.3, statValue: 12, won: -8.9, actionProfit: 345, actionProfitPerHand: 16, dispersion: 45.6, evDiff: -42.3 },
      { name: 'Missed 2nd Barrel', hands: 0, opportunities: '0', hitsPerOne: 0, statValue: 0, won: 0, actionProfit: 0, actionProfitPerHand: 0, dispersion: 0, evDiff: 0 },
      { name: '2nd Barrel', hands: 0, opportunities: '0', hitsPerOne: 0, statValue: 0, won: 0, actionProfit: 0, actionProfitPerHand: 0, dispersion: 0, evDiff: 0 },
      { name: '3rd Barrel', hands: 0, opportunities: '0', hitsPerOne: 0, statValue: 0, won: 0, actionProfit: 0, actionProfitPerHand: 0, dispersion: 0, evDiff: 0 },
      { name: 'Check Profit Rate', hands: 1234, opportunities: '2.5k', hitsPerOne: 12.3, statValue: 49, won: 789.3, actionProfit: 8900, actionProfitPerHand: 7.2, dispersion: 15.8, evDiff: 34.5 },
    ],
    positionStats: [
      { position: 'SB', hands: 78, opportunities: '145', hitsPerOne: 1.9, statValue: 54, won: -78.9, actionProfit: 456, actionProfitPerHand: 5.8, dispersion: 8.9, evDiff: -12.4 },
      { position: 'BB', hands: 102, opportunities: '178', hitsPerOne: 1.7, statValue: 57, won: -123.4, actionProfit: 678, actionProfitPerHand: 6.6, dispersion: 10.2, evDiff: -23.5 },
      { position: 'UTG', hands: 56, opportunities: '112', hitsPerOne: 2.0, statValue: 50, won: -45.6, actionProfit: 345, actionProfitPerHand: 6.2, dispersion: 7.8, evDiff: -7.8 },
      { position: 'UTG+1', hands: 72, opportunities: '134', hitsPerOne: 1.9, statValue: 54, won: 67.8, actionProfit: 567, actionProfitPerHand: 7.9, dispersion: 9.5, evDiff: 11.2 },
      { position: 'UTG+2', hands: 89, opportunities: '156', hitsPerOne: 1.7, statValue: 57, won: 98.5, actionProfit: 789, actionProfitPerHand: 8.9, dispersion: 10.1, evDiff: 16.8 },
      { position: 'HJ', hands: 112, opportunities: '189', hitsPerOne: 1.7, statValue: 59, won: 145.6, actionProfit: 1023, actionProfitPerHand: 9.1, dispersion: 10.9, evDiff: 23.4 },
      { position: 'CO', hands: 145, opportunities: '234', hitsPerOne: 1.6, statValue: 62, won: 198.7, actionProfit: 1345, actionProfitPerHand: 9.3, dispersion: 11.8, evDiff: 32.5 },
      { position: 'BTN', hands: 189, opportunities: '298', hitsPerOne: 1.6, statValue: 63, won: 267.8, actionProfit: 1789, actionProfitPerHand: 9.5, dispersion: 12.8, evDiff: 42.8 },
    ],
    graphData: [
      { hands: '1k', value: 32 }, { hands: '2k', value: 38 }, { hands: '3k', value: 35 },
      { hands: '4k', value: 42 }, { hands: '5k', value: 39 }, { hands: '6k', value: 45 },
      { hands: '7k', value: 42 }, { hands: '8k', value: 48 }, { hands: '9k', value: 44 },
      { hands: '10k', value: 51 }, { hands: '11k', value: 47 }, { hands: '12k', value: 54 },
    ],
    rangeData: generateMockRangeData(),
    handStrengthData: [
      { hand: 'Premium Pairs', equity: 85, frequency: 2.0 },
      { hand: 'Medium Pairs', equity: 62, frequency: 3.8 },
      { hand: 'Suited Connectors', equity: 48, frequency: 4.8 },
      { hand: 'Suited Gappers', equity: 44, frequency: 3.2 },
      { hand: 'Offsuit Combos', equity: 38, frequency: 9.5 },
      { hand: 'High Cards', equity: 50, frequency: 5.8 },
    ],
  },
  {
    id: 'heads-up',
    label: 'Heads-Up Pot',
    icon: <PieChart className="w-4 h-4" />,
    summary: {
      hit: '5.6k',
      opportunities: '8.9k',
      hitsPerThousand: '48',
      continuationBet: '72',
      allVillainsFold: '52',
      oneVillainCall: '38',
      villainRaise: '10',
      actionProfit: 34200,
      actionProfitPerHand: 9.8,
    },
    stats: [
      { name: 'Fold to Raise', hands: 234, opportunities: '412', hitsPerOne: 2.8, statValue: 57, won: -567.2, actionProfit: 0, actionProfitPerHand: 0, dispersion: 5.89, evDiff: 0 },
      { name: 'Call Raise', hands: 123, opportunities: '412', hitsPerOne: 1.5, statValue: 30, won: 278.5, actionProfit: 2890, actionProfitPerHand: 23, dispersion: 44.5, evDiff: -11.8 },
      { name: '3-Bet', hands: 55, opportunities: '412', hitsPerOne: 0.7, statValue: 13, won: -35.2, actionProfit: 934, actionProfitPerHand: 17, dispersion: 54.8, evDiff: -82.5 },
      { name: 'Missed 2nd Barrel', hands: 0, opportunities: '0', hitsPerOne: 0, statValue: 0, won: 0, actionProfit: 0, actionProfitPerHand: 0, dispersion: 0, evDiff: 0 },
      { name: '2nd Barrel', hands: 678, opportunities: '1.5k', hitsPerOne: 7.6, statValue: 45, won: 1456.8, actionProfit: 11200, actionProfitPerHand: 16, dispersion: 28.9, evDiff: 56.8 },
      { name: '3rd Barrel', hands: 822, opportunities: '1.5k', hitsPerOne: 9.2, statValue: 55, won: 2345.6, actionProfit: 15600, actionProfitPerHand: 19, dispersion: 38.5, evDiff: 68.9 },
      { name: 'Check Profit Rate', hands: 0, opportunities: '0', hitsPerOne: 0, statValue: 0, won: 0, actionProfit: 0, actionProfitPerHand: 4.2, dispersion: 0, evDiff: 0 },
    ],
    positionStats: [
      { position: 'SB', hands: 123, opportunities: '234', hitsPerOne: 1.9, statValue: 53, won: -156.7, actionProfit: 1234, actionProfitPerHand: 10.0, dispersion: 11.8, evDiff: -23.4 },
      { position: 'BB', hands: 156, opportunities: '278', hitsPerOne: 1.8, statValue: 56, won: -234.5, actionProfit: 1567, actionProfitPerHand: 10.0, dispersion: 13.5, evDiff: -34.8 },
      { position: 'UTG', hands: 89, opportunities: '178', hitsPerOne: 2.0, statValue: 50, won: -123.4, actionProfit: 890, actionProfitPerHand: 10.0, dispersion: 10.8, evDiff: -18.9 },
      { position: 'UTG+1', hands: 112, opportunities: '212', hitsPerOne: 1.9, statValue: 53, won: 178.9, actionProfit: 1678, actionProfitPerHand: 15.0, dispersion: 12.5, evDiff: 25.6 },
      { position: 'UTG+2', hands: 134, opportunities: '245', hitsPerOne: 1.8, statValue: 55, won: 234.6, actionProfit: 2134, actionProfitPerHand: 15.9, dispersion: 13.2, evDiff: 34.5 },
      { position: 'HJ', hands: 167, opportunities: '298', hitsPerOne: 1.8, statValue: 56, won: 312.7, actionProfit: 2678, actionProfitPerHand: 16.0, dispersion: 14.2, evDiff: 45.8 },
      { position: 'CO', hands: 212, opportunities: '356', hitsPerOne: 1.7, statValue: 60, won: 456.8, actionProfit: 3456, actionProfitPerHand: 16.3, dispersion: 15.5, evDiff: 56.7 },
      { position: 'BTN', hands: 267, opportunities: '423', hitsPerOne: 1.6, statValue: 63, won: 589.4, actionProfit: 4567, actionProfitPerHand: 17.1, dispersion: 16.8, evDiff: 72.3 },
    ],
    graphData: [
      { hands: '1k', value: 52 }, { hands: '2k', value: 60 }, { hands: '3k', value: 56 },
      { hands: '4k', value: 65 }, { hands: '5k', value: 61 }, { hands: '6k', value: 70 },
      { hands: '7k', value: 65 }, { hands: '8k', value: 74 }, { hands: '9k', value: 69 },
      { hands: '10k', value: 78 }, { hands: '11k', value: 72 }, { hands: '12k', value: 82 },
    ],
    rangeData: generateMockRangeData(),
    handStrengthData: [
      { hand: 'Premium Pairs', equity: 88, frequency: 1.9 },
      { hand: 'Medium Pairs', equity: 70, frequency: 3.1 },
      { hand: 'Suited Connectors', equity: 53, frequency: 4.0 },
      { hand: 'Suited Gappers', equity: 49, frequency: 2.6 },
      { hand: 'Offsuit Combos', equity: 43, frequency: 7.8 },
      { hand: 'High Cards', equity: 56, frequency: 4.9 },
    ],
  },
];

function generateMockRangeData(): number[][] {
  const range: number[][] = [];
  const handTypes = ['AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s'];
  
  for (let i = 0; i < 13; i++) {
    const row: number[] = [];
    for (let j = 0; j < 13; j++) {
      if (i === 0) {
        row.push(j === 0 ? 100 : 0);
      } else if (i < 3) {
        row.push(j <= i ? 100 : j === i + 1 ? 50 : 0);
      } else if (i < 6) {
        row.push(j <= i ? (j === i ? 100 : 50) : 0);
      } else if (i < 9) {
        row.push(j <= i ? (j === i ? 100 : 25) : 0);
      } else {
        row.push(j <= i ? (j === i ? 100 : 0) : 0);
      }
    }
    range.push(row);
  }
  
  return range;
}

export type StatType = 'fold-to-raise' | 'call-raise' | '3-bet' | 'missed-2nd' | '2nd-barrel' | '3rd-barrel' | 'check-profit';

export interface FilterContext {
  statType?: StatType;
  position?: string;
}

interface PokerAnalyticsProps {
  panelId?: string;
  title?: string;
  filterContext?: FilterContext;
  onDrillDown?: (statType: StatType, title: string) => void;
  onClose?: () => void;
  isBasePanel?: boolean;
  playerId?: string;
  playerName?: string;
  isCompanyWide?: boolean;
  defaultTab?: 'stats' | 'graph' | 'range' | 'strength';
  onHandClick?: (hand: Hand) => void;
}

const STAT_TYPE_MAP: Record<string, string> = {
  'Fold to Raise': 'fold-to-raise',
  'Call Raise': 'call-raise',
  '3-Bet': '3-bet',
  'Missed 2nd Barrel': 'missed-2nd',
  '2nd Barrel': '2nd-barrel',
  '3rd Barrel': '3rd-barrel',
  'Check Profit Rate': 'check-profit',
};

export interface Card {
  rank: string;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
}

export interface Hand {
  id: string;
  preflop: Card[];
  flop: Card[];
  turn: Card | null;
  river: Card | null;
  position: string;
  result: 'win' | 'lose' | 'split';
  profit: number;
}

export function PokerAnalytics({ 
  panelId, 
  title, 
  filterContext = {}, 
  onDrillDown, 
  onClose, 
  isBasePanel = true,
  playerId, 
  playerName, 
  isCompanyWide = false,
  defaultTab = 'stats',
  onHandClick
}: PokerAnalyticsProps) {
  const [activeCategory, setActiveCategory] = useState(ANALYTICS_CATEGORIES[0]);
  const [activeTab, setActiveTab] = useState<'stats' | 'graph' | 'range' | 'strength' | 'mtt'>(defaultTab);
  const [statsSubTab, setStatsSubTab] = useState<'actions' | 'positions' | 'hands'>('actions');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState<AnalyticsCategory[]>([]);
  const [graphType, setGraphType] = useState<'line' | 'bar'>('line');
  const [handsPage, setHandsPage] = useState(1);
  const handsPerPage = 10;

  const generateMockHands = (): Hand[] => {
    const suits: ('hearts' | 'diamonds' | 'clubs' | 'spades')[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    
    const generateCard = (): Card => ({
      rank: ranks[Math.floor(Math.random() * ranks.length)],
      suit: suits[Math.floor(Math.random() * suits.length)],
    });

    const positions = ['SB', 'BB', 'UTG', 'UTG+1', 'HJ', 'CO', 'BTN'];
    const results: ('win' | 'lose' | 'split')[] = ['win', 'lose', 'split'];

    const hands: Hand[] = [];
    for (let i = 0; i < 50; i++) {
      const preflopCards = [generateCard(), generateCard()];
      const flopCards = [generateCard(), generateCard(), generateCard()];
      const hasTurn = Math.random() > 0.2;
      const hasRiver = hasTurn && Math.random() > 0.3;
      const result = results[Math.floor(Math.random() * results.length)];
      const profit = result === 'win' ? Math.random() * 200 : result === 'lose' ? -Math.random() * 150 : 0;

      hands.push({
        id: `hand-${i}`,
        preflop: preflopCards,
        flop: flopCards,
        turn: hasTurn ? generateCard() : null,
        river: hasRiver ? generateCard() : null,
        position: positions[Math.floor(Math.random() * positions.length)],
        result,
        profit: parseFloat(profit.toFixed(2)),
      });
    }
    return hands;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mockHands = useMemo(() => generateMockHands(), []);

  // Static chart data - pre-generated to avoid changing on re-renders
  const winrateByPositionData = useMemo(() => {
    const positions = ['BB (IP)', 'BB (OOP)', 'BTN (IP)', 'CO (IP)', 'CO (OOP)', 'EP (IP)', 'EP (OOP)', 'MP (IP)', 'MP (OOP)', 'SB (OOP)'];
    const textures = ['Rain', 'Mon', 'Mid', 'Prd'];
    const streets = ['F', 'T', 'R'];
    
    return positions.map(pos => {
      const baseWinrate = pos.includes('IP') ? 8 : -3;
      const variance = pos.includes('BB') ? 15 : 8;
      const seed = pos.length * 100;
      
      const getColor = (wr: number) => {
        if (wr >= 15) return '#22c55e';
        if (wr >= 5) return '#84cc16';
        if (wr >= -5) return '#eab308';
        if (wr >= -15) return '#f97316';
        return '#ef4444';
      };
      
      // Simple seeded random for consistency
      const seededRandom = (i: number, j: number) => {
        const x = Math.sin(seed + i * 12.9898 + j * 78.233) * 43758.5453;
        return x - Math.floor(x);
      };
      
      const data = textures.flatMap((texture, i) => 
        streets.map((street, j) => ({
          texture: `${texture}-${street}`,
          x: 0.5,
          winrate: baseWinrate + (seededRandom(i, j) * variance * 2 - variance) + (i * 3) - (j * 2),
          fill: getColor(baseWinrate + (seededRandom(i, j) * variance * 2 - variance) + (i * 3) - (j * 2))
        }))
      );
      
      return { position: pos, data, avg: pos.includes('IP') ? 8.3 : -2.1 };
    });
  }, []);

  const heroVillainData = useMemo(() => {
    const positions = ['BB', 'SB', 'BTN', 'CO', 'HJ', 'MP', 'EP', 'UTG'];
    const positionStrength: Record<string, number> = {
      'BTN': 20, 'CO': 15, 'HJ': 10, 'MP': 5, 
      'EP': 0, 'UTG': -5, 'SB': -8, 'BB': -10
    };
    
    const getColor = (wr: number) => {
      if (wr >= 15) return '#22c55e';
      if (wr >= 5) return '#84cc16';
      if (wr >= -5) return '#eab308';
      if (wr >= -15) return '#f97316';
      return '#ef4444';
    };
    
    return positions.map(heroPosition => {
      const heroStrength = positionStrength[heroPosition] || 0;
      const villainPositions = positions.filter(p => p !== heroPosition);
      const avg = (positionStrength[heroPosition] || 0) - 4; // Simplified avg calculation
      
      const seed = heroPosition.charCodeAt(0) * 100 + heroPosition.charCodeAt(1);
      const seededRandom = (i: number) => {
        const x = Math.sin(seed + i * 12.9898) * 43758.5453;
        return x - Math.floor(x);
      };
      
      const data = villainPositions.map((villain, i) => {
        const villainStrength = positionStrength[villain] || 0;
        const baseWinrate = heroStrength - villainStrength;
        const variance = 8;
        const winrate = baseWinrate + (seededRandom(i) * variance * 2 - variance);
        
        return {
          villain,
          x: 0.5,
          winrate,
          fill: getColor(winrate)
        };
      });
      
      return { heroPosition, data, avg };
    });
  }, []);

  const CardComponent = ({ card, size = 'sm' }: { card: Card; size?: 'sm' | 'md' }) => {
    const suitStyles: Record<string, { bg: string; text: string; border: string }> = {
      hearts: { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-200' },
      diamonds: { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-200' },
      clubs: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
      spades: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
    };

    const suitSymbols: Record<string, string> = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠',
    };

    const style = suitStyles[card.suit];

    return (
      <div className={`${style.bg} ${style.text} ${style.border} ${size === 'sm' ? 'w-7 h-9' : 'w-10 h-12'} rounded border flex items-center justify-center font-bold shadow-sm ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        <span>{card.rank}</span>
        <span className="ml-0.5">{suitSymbols[card.suit]}</span>
      </div>
    );
  };

  const allCategories = [activeCategory, ...activeFilters];
  const allCategoriesFlat = allCategories.flatMap(c => c.stats.map(s => `${c.label} > ${s.name}`));

  const addFilter = (category: AnalyticsCategory) => {
    if (!activeFilters.find(f => f.id === category.id) && category.id !== activeCategory.id) {
      setActiveFilters([...activeFilters, category]);
    }
    setShowFilterDropdown(false);
  };

  const removeFilter = (categoryId: string) => {
    setActiveFilters(activeFilters.filter(f => f.id !== categoryId));
  };

  const aggregateStats = (categories: AnalyticsCategory[]) => {
    const statMap = new Map<string, StatRow>();
    categories.forEach(cat => {
      cat.stats.forEach(stat => {
        if (stat.hands > 0) {
          const existing = statMap.get(stat.name);
          if (existing) {
            existing.hands += stat.hands;
            existing.actionProfit += stat.actionProfit;
            existing.won += stat.won;
            existing.evDiff += stat.evDiff;
          } else {
            statMap.set(stat.name, { ...stat });
          }
        }
      });
    });
    return Array.from(statMap.values()).map(stat => ({
      ...stat,
      actionProfitPerHand: stat.hands > 0 ? parseFloat((stat.actionProfit / stat.hands).toFixed(2)) : 0,
    }));
  };

  const aggregatePositionStats = (categories: AnalyticsCategory[]) => {
    const posMap = new Map<string, PositionStat>();
    categories.forEach(cat => {
      cat.positionStats.forEach(pos => {
        const existing = posMap.get(pos.position);
        if (existing) {
          existing.hands += pos.hands;
          existing.actionProfit += pos.actionProfit;
          existing.won += pos.won;
          existing.evDiff += pos.evDiff;
        } else {
          posMap.set(pos.position, { ...pos });
        }
      });
    });
    return Array.from(posMap.values()).map(pos => ({
      ...pos,
      actionProfitPerHand: pos.hands > 0 ? parseFloat((pos.actionProfit / pos.hands).toFixed(2)) : 0,
    }));
  };

  const formatCurrency = (value: number) => {
    const sign = value >= 0 ? '' : '-';
    return `${sign}$${Math.abs(value).toLocaleString()}`;
  };

  const formatBbs = (value: number) => {
    return `${value.toLocaleString()} bbs`;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded text-sm transition-colors ${
                activeFilters.length > 0 
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {activeCategory.icon}
              {activeCategory.label}
              {activeFilters.length > 0 && (
                <span className="px-1.5 py-0.5 bg-yellow-200 text-yellow-900 text-[10px] rounded-full">
                  +{activeFilters.length + 1}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {activeFilters.map((filter) => (
              <span
                key={filter.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-800 text-xs rounded-full border border-yellow-200"
              >
                {filter.icon}
                <span>{filter.label}</span>
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="ml-1 hover:text-yellow-600 font-medium"
                >
                  ×
                </button>
              </span>
            ))}
            
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded text-sm transition-colors"
              >
                <span className="text-lg font-bold">+</span>
                <span className="text-xs">Add Filter</span>
              </button>
              
              {showFilterDropdown && (
                <div className="absolute z-10 mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden min-w-[200px]">
                  {ANALYTICS_CATEGORIES.filter(c => c.id !== activeCategory.id && !activeFilters.find(f => f.id === c.id)).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => addFilter(category)}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors text-gray-700"
                    >
                      {category.icon}
                      {category.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {showDropdown && (
            <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {ANALYTICS_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category);
                    setShowDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors ${
                    activeCategory.id === category.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  }`}
                >
                  {category.icon}
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-6 mb-4 pb-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-1 transition-all text-sm font-medium ${
              activeTab === 'stats'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`pb-1 transition-all text-sm font-medium ${
              activeTab === 'graph'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
Graphs
          </button>
          <button
            onClick={() => setActiveTab('range')}
            className={`pb-1 transition-all text-sm font-medium ${
              activeTab === 'range'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Preflop Range
          </button>
          <button
            onClick={() => setActiveTab('strength')}
            className={`pb-1 transition-all text-sm font-medium ${
              activeTab === 'strength'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Hand Strength
          </button>
          <button
            onClick={() => setActiveTab('mtt')}
            className={`pb-1 transition-all text-sm font-medium ${
              activeTab === 'mtt'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tournament Stats
          </button>
        </div>

        {activeTab === 'mtt' && (
          <div className="py-4">
            {/* MTT Stats Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">MTT Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-slate-800">5</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">Tournaments</div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-slate-800">40%</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">ITM %</div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-slate-800">$2,035</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">Net Profit</div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-slate-800">68.5%</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">ROI</div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-slate-800">#84</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">Avg Finish</div>
                </div>
              </div>
            </div>

            {/* MTT Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Investment vs Returns */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-800 mb-4">Investment vs Returns</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Total Buy-ins', value: 2965 },
                      { name: 'Total Cashed', value: 5000 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '11px' }} />
                      <YAxis stroke="#64748b" style={{ fontSize: '11px' }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Bar dataKey="value" fill="#64748b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Profit Over Time */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-800 mb-4">Profit Over Time</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { tournament: '1', profit: -215 },
                      { tournament: '2', profit: -100 },
                      { tournament: '3', profit: 450 },
                      { tournament: '4', profit: 1200 },
                      { tournament: '5', profit: 2035 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="tournament" stroke="#64748b" style={{ fontSize: '11px' }} />
                      <YAxis stroke="#64748b" style={{ fontSize: '11px' }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Profit']} contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="profit" stroke="#475569" strokeWidth={2} dot={{ fill: '#475569' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Finish Positions */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-800 mb-4">Finish Positions</h4>
                <div className="space-y-2">
                  {[
                    { date: 'Mar 15', position: 12, entries: 500, prize: '$2,780', roi: '+424%' },
                    { date: 'Mar 14', position: 156, entries: 300, prize: '-', roi: '-100%' },
                    { date: 'Mar 10', position: 45, entries: 250, prize: '$550', roi: '+2%' },
                    { date: 'Mar 8', position: 8, entries: 150, prize: '$1,200', roi: '+457%' },
                    { date: 'Mar 5', position: 110, entries: 200, prize: '-', roi: '-100%' }
                  ].map((tournament, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                          tournament.prize !== '-' ? 'bg-slate-100 text-slate-700' : 'bg-slate-50 text-slate-500'
                        }`}>
                          #{tournament.position}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-slate-700">{tournament.date}</div>
                          <div className="text-[10px] text-slate-500">{tournament.entries} entries</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-slate-700">
                          {tournament.prize}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {tournament.roi}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buyin Distribution */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-800 mb-4">Buy-in Distribution</h4>
                <div className="space-y-3">
                  {[
                    { stake: '$530', count: 3, total: '$1,590' },
                    { stake: '$215', count: 2, total: '$430' },
                    { stake: '$1,050', count: 0, total: '$0' }
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <span className="text-sm text-slate-700">{row.stake}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500">{row.count} entries</span>
                        <span className="text-xs font-medium text-slate-700 w-20 text-right">{row.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <>
            {/* Metrics Row - Only shown on Stats tab */}
            <div className="flex flex-wrap gap-8">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">
                  {activeFilters.length > 0 
                    ? allCategories.reduce((sum, c) => sum + parseInt(c.summary.hit.replace(/[^0-9]/g, '')), 0).toLocaleString()
                    : activeCategory.summary.hit}
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Hit</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-500">
                  {activeFilters.length > 0 
                    ? allCategories.reduce((sum, c) => sum + parseInt(c.summary.opportunities.replace(/[^0-9]/g, '')), 0).toLocaleString()
                    : activeCategory.summary.opportunities}
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Opp-s to hit</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">
                  {activeFilters.length > 0 
                    ? Math.round(allCategories.reduce((sum, c) => sum + parseInt(c.summary.hitsPerThousand.replace(/[^0-9]/g, '')), 0) / allCategories.length)
                    : activeCategory.summary.hitsPerThousand}
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Hits per 1000</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">
                  {activeFilters.length > 0 
                    ? Math.round(allCategories.reduce((sum, c) => sum + parseInt(c.summary.continuationBet), 0) / allCategories.length)
                    : activeCategory.summary.continuationBet}
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">C-Bet Flop</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-700">
                  {activeFilters.length > 0 
                    ? Math.round(allCategories.reduce((sum, c) => sum + parseInt(c.summary.allVillainsFold), 0) / allCategories.length)
                    : activeCategory.summary.allVillainsFold}
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Villain Fold</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-700">
                  {activeFilters.length > 0 
                    ? Math.round(allCategories.reduce((sum, c) => sum + parseInt(c.summary.oneVillainCall), 0) / allCategories.length)
                    : activeCategory.summary.oneVillainCall}
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Villain Call</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-700">
                  {activeFilters.length > 0 
                    ? Math.round(allCategories.reduce((sum, c) => sum + parseInt(c.summary.villainRaise), 0) / allCategories.length)
                    : activeCategory.summary.villainRaise}
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Villain Raise</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-bold ${allCategories.reduce((sum, c) => sum + c.summary.actionProfit, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatBbs(allCategories.reduce((sum, c) => sum + c.summary.actionProfit, 0))}
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Profit, bbs</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-bold ${allCategories.reduce((sum, c) => sum + c.summary.actionProfitPerHand, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(allCategories.reduce((sum, c) => sum + c.summary.actionProfitPerHand, 0) / allCategories.length).toFixed(1)}
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Profit/hand</span>
              </div>
              {aggregateStats(allCategories).map((stat) => (
                <div 
                  key={stat.name}
                  className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    const statType = STAT_TYPE_MAP[stat.name];
                    if (statType && onDrillDown) {
                      onDrillDown(statType as StatType, `${activeCategory.label} > ${stat.name}`);
                    }
                  }}
                >
                  <span className="text-base font-medium text-gray-700">
                    {stat.name === 'Check Profit Rate' ? stat.actionProfitPerHand.toFixed(1) : stat.statValue}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">{stat.name}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'graph' && (
          <div className="grid grid-cols-3 gap-4">
            {/* Performance Chart */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-[10px] text-gray-500 mb-3">Performance</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={activeCategory.graphData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" />
                  <XAxis dataKey="hands" stroke="#9ca3af" style={{ fontSize: '10px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '8px', fontSize: '10px', color: '#374151' }}
                    formatter={(value: number) => [`${value}`]}
                  />
                  <Line type="monotone" dataKey="value" stroke="#9ca3af" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Winrate by Position */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-[10px] text-gray-500 mb-3">Winrate by Position</div>
              <div className="overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  {winrateByPositionData.map((posData) => (
                    <div key={posData.position} className="bg-white rounded p-2 flex-shrink-0 w-40">
                      <div className="text-[9px] text-gray-500 mb-1 text-center">{posData.position}</div>
                      <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" />
                            <XAxis type="number" dataKey="x" domain={[0, 1]} tick={false} hide={true} />
                            <YAxis type="number" dataKey="winrate" domain={[-50, 50]} ticks={[-50, 0, 50]} tick={{ fontSize: 9 }} stroke="#d1d5db" width={30} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px', fontSize: '10px' }}
                              formatter={(value: number, name: string, props: any) => [`${value > 0 ? '+' : ''}${value.toFixed(1)}`, `${props.payload.texture}`]}
                            />
                            <ZAxis range={[60, 60]} />
                            <Scatter 
                              data={posData.data}
                              shape={(props: any) => {
                                const { cx, cy, fill } = props;
                                return <circle cx={cx} cy={cy} r={4} fill={fill} opacity={0.8} />;
                              }}
                            />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-center text-[9px] text-gray-600 mt-1 pt-1 border-t border-gray-100">
                        {posData.avg > 0 ? '+' : ''}{posData.avg.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hero/Villain Winrate */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-[10px] text-gray-500 mb-3">Hero vs Villain</div>
              <div className="overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  {heroVillainData.map((heroData) => (
                    <div key={heroData.heroPosition} className="bg-white rounded p-2 flex-shrink-0 w-40">
                      <div className="text-[9px] text-gray-500 mb-1 text-center">{heroData.heroPosition}</div>
                      <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" />
                            <XAxis type="number" dataKey="x" domain={[0, 1]} tick={false} hide={true} />
                            <YAxis type="number" dataKey="winrate" domain={[-50, 50]} ticks={[-50, 0, 50]} tick={{ fontSize: 9 }} stroke="#d1d5db" width={30} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px', fontSize: '10px' }}
                              formatter={(value: number, name: string, props: any) => [`${value > 0 ? '+' : ''}${value.toFixed(1)}`, `vs ${props.payload.villain}`]}
                            />
                            <ZAxis range={[60, 60]} />
                            <Scatter 
                              data={heroData.data}
                              shape={(props: any) => {
                                const { cx, cy, fill } = props;
                                return <circle cx={cx} cy={cy} r={4} fill={fill} opacity={0.8} />;
                              }}
                            />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-center text-[9px] text-gray-600 mt-1 pt-1 border-t border-gray-100">
                        {heroData.avg > 0 ? '+' : ''}{heroData.avg.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'range' && (
          <div className="overflow-x-auto">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="p-1"></th>
                  {['AA', 'AK', 'AQ', 'AJ', 'AT', 'A9', 'A8', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2'].map((h) => (
                    <th key={h} className="p-1 text-[9px] text-gray-400 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s'].map((rowHand, i) => (
                  <tr key={rowHand}>
                    <td className="p-1 text-[9px] text-gray-400 font-normal">{rowHand}</td>
                    {activeCategory.rangeData[i].map((value, j) => (
                      <td
                        key={j}
                        className="p-0.5 text-center cursor-pointer border border-white"
                        style={{
                          backgroundColor: value === 100 ? '#111827' : value === 50 ? '#6b7280' : value === 25 ? '#9ca3af' : '#f9fafb',
                          color: value > 50 ? '#ffffff' : '#374151',
                          fontSize: '8px',
                          fontWeight: value === 100 ? '600' : '400'
                        }}
                        title={`${rowHand} vs ${['AA', 'AK', 'AQ', 'AJ', 'AT', 'A9', 'A8', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2'][j]}: ${value}%`}
                      >
                        {value > 0 ? `${value}` : ''}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-1"></td>
                  {['AA', 'AK', 'AQ', 'AJ', 'AT', 'A9', 'A8', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2'].map((h) => (
                    <td key={h} className="p-1 text-[9px] text-gray-400 font-normal">{h}o</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'strength' && (
          <div className="grid grid-cols-3 gap-2">
            {activeCategory.handStrengthData.map((item) => (
              <div key={item.hand} className="bg-gray-50 rounded p-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-gray-600">{item.hand}</span>
                  <span className="text-xs font-medium text-gray-700">{item.equity}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-gray-400 h-1 rounded-full"
                    style={{ width: `${item.equity}%` }}
                  ></div>
                </div>
                <div className="text-[9px] text-gray-400 mt-1">
                  {item.frequency}%
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Sub-Tabs - Fixed at bottom */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex gap-6 mb-4 pb-2 border-b border-gray-200">
          <button
            onClick={() => setStatsSubTab('actions')}
            className={`pb-1 transition-all text-sm font-medium ${
              statsSubTab === 'actions'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Next Actions
          </button>
          <button
            onClick={() => setStatsSubTab('positions')}
            className={`pb-1 transition-all text-sm font-medium ${
              statsSubTab === 'positions'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Positions
          </button>
          <button
            onClick={() => { setStatsSubTab('hands'); setHandsPage(1); }}
            className={`pb-1 transition-all text-sm font-medium ${
              statsSubTab === 'hands'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Hands
          </button>
        </div>

        {/* Tables based on sub-tab - Fixed at bottom */}
        {statsSubTab === 'actions' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] text-gray-500 uppercase font-semibold tracking-wide">
                  <th className="pb-2 pr-4 font-normal">Action</th>
                  <th className="pb-2 pr-4 font-normal">Hands</th>
                  <th className="pb-2 pr-4 font-normal">Opp-s</th>
                  <th className="pb-2 pr-4 font-normal">per 1k</th>
                  <th className="pb-2 pr-4 font-normal">Value</th>
                  <th className="pb-2 pr-4 font-normal">Won</th>
                  <th className="pb-2 pr-4 font-normal">Profit</th>
                  <th className="pb-2 pr-4 font-normal">$/hand</th>
                  <th className="pb-2 pr-4 font-normal">Disp.</th>
                  <th className="pb-2 font-normal">EV</th>
                </tr>
              </thead>
              <tbody>
                {aggregateStats(allCategories).map((stat, idx) => (
                  <tr 
                    key={stat.name} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      const statType = STAT_TYPE_MAP[stat.name];
                      if (statType && onDrillDown) {
                        onDrillDown(statType as StatType, `${activeCategory.label} > ${stat.name}`);
                      }
                    }}
                  >
                    <td className="py-2.5 pr-4 text-sm text-gray-900 font-medium">{stat.name}</td>
                    <td className="py-2.5 pr-4 text-sm text-gray-700">{stat.hands.toLocaleString()}</td>
                    <td className="py-2.5 pr-4 text-sm text-gray-700">{stat.opportunities}</td>
                    <td className="py-2.5 pr-4 text-sm text-gray-700">{stat.hitsPerOne}</td>
                    <td className="py-2.5 pr-4 text-sm text-gray-700">{stat.statValue}</td>
                    <td className={`py-2.5 pr-4 text-sm ${stat.won >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(stat.won)}
                    </td>
                    <td className={`py-2.5 pr-4 text-sm ${stat.actionProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatBbs(stat.actionProfit)}
                    </td>
                    <td className={`py-2.5 pr-4 text-sm ${stat.actionProfitPerHand >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.actionProfitPerHand}
                    </td>
                    <td className="py-2.5 pr-4 text-sm text-gray-700">{stat.dispersion.toFixed(2)}</td>
                    <td className={`py-2.5 text-sm ${stat.evDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.evDiff !== 0 ? formatCurrency(stat.evDiff) : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {statsSubTab === 'positions' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] text-gray-500 uppercase font-semibold tracking-wide">
                  <th className="pb-2 pr-4 font-normal">Position</th>
                  <th className="pb-2 pr-4 font-normal">Hands</th>
                  <th className="pb-2 pr-4 font-normal">Opp-s</th>
                  <th className="pb-2 pr-4 font-normal">per 1k</th>
                  <th className="pb-2 pr-4 font-normal">Value</th>
                  <th className="pb-2 pr-4 font-normal">Won</th>
                  <th className="pb-2 pr-4 font-normal">Profit</th>
                  <th className="pb-2 pr-4 font-normal">$/hand</th>
                  <th className="pb-2 pr-4 font-normal">Disp.</th>
                  <th className="pb-2 font-normal">EV</th>
                </tr>
              </thead>
              <tbody>
                {aggregatePositionStats(allCategories).map((posStat, idx) => (
                  <tr 
                    key={posStat.position} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      if (onDrillDown) {
                        onDrillDown('fold-to-raise' as StatType, `${activeCategory.label} > ${posStat.position}`);
                      }
                    }}
                  >
                    <td className="py-2.5 pr-4 text-sm text-gray-900 font-medium">{posStat.position}</td>
                    <td className="py-2.5 pr-4 text-sm text-gray-700">{posStat.hands.toLocaleString()}</td>
                    <td className="py-2.5 pr-4 text-sm text-gray-700">{posStat.opportunities}</td>
                    <td className="py-2.5 pr-4 text-sm text-gray-700">{posStat.hitsPerOne}</td>
                    <td className="py-2.5 pr-4 text-sm text-gray-700">{posStat.statValue}</td>
                    <td className={`py-2.5 pr-4 text-sm ${posStat.won >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(posStat.won)}
                    </td>
                    <td className={`py-2.5 pr-4 text-sm ${posStat.actionProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatBbs(posStat.actionProfit)}
                    </td>
                    <td className={`py-2.5 pr-4 text-sm ${posStat.actionProfitPerHand >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {posStat.actionProfitPerHand}
                    </td>
                    <td className="py-2.5 pr-4 text-sm text-gray-700">{posStat.dispersion.toFixed(2)}</td>
                    <td className={`py-2.5 text-sm ${posStat.evDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {posStat.evDiff !== 0 ? formatCurrency(posStat.evDiff) : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {statsSubTab === 'hands' && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] text-gray-500 uppercase font-semibold tracking-wide">
                    <th className="pb-2 pr-4 font-normal">Position</th>
                    <th className="pb-2 pr-4 font-normal">Preflop</th>
                    <th className="pb-2 pr-4 font-normal">Flop</th>
                    <th className="pb-2 pr-4 font-normal">Turn</th>
                    <th className="pb-2 pr-4 font-normal">River</th>
                    <th className="pb-2 pr-4 font-normal">Result</th>
                    <th className="pb-2 font-normal">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {mockHands.slice((handsPage - 1) * handsPerPage, handsPage * handsPerPage).map((hand) => (
                    <tr 
                      key={hand.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onHandClick?.(hand)}
                    >
                      <td className="py-2.5 pr-4 text-sm text-gray-700">{hand.position}</td>
                      <td className="py-2.5 pr-4">
                        <div className="flex gap-1">
                          {hand.preflop.map((card, i) => (
                            <CardComponent key={i} card={card} />
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 pr-4">
                        <div className="flex gap-1">
                          {hand.flop.map((card, i) => (
                            <CardComponent key={i} card={card} />
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 pr-4">
                        {hand.turn && <CardComponent card={hand.turn} />}
                      </td>
                      <td className="py-2.5 pr-4">
                        {hand.river && <CardComponent card={hand.river} />}
                      </td>
                      <td className={`py-2.5 pr-4 text-sm font-medium ${
                        hand.result === 'win' ? 'text-green-600' : 
                        hand.result === 'lose' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {hand.result.charAt(0).toUpperCase() + hand.result.slice(1)}
                      </td>
                      <td className={`py-2.5 text-sm ${hand.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${hand.profit.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200">
              {Array.from({ length: Math.ceil(mockHands.length / handsPerPage) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setHandsPage(page)}
                  className={`w-8 h-8 text-sm rounded ${
                    handsPage === page
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
