import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackNav from '@/src/components/BackNav';
import ComfortCard from '@/src/components/ComfortCard';
import PrimaryButton from '@/src/components/PrimaryButton';
import { colors, spacing, typography } from '@/src/tokens';

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
    badge: 'Confident rider',
    badgeType: 'hard',
    description: 'All road types are fine. You can hold your own sharing a lane with traffic.',
  },
];

export default function ComfortScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<ComfortLevel>('avoid');

  // TODO(MVP): Pass comfort level + destination to route-summary via params
  const handleFindRoute = () => router.push('/route-summary');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackNav label="Silver Lake Reservoir" onPress={() => router.back()} />

        <Text style={styles.heading}>How comfortable are you{'\n'}with traffic?</Text>
        <Text style={styles.subtext}>Pick the option that feels right for today.</Text>

        <View style={styles.cards}>
          {OPTIONS.map((opt) => (
            <ComfortCard
              key={opt.id}
              title={opt.title}
              badge={opt.badge}
              badgeType={opt.badgeType}
              description={opt.description}
              selected={selected === opt.id}
              onPress={() => setSelected(opt.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Find my route →" onPress={handleFindRoute} />
      </View>
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
    paddingBottom: spacing.lg,
  },
  heading: {
    ...typography.displayMedium,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtext: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  cards: {
    gap: spacing.sm,
  },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
