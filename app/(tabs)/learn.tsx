import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import InfoCard from '@/src/components/InfoCard';
import PlaceholderCard from '@/src/components/PlaceholderCard';
import { colors, spacing, typography } from '@/src/tokens';

const HOURS = [
  { days: 'Tue & Thu', time: '6:00 – 9:00 PM' },
  { days: 'Sat & Sun', time: '12:00 – 5:00 PM' },
];

export default function LearnScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <FontAwesome name="bullseye" size={28} color={colors.teal} />
          </View>
          <Text style={styles.orgName}>Bicycle Kitchen</Text>
          <Text style={styles.orgSub}>Community bike shop · Los Angeles</Text>
        </View>

        {/* Mission */}
        <InfoCard label="Our Mission">
          <Text style={styles.bodyText}>
            The Bicycle Kitchen is a nonprofit bike co-op where community members come to maintain,
            repair, and build bikes. We believe transportation is a right, not a privilege.
          </Text>
        </InfoCard>

        {/* Hours */}
        <InfoCard label="Hours">
          {HOURS.map(({ days, time }) => (
            <View key={days} style={styles.hoursRow}>
              <Text style={styles.hoursDays}>{days}</Text>
              <Text style={styles.hoursTime}>{time}</Text>
            </View>
          ))}
        </InfoCard>

        {/* Location */}
        <InfoCard label="Location">
          <View style={styles.locationRow}>
            <FontAwesome name="map-marker" size={14} color={colors.teal} />
            <Text style={styles.bodyText}>4427 Fountain Ave{'\n'}Los Angeles, CA 90029</Text>
          </View>
        </InfoCard>

        {/* Drop-in repairs */}
        <InfoCard label="Drop-In Repairs">
          <Text style={styles.bodyText}>
            Bring your bike in during open hours. Our volunteers will work alongside you to fix
            it — you do the work, we teach the skills. No experience needed.
          </Text>
        </InfoCard>

        {/* Placeholder */}
        <PlaceholderCard message="More content coming soon — events, classes, and volunteering opportunities." />
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

  // Header
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgName: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  orgSub: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },

  // Card content
  bodyText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  hoursDays: {
    ...typography.body,
    color: colors.textPrimary,
  },
  hoursTime: {
    ...typography.body,
    color: colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
});
