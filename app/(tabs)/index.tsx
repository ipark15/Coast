import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/src/tokens';

const RECENT_DESTINATIONS = [
  { id: '1', name: 'Silver Lake Reservoir' },
  { id: '2', name: 'Griffith Park' },
  { id: '3', name: 'Echo Park Lake' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

export default function ExploreScreen() {
  const router = useRouter();

  // TODO(MVP): Replace with real search — for now navigates with hardcoded destination
  const handleSearch = () => router.push('/comfort');
  const handleDestination = () => router.push('/comfort');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brand}>
            <FontAwesome name="bullseye" size={22} color={colors.teal} />
            <Text style={styles.brandName}>Bicycle Kitchen</Text>
          </View>
          <TouchableOpacity hitSlop={8}>
            <FontAwesome name="sliders" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.headline}>Where are you{'\n'}heading today?</Text>

        {/* Search card */}
        <TouchableOpacity style={styles.searchCard} onPress={handleSearch} activeOpacity={0.8}>
          <View style={styles.searchRow}>
            <FontAwesome name="search" size={16} color={colors.textMuted} />
            <Text style={styles.searchPlaceholder}>Search destination...</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.locationRow}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText}>From: Your location</Text>
          </View>
        </TouchableOpacity>

        {/* Explore link — non-interactive for MVP */}
        <Text style={styles.exploreLink}>or explore beginner routes →</Text>

        {/* Recent */}
        <Text style={styles.sectionLabel}>RECENT</Text>
        <View style={styles.recentList}>
          {RECENT_DESTINATIONS.map((dest, index) => (
            <View key={dest.id}>
              <TouchableOpacity style={styles.recentRow} onPress={handleDestination} activeOpacity={0.7}>
                <FontAwesome name="map-pin" size={14} color={colors.textMuted} />
                <Text style={styles.recentName}>{dest.name}</Text>
                <FontAwesome name="chevron-right" size={12} color={colors.textMuted} />
              </TouchableOpacity>
              {index < RECENT_DESTINATIONS.length - 1 && <View style={styles.hairline} />}
            </View>
          ))}
        </View>

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
    paddingTop: spacing.sm,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandName: {
    ...typography.subheading,
    color: colors.teal,
  },

  // Greeting
  greeting: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  headline: {
    ...typography.displayLarge,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },

  // Search card
  searchCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  searchPlaceholder: {
    ...typography.body,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.safe,
  },
  locationText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },

  // Explore link
  exploreLink: {
    ...typography.bodySmall,
    color: colors.textTeal,
    marginBottom: spacing.xl,
    marginTop: spacing.xs,
  },

  // Recent
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  recentList: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  recentName: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  hairline: {
    height: 1,
    backgroundColor: colors.border,
  },
});
