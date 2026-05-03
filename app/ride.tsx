import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Animated, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SafetyBar from '@/src/components/SafetyBar';
import { colors, radius, spacing, typography } from '@/src/tokens';
import { LaneType, laneConfig } from '@/src/utils/laneColor';

// TODO(MVP): Replace with real GPS position + Mapbox Directions turn-by-turn
const MOCK_TURNS: {
  distance: string;
  direction: 'straight' | 'left' | 'right';
  street: string;
  laneType: LaneType;
  laneDistance: string;
  remainingMi: string;
  remainingMin: number;
  progress: number; // 0–1 position along route
}[] = [
  { distance: '0.3 mi', direction: 'right',    street: 'Rowena Ave',       laneType: 'safe',    laneDistance: '0.8 mi', remainingMi: '1.6 mi', remainingMin: 18, progress: 0.15 },
  { distance: '0.2 mi', direction: 'straight',  street: 'Silver Lake Blvd', laneType: 'caution', laneDistance: '0.3 mi', remainingMi: '1.1 mi', remainingMin: 12, progress: 0.45 },
  { distance: '0.1 mi', direction: 'left',      street: 'Reservoir Dr',     laneType: 'safe',    laneDistance: '0.2 mi', remainingMi: '0.4 mi', remainingMin: 5,  progress: 0.80 },
];

const DIRECTION_ICON: Record<string, React.ComponentProps<typeof FontAwesome>['name']> = {
  straight: 'arrow-up',
  left:     'arrow-left',
  right:    'arrow-right',
};

const BOTTOM_SHEET_HEIGHT = 160;

function getArrivalTime(minutesFromNow: number) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutesFromNow);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function RideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [turnIndex, setTurnIndex] = useState(0);

  const turn = MOCK_TURNS[turnIndex];
  const laneConf = laneConfig[turn.laneType];
  const isLast = turnIndex === MOCK_TURNS.length - 1;

  // Bottom sheet drag — same pattern as map screen
  const COLLAPSED = BOTTOM_SHEET_HEIGHT;
  const EXPANDED  = 280;
  const DRAG_RANGE = EXPANDED - COLLAPSED;

  const positionRef = useRef(0); // starts collapsed (0 = no extra offset)
  const translateY  = useRef(new Animated.Value(0)).current;

  const snapSheet = (expand: boolean) => {
    const toValue = expand ? -DRAG_RANGE : 0;
    positionRef.current = toValue;
    Animated.spring(translateY, { toValue, useNativeDriver: true, tension: 65, friction: 11 }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  (_, { dy }) => Math.abs(dy) > 4,
      onPanResponderGrant: () => { translateY.stopAnimation(); },
      onPanResponderMove: (_, { dy }) => {
        const next = Math.max(-DRAG_RANGE, Math.min(0, positionRef.current + dy));
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        const landed = positionRef.current + dy;
        const goingUp   = vy < -0.3;
        const goingDown = vy >  0.3;
        const expand    = goingDown ? false : goingUp ? true : landed < -DRAG_RANGE / 2;
        snapSheet(expand);
      },
    })
  ).current;

  const handleNextTurn = () => {
    if (isLast) {
      Alert.alert("You've arrived!", 'Welcome to Silver Lake Reservoir.', [
        { text: 'Done', onPress: () => router.dismiss(4) },
      ]);
    } else {
      setTurnIndex((i) => i + 1);
    }
  };

  const handleEndRide = () => {
    Alert.alert('End ride?', '', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End ride', style: 'destructive', onPress: () => router.dismiss(4) },
    ]);
  };

  return (
    <View style={styles.screen}>

      {/* ── Full-screen map ── */}
      <View style={StyleSheet.absoluteFill}>
        <NavMapPlaceholder progress={turn.progress} turnIndex={turnIndex} />
      </View>

      {/* ── Top turn instruction overlay ── */}
      <View style={[styles.turnCard, { top: insets.top + spacing.sm }]}>
        <TouchableOpacity style={styles.arrowBox} onPress={handleNextTurn} activeOpacity={0.85}>
          <FontAwesome name={DIRECTION_ICON[turn.direction]} size={28} color={colors.teal} />
        </TouchableOpacity>
        <View style={styles.turnText}>
          <Text style={styles.inDistance}>IN {turn.distance}</Text>
          <Text style={styles.inStreet}>{turn.street}</Text>
        </View>
        <TouchableOpacity onPress={handleEndRide} style={styles.exitButton} hitSlop={8}>
          <FontAwesome name="times" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* ── Upcoming lane badge ── */}
      <View style={[styles.laneBadge, { top: insets.top + 100 }]}>
        <View style={[styles.laneDot, { backgroundColor: laneConf.color }]} />
        <Text style={[styles.laneLabel, { color: laneConf.color }]}>
          {laneConf.label} ahead · {turn.laneDistance}
        </Text>
      </View>

      {/* ── Bottom stats sheet ── */}
      <Animated.View
        style={[
          styles.bottomSheet,
          { paddingBottom: insets.bottom + spacing.sm, transform: [{ translateY }] },
          { bottom: -(EXPANDED - COLLAPSED) },
        ]}
      >
        {/* Drag handle */}
        <View style={styles.dragArea} {...panResponder.panHandlers}>
          <View style={styles.handle} />
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatItem value={turn.remainingMi} label="Remaining" />
          <View style={styles.statDivider} />
          <StatItem value={getArrivalTime(turn.remainingMin)} label="Arrival" />
          <View style={styles.statDivider} />
          <StatItem value={turn.laneDistance} label="Protected ahead" />
        </View>

        {/* Safety bar */}
        <View style={styles.safetyBarRow}>
          <SafetyBar safe={78} caution={15} hard={7} />
        </View>

        {/* End ride */}
        <TouchableOpacity style={styles.endRide} onPress={handleEndRide}>
          <Text style={styles.endRideText}>End ride</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}

// ─── Navigation map placeholder ───────────────────────────────────────────────

function NavMapPlaceholder({ progress, turnIndex }: { progress: number; turnIndex: number }) {
  // TODO(MVP): Replace with Mapbox MapView in navigation mode (heading-up, user location puck)
  return (
    <View style={navMap.container}>
      <Text style={navMap.label}>Navigation map</Text>
      <Text style={navMap.sub}>Live GPS + Mapbox renders here</Text>

      {/* Route progress track */}
      <View style={navMap.track}>
        {/* Completed portion */}
        <View style={[navMap.completed, { flex: Math.round(progress * 100) }]} />
        {/* Remaining safe */}
        <View style={[navMap.remaining, { flex: Math.round((1 - progress) * 78) }]} />
        {/* Remaining caution */}
        <View style={[navMap.caution, { flex: Math.round((1 - progress) * 15) }]} />
        {/* Remaining hard */}
        <View style={[navMap.hard, { flex: Math.round((1 - progress) * 7) }]} />
      </View>

      {/* Current position puck */}
      <View style={[navMap.puck, { alignSelf: 'flex-start', marginLeft: `${progress * 70 + 15}%` as any }]}>
        <FontAwesome name="circle" size={14} color={colors.teal} />
      </View>

      <Text style={navMap.turnCount}>Turn {turnIndex + 1} of {3}</Text>
    </View>
  );
}

// ─── Inline stat item ─────────────────────────────────────────────────────────

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <View style={stat.item}>
      <Text style={stat.value}>{value}</Text>
      <Text style={stat.label}>{label.toUpperCase()}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E8E4D8',
  },

  // Turn instruction card
  turnCard: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  arrowBox: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnText: {
    flex: 1,
  },
  inDistance: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 2,
  },
  inStreet: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  exitButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Lane badge
  laneBadge: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  laneDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  laneLabel: {
    ...typography.bodySmall,
    fontWeight: '500',
  },

  // Bottom sheet
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  dragArea: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  safetyBarRow: {
    marginBottom: spacing.sm,
  },
  endRide: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  endRideText: {
    ...typography.subheading,
    color: colors.textMuted,
  },
});

const navMap = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E4D8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  label:   { ...typography.subheading, color: colors.textMuted },
  sub:     { ...typography.bodySmall, color: colors.textMuted },
  track: {
    flexDirection: 'row',
    height: 8,
    width: '70%',
    borderRadius: radius.full,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  completed: { height: '100%', backgroundColor: colors.border },
  remaining: { height: '100%', backgroundColor: colors.safe },
  caution:   { height: '100%', backgroundColor: colors.caution },
  hard:      { height: '100%', backgroundColor: colors.hard },
  puck: {
    marginTop: -4,
    width: '70%',
  },
  turnCount: {
    ...typography.label,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});

const stat = StyleSheet.create({
  item:  { alignItems: 'center', flex: 1 },
  value: { ...typography.displayMedium, color: colors.textPrimary, fontSize: 20 },
  label: { ...typography.label, color: colors.textMuted, marginTop: 2 },
});
