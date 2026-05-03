import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ComfortCard from '@/src/components/ComfortCard';
import PrimaryButton from '@/src/components/PrimaryButton';
import SafetyBar from '@/src/components/SafetyBar';
import { colors, radius, spacing, typography } from '@/src/tokens';

type ComfortLevel = 'avoid' | 'some' | 'comfortable';

const OPTIONS: {
  id: ComfortLevel;
  title: string;
  badge: string;
  badgeType: 'safe' | 'caution' | 'hard';
  description: string;
}[] = [
  {
    id: 'avoid',
    title: 'Avoid it entirely',
    badge: 'Beginner-friendly',
    badgeType: 'safe',
    description: 'Stick to protected bike lanes and paths only. No painted lines or shared lanes.',
  },
  {
    id: 'some',
    title: 'Some streets are okay',
    badge: 'Intermediate',
    badgeType: 'caution',
    description: 'Protected lanes where possible, painted lanes when needed. A good middle ground.',
  },
  {
    id: 'comfortable',
    title: "I'm comfortable anywhere",
    badge: 'Confident Rider',
    badgeType: 'hard',
    description: 'All road types are fine. You can hold your own sharing a lane with traffic.',
  },
];

// TODO(MVP): These preview numbers should come from real route data
const SAFETY_PREVIEW = { safe: 82, caution: 12, hard: 6 };

export default function ComfortScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<ComfortLevel>('avoid');

  // TODO(MVP): Pass comfort level + destination to route-summary via params
  const handleFindRoute = () => router.push('/route-summary');

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
        {/* Step indicator */}
        <View style={styles.stepWrap}>
          <View style={styles.stepPill}>
            <Text style={styles.stepText}>STEP 2 OF 3</Text>
          </View>
        </View>

        <Text style={styles.heading}>How comfortable are{'\n'}you with traffic?</Text>
        <Text style={styles.subtext}>Pick the option that feels right for today.</Text>

        <View style={styles.cards}>
          {OPTIONS.map((opt) => (
            <ComfortCard
              key={opt.id}
              id={opt.id}
              title={opt.title}
              badge={opt.badge}
              badgeType={opt.badgeType}
              description={opt.description}
              selected={selected === opt.id}
              onPress={() => setSelected(opt.id)}
            />
          ))}
        </View>

        {/* Route safety preview */}
        <View style={styles.preview}>
          {/* TODO(MVP): Replace with real Mapbox map thumbnail */}
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapLabel}>Your location → Silver Lake</Text>
          </View>
          <View style={styles.previewBar}>
            <SafetyBar safe={SAFETY_PREVIEW.safe} caution={SAFETY_PREVIEW.caution} hard={SAFETY_PREVIEW.hard} />
          </View>
          <View style={styles.previewMeta}>
            <Text style={styles.previewMetaLabel}>ROUTE SAFETY PREVIEW</Text>
            <Text style={styles.previewMetaValue}>Safe Corridors Active</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Find my route →" onPress={handleFindRoute} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: colors.background },
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
  scroll: { flex: 1 },
  content: {
    padding: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },

  stepWrap: { alignItems: 'center' },
  stepPill: {
    backgroundColor: colors.tealLight,
    borderRadius: radius.full,
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
  },
  stepText: {
    ...typography.label,
    color: colors.teal,
    fontSize: 11,
  },

  heading: {
    ...typography.displayMedium,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 30,
  },
  subtext: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },

  cards: { gap: spacing.sm },

  // Route preview section
  preview: {
    backgroundColor: colors.headerDark,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.headerDark,
  },
  mapLabel: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.5)',
  },
  previewBar: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  previewMeta: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  previewMetaLabel: {
    ...typography.label,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
  },
  previewMetaValue: {
    ...typography.subheading,
    color: colors.surface,
    fontSize: 14,
  },

  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
