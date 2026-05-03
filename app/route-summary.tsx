import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import GhostButton from '@/src/components/GhostButton';
import SafetyBar from '@/src/components/SafetyBar';
import { colors, radius, spacing, typography } from '@/src/tokens';

// TODO(MVP): Replace with real route data from Mapbox Directions API
const MOCK_ROUTE = {
  destination:  'Silver Lake Reservoir',
  address:      '1850 W Silver Lake Dr',
  stats:        { distance: '2.4', time: '18', elevation: '+124' },
  safetyScore:  93,
  safety:       { safe: 78, caution: 15, hard: 7 },
  description:  'This route prioritizes high-visibility bike lanes and protected paths through Fountain Ave. The "Hard" segments are limited to two busy intersections where active signaling and caution are advised.',
  segments: [
    { name: 'Fountain Ave Protected Lane', detail: '1.2 MI • FULLY PROTECTED',  status: 'safe'    as const },
    { name: 'Sunset Junction Crossing',    detail: '0.4 MI • MODERATE TRAFFIC', status: 'caution' as const },
    { name: 'Neighborhood Greenway',       detail: '0.8 MI • LOW TRAFFIC',      status: 'safe'    as const },
  ],
};

const STATUS_ICON: Record<'safe' | 'caution', React.ComponentProps<typeof FontAwesome>['name']> = {
  safe:    'check-circle',
  caution: 'exclamation-circle',
};

export default function RouteSummaryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity style={styles.backRow} onPress={() => router.back()} hitSlop={8} activeOpacity={0.7}>
        <FontAwesome name="arrow-left" size={16} color={colors.teal} />
        <Text style={styles.backLabel}>Back</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Destination header */}
        <View style={styles.destCard}>
          <View style={styles.destIcon}>
            <FontAwesome name="bicycle" size={20} color={colors.teal} />
          </View>
          <View>
            <Text style={styles.destLabel}>Navigating to {MOCK_ROUTE.destination}</Text>
            <Text style={styles.destAddress}>{MOCK_ROUTE.address}</Text>
          </View>
        </View>

        {/* Quick stats row */}
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <FontAwesome name="clock-o" size={14} color={colors.textMuted} />
            <Text style={styles.quickStatValue}>{MOCK_ROUTE.stats.time} min</Text>
          </View>
          <View style={styles.quickStatDot} />
          <View style={styles.quickStat}>
            <FontAwesome name="map-marker" size={14} color={colors.textMuted} />
            <Text style={styles.quickStatValue}>{MOCK_ROUTE.stats.distance} mi</Text>
          </View>
        </View>

        {/* Safety bar + route label */}
        <SafetyBar safe={MOCK_ROUTE.safety.safe} caution={MOCK_ROUTE.safety.caution} hard={MOCK_ROUTE.safety.hard} />
        <Text style={styles.routeLabel}>Your location → Silver Lake</Text>

        {/* Safety breakdown */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Safety Breakdown</Text>
            <Text style={styles.safetyScore}>{MOCK_ROUTE.safetyScore}% Total Score</Text>
          </View>
          <View style={styles.breakdownRow}>
            <BreakdownItem color={colors.safe}    label="Protected" value={`${MOCK_ROUTE.safety.safe}%`} />
            <BreakdownItem color={colors.caution} label="Caution"   value={`${MOCK_ROUTE.safety.caution}%`} />
            <BreakdownItem color={colors.hard}    label="Hard"      value={`${MOCK_ROUTE.safety.hard}%`} />
          </View>
        </View>

        {/* Stat grid */}
        <View style={styles.statGrid}>
          <StatGridItem label="DISTANCE" value={MOCK_ROUTE.stats.distance} unit="MILES" />
          <View style={styles.statGridDivider} />
          <StatGridItem label="TIME" value={MOCK_ROUTE.stats.time} unit="MINUTES" />
          <View style={styles.statGridDivider} />
          <StatGridItem label="ELEVATION" value={MOCK_ROUTE.stats.elevation} unit="FEET" />
        </View>

        {/* Description */}
        <Text style={styles.description}>{MOCK_ROUTE.description}</Text>

        {/* Route overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Route Overview</Text>
            <TouchableOpacity hitSlop={8}>
              <Text style={styles.viewAll}>VIEW FULL LIST</Text>
            </TouchableOpacity>
          </View>
          {MOCK_ROUTE.segments.map((seg, i) => (
            <View key={i} style={[styles.segmentRow, i < MOCK_ROUTE.segments.length - 1 && styles.segmentBorder]}>
              <View style={[styles.segmentIconWrap, { backgroundColor: seg.status === 'safe' ? colors.safeLight : colors.cautionLight }]}>
                <FontAwesome
                  name={STATUS_ICON[seg.status]}
                  size={18}
                  color={seg.status === 'safe' ? colors.safe : colors.caution}
                />
              </View>
              <View style={styles.segmentText}>
                <Text style={styles.segmentName}>{seg.name}</Text>
                <Text style={styles.segmentDetail}>{seg.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <GhostButton label="Show on map" icon="map" onPress={() => router.push('/map')} />
        <GhostButton label="Try a different route" icon="random" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

function BreakdownItem({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <View style={styles.breakdownItem}>
      <View style={[styles.breakdownDot, { backgroundColor: color }]} />
      <Text style={styles.breakdownLabel}>{label}</Text>
      <Text style={[styles.breakdownValue, { color }]}>{value}</Text>
    </View>
  );
}

function StatGridItem({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={styles.statGridItem}>
      <Text style={styles.statGridLabel}>{label}</Text>
      <Text style={styles.statGridValue}>{value}</Text>
      <Text style={styles.statGridUnit}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.background },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backLabel: {
    ...typography.subheading,
    color: colors.teal,
  },
  scroll:  { flex: 1 },
  content: { padding: spacing.md, paddingTop: spacing.sm, gap: spacing.md, paddingBottom: spacing.lg },

  // Destination card
  destCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  destIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destLabel: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  destAddress: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },

  // Quick stats
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickStatValue: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  quickStatDot: {
    width: 4,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },

  routeLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: -spacing.xs,
  },

  // Sections
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  safetyScore: {
    ...typography.subheading,
    color: colors.teal,
    fontSize: 14,
  },
  viewAll: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
  },

  // Breakdown
  breakdownRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  breakdownItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  breakdownDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
  },
  breakdownLabel: {
    ...typography.label,
    color: colors.textMuted,
    letterSpacing: 0,
    fontSize: 11,
  },
  breakdownValue: {
    ...typography.subheading,
    fontSize: 16,
  },

  // Stat grid
  statGrid: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  statGridItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statGridDivider: {
    width: 1,
    backgroundColor: colors.border,
    alignSelf: 'stretch',
  },
  statGridLabel: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
  },
  statGridValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.teal,
  },
  statGridUnit: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
  },

  // Description
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  // Segments
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  segmentBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  segmentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: { flex: 1 },
  segmentName: {
    ...typography.subheading,
    color: colors.textPrimary,
    fontSize: 14,
  },
  segmentDetail: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },

  // Footer buttons
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
});
