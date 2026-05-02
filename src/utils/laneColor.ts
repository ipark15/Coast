import { colors } from '../tokens';

export type LaneType = 'safe' | 'caution' | 'hard';

export const laneConfig = {
  safe: {
    label: 'Protected lane',
    color: colors.safe,
    lightBg: colors.safeLight,
    description: 'Physically separated from car traffic. Comfortable for all riders.',
    tip: null,
  },
  caution: {
    label: 'Painted lane',
    color: colors.caution,
    lightBg: colors.cautionLight,
    description: "A painted line separates you from traffic but there's no physical barrier.",
    tip: 'Stay out of the door zone — ride at least 3 feet from parked cars.',
  },
  hard: {
    label: 'No bike lane',
    color: colors.hard,
    lightBg: colors.hardLight,
    description: "You'll share the lane with car traffic on this stretch.",
    tip: 'Take the lane — ride in the center so drivers can see you clearly.',
  },
} satisfies Record<LaneType, {
  label: string;
  color: string;
  lightBg: string;
  description: string;
  tip: string | null;
}>;

export function classifyLane(laneClass: string): LaneType {
  if (['I', 'IV', 'path', 'protected'].includes(laneClass)) return 'safe';
  if (['II', 'III', 'buffered', 'painted'].includes(laneClass)) return 'caution';
  return 'hard';
}
