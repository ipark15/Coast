import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import PrimaryButton from '@/src/components/PrimaryButton';
import SafetyBar from '@/src/components/SafetyBar';
import { colors, radius, spacing, typography } from '@/src/tokens';
import { LaneType, laneConfig } from '@/src/utils/laneColor';

// TODO(MVP): Replace with real GPS + Mapbox Directions turn-by-turn data
const MOCK_NAV = {
  distanceToTurn: '200 FT',
  direction:      'right' as const,
  street:         'Fountain Ave',
  laneType:       'safe' as LaneType,
  timeLeft:       '14 min',
  distance:       '3.2 mi',
  arrival:        '10:42 am',
  safePercent:    85,
  safety:         { safe: 85, caution: 10, hard: 5 },
};

const DIRECTION_ICON: Record<string, React.ComponentProps<typeof FontAwesome>['name']> = {
  straight: 'arrow-up',
  left:     'arrow-left',
  right:    'arrow-right',
};

export default function RideScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();

  const handleFinish = () =>
    Alert.alert('End ride?', '', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End ride', style: 'destructive', onPress: () => router.dismiss() },
    ]);

  return (
    <View style={styles.root}>

      {/* ── Map area (fills entire screen) ── */}
      <View style={StyleSheet.absoluteFill}>
        <LiveMapPlaceholder />
      </View>

      {/* ── Top safe area with header + turn card ── */}
      <SafeAreaView edges={['top']} style={styles.topOverlay} pointerEvents="box-none">

        {/* Turn instruction card */}
        <View style={styles.turnCard}>
          <View style={styles.turnLeft}>
            <Text style={styles.turnDistance}>IN {MOCK_NAV.distanceToTurn}</Text>
            <View style={styles.turnRow}>
              <View style={styles.arrowBox}>
                <FontAwesome name={DIRECTION_ICON[MOCK_NAV.direction]} size={26} color={colors.headerDark} />
              </View>
              <Text style={styles.turnStreet}>Turn right on{'\n'}{MOCK_NAV.street}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.speakerBtn} hitSlop={8}>
            <FontAwesome name="volume-up" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>

        {/* Lane status pill */}
        <View style={styles.laneRow}>
          <View style={styles.lanePill}>
            <View style={styles.laneDot} />
            <Text style={styles.lanePillText}>
              CURRENTLY: {laneConfig[MOCK_NAV.laneType].label.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.laneNext}>Then 1.2 mi</Text>
        </View>

      </SafeAreaView>

      {/* ── Fixed bottom bar ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.sm }]}>

        {/* Safety bar */}
        <View style={styles.safetyRow}>
          <Text style={styles.safetyLabel}>ROUTE SAFETY BREAKDOWN</Text>
          <Text style={styles.safetyPct}>{MOCK_NAV.safePercent}% PROTECTED</Text>
        </View>
        <SafetyBar safe={MOCK_NAV.safety.safe} caution={MOCK_NAV.safety.caution} hard={MOCK_NAV.safety.hard} />

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCol label="TIME LEFT" value={MOCK_NAV.timeLeft} />
          <View style={styles.statDivider} />
          <StatCol label="DISTANCE"  value={MOCK_NAV.distance} />
          <View style={styles.statDivider} />
          <StatCol label="ARRIVAL"   value={MOCK_NAV.arrival} />
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <PrimaryButton
            label="Finish Ride"
            icon="flag-checkered"
            variant="dark"
            onPress={handleFinish}
            style={styles.finishBtn}
          />
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <FontAwesome name="times" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

      </View>

    </View>
  );
}

// ─── Live map placeholder ─────────────────────────────────────────────────────
// TODO(MVP): Replace this entire component with a Mapbox MapView in navigation
// mode. Needs: MAPBOX_ACCESS_TOKEN env var, @rnmapbox/maps installed, live
// GPS location from expo-location, and a route LineLayer with colored segments.

function LiveMapPlaceholder() {
  return (
    <View style={map.container}>
      <View style={map.badge}>
        <FontAwesome name="map-marker" size={12} color={colors.teal} />
        <Text style={map.badgeText}>Live map — API key required</Text>
      </View>

      {/* Simulated road grid */}
      <View style={map.grid}>
        <View style={map.roadH} />
        <View style={map.roadV} />
        <View style={[map.roadH, { top: '65%' }]} />
        <View style={[map.roadV, { left: '70%' }]} />
      </View>

      {/* Simulated colored route line */}
      <View style={map.routeWrap}>
        <View style={[map.routeSeg, { flex: 85, backgroundColor: colors.safe }]} />
        <View style={[map.routeSeg, { flex: 10, backgroundColor: colors.caution }]} />
        <View style={[map.routeSeg, { flex: 5,  backgroundColor: colors.hard }]} />
      </View>

      {/* User location puck */}
      <View style={map.puckOuter}>
        <View style={map.puckInner} />
      </View>

      <Text style={map.hint}>Mapbox renders here once API key is added</Text>
    </View>
  );
}

// ─── Stat column ──────────────────────────────────────────────────────────────

function StatCol({ label, value }: { label: string; value: string }) {
  return (
    <View style={stat.col}>
      <Text style={stat.value}>{value}</Text>
      <Text style={stat.label}>{label}</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.mapBackground,
  },

  // Top overlay (sits above the map)
  topOverlay: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },

  // Turn card
  turnCard: {
    backgroundColor: colors.headerDark,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  turnLeft:     { flex: 1, gap: spacing.sm },
  turnDistance: {
    ...typography.label,
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  turnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  arrowBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnStreet: {
    ...typography.heading,
    color: colors.surface,
    flex: 1,
    lineHeight: 24,
  },
  speakerBtn: {
    marginTop: 4,
    padding: spacing.xs,
  },

  // Lane row
  laneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  lanePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.safeLight,
    borderRadius: radius.full,
    paddingVertical: 5,
    paddingHorizontal: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  laneDot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colors.safe,
  },
  lanePillText: {
    ...typography.label,
    color: colors.safe,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  laneNext: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: radius.full,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },

  // Fixed bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },

  // Safety
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  safetyLabel: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
  },
  safetyPct: {
    ...typography.label,
    color: colors.safe,
    fontSize: 11,
    fontWeight: '600',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    alignSelf: 'stretch',
  },

  // Buttons
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  finishBtn: {
    flex: 1,
  },
  closeBtn: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
});

const map = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mapBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // "API key required" badge
  badge: {
    position: 'absolute',
    top: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  badgeText: {
    ...typography.label,
    color: colors.teal,
    fontSize: 11,
    letterSpacing: 0,
  },

  // Simulated road grid lines
  grid: {
    ...StyleSheet.absoluteFillObject,
  },
  roadH: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  roadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '35%',
    width: 12,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },

  // Colored route line
  routeWrap: {
    position: 'absolute',
    top: '39%',
    left: '35%',
    width: '55%',
    height: 6,
    flexDirection: 'row',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  routeSeg: { height: '100%' },

  // User puck
  puckOuter: {
    position: 'absolute',
    top: '38%',
    left: '34%',
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  puckInner: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
    backgroundColor: colors.teal,
    borderWidth: 2,
    borderColor: colors.surface,
  },

  hint: {
    position: 'absolute',
    bottom: '32%',
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});

const stat = StyleSheet.create({
  col:   { flex: 1, alignItems: 'center', gap: 4 },
  value: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  label: { ...typography.label, color: colors.textMuted, fontSize: 10, letterSpacing: 0.3 },
});
