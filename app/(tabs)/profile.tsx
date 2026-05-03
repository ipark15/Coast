import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PlaceholderCard from '@/src/components/PlaceholderCard';
import StatCard from '@/src/components/StatCard';
import { colors, radius, spacing, typography } from '@/src/tokens';

// TODO(MVP): Load from AsyncStorage once ride recording is implemented
const MOCK_STATS = {
  rides: '12',
  total: '28.4 mi',
  time: '4h 22m',
  safeLanes: '84%',
};

const MOCK_RIDES = [
  { id: '1', name: 'Silver Lake Reservoir', date: 'Apr 28', distance: '2.4 mi', safe: 78 },
  { id: '2', name: 'Griffith Park',         date: 'Apr 24', distance: '5.1 mi', safe: 91 },
  { id: '3', name: 'Echo Park Lake',        date: 'Apr 20', distance: '1.8 mi', safe: 65 },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + identity */}
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <FontAwesome name="user" size={32} color={colors.teal} />
          </View>
          <Text style={styles.profileTitle}>Your profile</Text>
          <Text style={styles.memberSince}>Member since 2024</Text>
        </View>

        {/* 2×2 stats grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard value={MOCK_STATS.rides}     label="Rides"       valueColor={colors.teal} />
            <StatCard value={MOCK_STATS.total}     label="Total"       valueColor={colors.teal} />
          </View>
          <View style={styles.statsRow}>
            <StatCard value={MOCK_STATS.time}      label="Time"        valueColor={colors.teal} />
            <StatCard value={MOCK_STATS.safeLanes} label="Safe Lanes"  valueColor={colors.teal} />
          </View>
        </View>

        {/* Recent rides */}
        <Text style={styles.sectionLabel}>RECENT RIDES</Text>
        <View style={styles.rideList}>
          {MOCK_RIDES.map((ride, index) => (
            <View key={ride.id}>
              <View style={styles.rideRow}>
                <View style={styles.rideIcon}>
                  <FontAwesome name="bicycle" size={18} color={colors.teal} />
                </View>
                <View style={styles.rideMeta}>
                  <Text style={styles.rideName}>{ride.name}</Text>
                  <Text style={styles.rideDetail}>{ride.date} · {ride.distance}</Text>
                </View>
                <Text style={styles.rideSafe}>{ride.safe}% safe</Text>
              </View>
              {index < MOCK_RIDES.length - 1 && <View style={styles.hairline} />}
            </View>
          ))}
        </View>

        <PlaceholderCard message="Ride history and achievements coming soon." />
      </ScrollView>
    </SafeAreaView>
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
    gap: spacing.md,
  },

  // Identity
  identity: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  memberSince: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },

  // Stats grid
  statsGrid: {
    gap: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  // Section label
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
  },

  // Ride list
  rideList: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  rideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  rideIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rideMeta: {
    flex: 1,
  },
  rideName: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  rideDetail: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
  rideSafe: {
    ...typography.subheading,
    color: colors.teal,
    fontSize: 13,
  },
  hairline: {
    height: 1,
    backgroundColor: colors.border,
  },
});
