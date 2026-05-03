import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackNav from '@/src/components/BackNav';
import GhostButton from '@/src/components/GhostButton';
import InfoCard from '@/src/components/InfoCard';
import PrimaryButton from '@/src/components/PrimaryButton';
import RouteListItem from '@/src/components/RouteListItem';
import SafetyBar from '@/src/components/SafetyBar';
import StatCard from '@/src/components/StatCard';
import { colors, radius, spacing, typography } from '@/src/tokens';

// TODO(MVP): Replace with real route data from Mapbox Directions API
const MOCK_ROUTE = {
  destination: 'Silver Lake Reservoir',
  stats: { distance: '2.4 mi', time: '18 min', elevation: '+124 ft' },
  safety: { safe: 78, caution: 15, hard: 7 },
  turns: [
    { type: 'safe',    direction: 'straight', street: 'Fountain Ave',    distance: '0.4 mi' },
    { type: 'safe',    direction: 'right',    street: 'Virgil Ave',      distance: '0.2 mi' },
    { type: 'caution', direction: 'straight', street: 'Sunset Blvd',     distance: '0.3 mi' },
    { type: 'safe',    direction: 'left',     street: 'Silver Lake Blvd',distance: '0.8 mi' },
    { type: 'safe',    direction: 'right',    street: 'Reservoir Dr',    distance: '0.2 mi' },
  ],
} as const;

export default function RouteSummaryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackNav label="Back" onPress={() => router.back()} />

        {/* Title */}
        <Text style={styles.titleLabel}>Safest route to</Text>
        <Text style={styles.titleDestination}>{MOCK_ROUTE.destination}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard value={MOCK_ROUTE.stats.distance} label="Distance" />
          <StatCard value={MOCK_ROUTE.stats.time} label="Est. Time" />
          <StatCard value={MOCK_ROUTE.stats.elevation} label="Elevation" />
        </View>

        {/* Mini map placeholder */}
        <View style={styles.miniMap}>
          <View style={styles.miniMapTrack}>
            <View style={[styles.miniMapSegment, { flex: 78, backgroundColor: colors.safe }]} />
            <View style={[styles.miniMapSegment, { flex: 15, backgroundColor: colors.caution }]} />
            <View style={[styles.miniMapSegment, { flex: 7,  backgroundColor: colors.hard }]} />
          </View>
          <View style={styles.miniMapPill}>
            <Text style={styles.miniMapPillText}>Your location → Silver Lake</Text>
          </View>
          {/* TODO(MVP): Replace with real Mapbox map preview */}
        </View>

        {/* Safety breakdown */}
        <InfoCard label="Safety Breakdown">
          <SafetyBar
            safe={MOCK_ROUTE.safety.safe}
            caution={MOCK_ROUTE.safety.caution}
            hard={MOCK_ROUTE.safety.hard}
          />
          <View style={styles.legend}>
            <LegendDot color={colors.safe} label={`Protected ${MOCK_ROUTE.safety.safe}%`} />
            <Text style={styles.legendSep}>·</Text>
            <LegendDot color={colors.caution} label={`Caution ${MOCK_ROUTE.safety.caution}%`} />
            <Text style={styles.legendSep}>·</Text>
            <LegendDot color={colors.hard} label={`Hard ${MOCK_ROUTE.safety.hard}%`} />
          </View>
          <View style={styles.note}>
            <Text style={styles.noteText}>
              Most of this route uses protected infrastructure. The short stretch on Sunset Blvd has a painted lane — ride confidently and stay out of the door zone.
            </Text>
          </View>
        </InfoCard>

        {/* Route overview */}
        <InfoCard label="Route Overview">
          {MOCK_ROUTE.turns.map((turn, i) => (
            <RouteListItem
              key={i}
              type={turn.type}
              direction={turn.direction}
              street={turn.street}
              distance={turn.distance}
            />
          ))}
        </InfoCard>

      </ScrollView>

      {/* Footer buttons */}
      <View style={styles.footer}>
        <PrimaryButton label="Show on map" onPress={() => router.push('/map')} />
        <GhostButton label="Try a different route" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },

  // Title
  titleLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  titleDestination: {
    ...typography.displayMedium,
    color: colors.teal,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  // Mini map
  miniMap: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 100,
    justifyContent: 'center',
  },
  miniMapTrack: {
    flexDirection: 'row',
    height: 6,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  miniMapSegment: {
    height: '100%',
  },
  miniMapPill: {
    alignSelf: 'center',
    backgroundColor: colors.tealLight,
    borderRadius: radius.full,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  miniMapPillText: {
    ...typography.label,
    color: colors.teal,
  },

  // Legend
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  legendLabel: {
    ...typography.label,
    color: colors.textSecondary,
    letterSpacing: 0,
    fontSize: 12,
  },
  legendSep: {
    ...typography.label,
    color: colors.textMuted,
  },

  // Note / blockquote
  note: {
    borderLeftWidth: 3,
    borderLeftColor: colors.teal,
    paddingLeft: spacing.sm,
    marginTop: spacing.sm,
  },
  noteText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontStyle: 'italic',
  },

  // Footer
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
});
