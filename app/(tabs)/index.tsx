import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/src/tokens';

const RECENT_DESTINATIONS = [
  { id: '1', name: 'Silver Lake Reservoir', address: '1850 W Silver Lake Dr, LA' },
  { id: '2', name: 'Griffith Park',         address: '4730 Crystal Springs Dr, LA' },
  { id: '3', name: 'Echo Park Lake',        address: '751 Echo Park Ave, LA' },
];

const RECOMMENDED = [
  { id: '1', name: 'Los Feliz Boulevard', distance: '4.2 km', time: '12 min', level: 'BEGINNER', levelType: 'safe' as const },
  { id: '2', name: 'Ocean View Loop',     distance: '6.5 km', time: '19 min', level: 'INTER',    levelType: 'caution' as const },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning.';
  if (hour < 17) return 'Good afternoon.';
  return 'Good evening.';
}

const LEVEL_COLORS: Record<'safe' | 'caution', string> = {
  safe:    colors.safe,
  caution: colors.caution,
};

const LEVEL_BG: Record<'safe' | 'caution', string> = {
  safe:    colors.safeLight,
  caution: colors.cautionLight,
};

export default function ExploreScreen() {
  const router = useRouter();

  const handleSearch      = () => router.push('/search' as any);
  const handleDestination = () => router.push('/search' as any);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity hitSlop={8}>
            <FontAwesome name="bars" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.brandName}>Bicycle Kitchen</Text>
          <TouchableOpacity style={styles.avatar} hitSlop={8}>
            <FontAwesome name="user" size={14} color={colors.teal} />
          </TouchableOpacity>
        </View>

        {/* Greeting + headline */}
        <Text style={styles.headline}>
          {getGreeting()}{'\n'}Where are you{'\n'}heading today?
        </Text>

        {/* Search card */}
        <TouchableOpacity style={styles.searchCard} onPress={handleSearch} activeOpacity={0.85}>
          <View style={styles.searchInner}>
            <FontAwesome name="search" size={15} color={colors.textMuted} />
            <Text style={styles.searchPlaceholder}>Search destination</Text>
          </View>
          <View style={styles.goButton}>
            <Text style={styles.goText}>GO</Text>
            <FontAwesome name="arrow-right" size={11} color={colors.surface} />
          </View>
        </TouchableOpacity>

        {/* Explore link */}
        <Text style={styles.exploreLink}>or explore beginner routes</Text>

        {/* Live conditions card */}
        <View style={styles.conditionsCard}>
          <View style={styles.conditionsTop}>
            <View style={styles.conditionsBadge}>
              <View style={styles.conditionsDot} />
              <Text style={styles.conditionsSafe}>98% SAFE</Text>
            </View>
            <Text style={styles.conditionsOption}>Some streets are okay</Text>
            <Text style={styles.conditionsLevel}>Intermediate</Text>
          </View>
          <View style={styles.conditionsBottom}>
            <Text style={styles.conditionsTag}>LIVE CONDITIONS</Text>
            <Text style={styles.conditionsRoute}>Silver Lake Loop</Text>
          </View>
        </View>

        {/* Stats card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <FontAwesome name="bicycle" size={20} color={colors.teal} />
            <View>
              <Text style={styles.statLabel}>TOTAL DISTANCE</Text>
              <Text style={styles.statValue}>12.4 km</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <FontAwesome name="sun-o" size={20} color={colors.caution} />
            <View>
              <Text style={styles.statLabel}>CONDITIONS</Text>
              <Text style={styles.statValue}>74° F</Text>
              <Text style={styles.statSub}>Perfect for a mid-day cruise.</Text>
            </View>
          </View>
        </View>

        {/* Recent */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Recent</Text>
          <TouchableOpacity hitSlop={8}>
            <Text style={styles.clearAll}>CLEAR ALL</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recentList}>
          {RECENT_DESTINATIONS.map((dest, index) => (
            <View key={dest.id}>
              <TouchableOpacity style={styles.recentRow} onPress={handleDestination} activeOpacity={0.7}>
                <View style={styles.recentIconWrap}>
                  <FontAwesome name="map-marker" size={14} color={colors.textMuted} />
                </View>
                <View style={styles.recentText}>
                  <Text style={styles.recentName}>{dest.name}</Text>
                  <Text style={styles.recentAddr}>{dest.address}</Text>
                </View>
                <FontAwesome name="chevron-right" size={12} color={colors.textMuted} />
              </TouchableOpacity>
              {index < RECENT_DESTINATIONS.length - 1 && <View style={styles.hairline} />}
            </View>
          ))}
        </View>

        {/* Recommended */}
        <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>Recommended for You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recHScroll} contentContainerStyle={styles.recHContent}>
          {RECOMMENDED.map((route) => (
            <TouchableOpacity key={route.id} style={styles.recCard} onPress={handleDestination} activeOpacity={0.85}>
              <View style={[styles.recTag, { backgroundColor: LEVEL_BG[route.levelType] }]}>
                <Text style={[styles.recTagText, { color: LEVEL_COLORS[route.levelType] }]}>{route.level}</Text>
              </View>
              {/* TODO(MVP): Replace with actual Mapbox route preview thumbnail */}
              <View style={styles.recMapPlaceholder} />
              <Text style={styles.recName}>{route.name}</Text>
              <View style={styles.recMeta}>
                <FontAwesome name="map-marker" size={10} color={colors.textMuted} />
                <Text style={styles.recMetaText}>{route.distance}</Text>
                <FontAwesome name="clock-o" size={10} color={colors.textMuted} />
                <Text style={styles.recMetaText}>{route.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.background },
  scroll:  { flex: 1 },
  content: { padding: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.xl },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  brandName: {
    ...typography.subheading,
    color: colors.teal,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Greeting
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 36,
    marginBottom: spacing.lg,
  },

  // Search
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: spacing.md,
    paddingRight: 6,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: spacing.sm,
  },
  searchInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  searchPlaceholder: {
    ...typography.body,
    color: colors.textMuted,
  },
  goButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.teal,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: 6,
  },
  goText: {
    ...typography.subheading,
    color: colors.surface,
    fontSize: 13,
  },

  // Explore link
  exploreLink: {
    ...typography.bodySmall,
    color: colors.textTeal,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },

  // Live conditions card
  conditionsCard: {
    backgroundColor: colors.headerDark,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  conditionsTop: {
    gap: 4,
  },
  conditionsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  conditionsDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.safe,
  },
  conditionsSafe: {
    ...typography.label,
    color: colors.safe,
    fontSize: 11,
  },
  conditionsOption: {
    ...typography.subheading,
    color: colors.surface,
  },
  conditionsLevel: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.6)',
  },
  conditionsBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  conditionsTag: {
    ...typography.label,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
  },
  conditionsRoute: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },

  // Stats card
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    alignSelf: 'stretch',
  },
  statLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 2,
  },
  statValue: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  statSub: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  clearAll: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
  },

  // Recent list
  recentList: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  recentIconWrap: {
    width: 28,
    alignItems: 'center',
  },
  recentText: {
    flex: 1,
  },
  recentName: {
    ...typography.body,
    color: colors.textPrimary,
  },
  recentAddr: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  hairline: {
    height: 1,
    backgroundColor: colors.border,
  },

  // Recommended
  recHScroll:   { marginHorizontal: -spacing.md },
  recHContent:  { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.xs },
  recCard: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  recTag: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    borderRadius: radius.full,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    zIndex: 1,
  },
  recTagText: {
    ...typography.label,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  recMapPlaceholder: {
    height: 90,
    backgroundColor: colors.mapPlaceholder,
  },
  recName: {
    ...typography.subheading,
    color: colors.textPrimary,
    fontSize: 13,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  recMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    paddingTop: 4,
  },
  recMetaText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontSize: 11,
  },
});
