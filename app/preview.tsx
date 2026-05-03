import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LanePill from '@/src/components/LanePill';
import PrimaryButton from '@/src/components/PrimaryButton';
import { colors, radius, spacing, typography } from '@/src/tokens';
import { LaneType, laneConfig } from '@/src/utils/laneColor';

// Each stop represents a point along the route the scrubber can land on
const STOPS: { position: number; type: LaneType; label: string; distance: string }[] = [
  { position: 0,    type: 'safe',    label: 'Start',             distance: '' },
  { position: 0.35, type: 'safe',    label: 'Virgil Ave',        distance: '0.6 mi' },
  { position: 0.52, type: 'caution', label: 'Sunset Blvd',       distance: '0.3 mi' },
  { position: 0.75, type: 'safe',    label: 'Silver Lake Blvd',  distance: '0.8 mi' },
  { position: 1,    type: 'safe',    label: 'Silver Lake',       distance: '' },
];

export default function PreviewScreen() {
  const router = useRouter();
  const [stopIndex, setStopIndex] = useState(2); // start at the caution section

  const current = STOPS[stopIndex];
  const config = laneConfig[current.type];

  const skipBack = () => setStopIndex((i) => Math.max(0, i - 1));
  const skipForward = () => setStopIndex((i) => Math.min(STOPS.length - 1, i + 1));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.container}>

        {/* ── Back row ── */}
        <TouchableOpacity style={styles.backRow} onPress={() => router.back()} hitSlop={12} activeOpacity={0.7}>
          <FontAwesome name="arrow-left" size={18} color={colors.teal} />
        </TouchableOpacity>

        {/* ── Image area (top ~55%) ── */}
        <View style={styles.imageArea}>
          {/* TODO(MVP): Replace with Google Street View WebView or Mapbox 3D */}
          <View style={styles.imagePlaceholder}>
            <FontAwesome name="street-view" size={40} color={colors.textMuted} />
            <Text style={styles.imagePlaceholderText}>Street View loads here</Text>
            <Text style={styles.imagePlaceholderSub}>Google Maps API key required</Text>
          </View>

          {/* Top-left overlay */}
          <View style={styles.imageTopBar}>
            <Text style={styles.previewLabel}>Preview your ride</Text>
          </View>

          {/* Progress pill — bottom right */}
          <View style={styles.progressPill}>
            <Text style={styles.progressText}>
              {Math.round(current.position * 100)}% along route
            </Text>
          </View>
        </View>

        {/* ── Bottom sheet (~45%) ── */}
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Lane status */}
          <LanePill
            type={current.type}
            distance={current.distance || undefined}
            variant="outlined"
          />

          {/* Warning block — only for caution/hard */}
          {config.tip && (
            <View style={[styles.warning, { backgroundColor: config.lightBg, borderLeftColor: config.color }]}>
              <Text style={[styles.warningText, { color: config.color }]}>{config.tip}</Text>
            </View>
          )}

          {/* Scrubber */}
          <Scrubber stops={STOPS} activeIndex={stopIndex} onSeek={setStopIndex} />

          {/* Playback controls */}
          <View style={styles.controls}>
            <TouchableOpacity onPress={skipBack} hitSlop={12} disabled={stopIndex === 0}>
              <FontAwesome
                name="step-backward"
                size={22}
                color={stopIndex === 0 ? colors.border : colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.playButton} onPress={skipForward} activeOpacity={0.85}>
              <FontAwesome name="play" size={20} color={colors.surface} />
            </TouchableOpacity>

            <TouchableOpacity onPress={skipForward} hitSlop={12} disabled={stopIndex === STOPS.length - 1}>
              <FontAwesome
                name="step-forward"
                size={22}
                color={stopIndex === STOPS.length - 1 ? colors.border : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <PrimaryButton label="I'm ready — start ride →" onPress={() => router.push('/ride')} />
        </View>

      </View>
    </SafeAreaView>
  );
}

// ─── Scrubber ────────────────────────────────────────────────────────────────

function Scrubber({
  stops,
  activeIndex,
  onSeek,
}: {
  stops: typeof STOPS;
  activeIndex: number;
  onSeek: (index: number) => void;
}) {
  const current = stops[activeIndex];

  return (
    <View style={scrubber.container}>
      {/* Colored track */}
      <View style={scrubber.track}>
        <View style={[scrubber.segment, { flex: 78, backgroundColor: colors.safe }]} />
        <View style={[scrubber.segment, { flex: 15, backgroundColor: colors.caution }]} />
        <View style={[scrubber.segment, { flex: 7,  backgroundColor: colors.hard }]} />

        {/* Thumb — positioned proportionally along track */}
        <View style={[scrubber.thumb, { left: `${current.position * 100}%` as any }]} />
      </View>

      {/* Stop labels — tap to seek */}
      <View style={scrubber.labels}>
        {stops
          .filter((s) => s.label)
          .map((stop) => (
            <TouchableOpacity
              key={stop.label}
              onPress={() => onSeek(stops.indexOf(stop))}
              style={[scrubber.labelItem, { left: `${stop.position * 100}%` as any }]}
            >
              <Text
                style={[
                  scrubber.labelText,
                  stops.indexOf(stop) === activeIndex && scrubber.labelActive,
                ]}
              >
                {stop.label}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  backRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    alignSelf: 'flex-start',
  },

  // Image area
  imageArea: {
    flex: 55,
    backgroundColor: colors.previewSurface,
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  imagePlaceholderText: {
    ...typography.subheading,
    color: colors.textMuted,
  },
  imagePlaceholderSub: {
    ...typography.bodySmall,
    color: colors.textMuted,
    opacity: 0.6,
  },
  imageTopBar: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewLabel: {
    ...typography.label,
    color: colors.surface,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressPill: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: radius.full,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  progressText: {
    ...typography.label,
    color: colors.surface,
    letterSpacing: 0,
    fontSize: 11,
  },

  // Sheet
  sheet: {
    flex: 45,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    alignSelf: 'center',
  },
  warning: {
    borderLeftWidth: 3,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  warningText: {
    ...typography.bodySmall,
    fontStyle: 'italic',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3, // optical center for play triangle
  },
});

const scrubber = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  track: {
    flexDirection: 'row',
    height: 6,
    borderRadius: radius.full,
    overflow: 'visible',
    position: 'relative',
  },
  segment: {
    height: '100%',
  },
  thumb: {
    position: 'absolute',
    top: -5,
    width: 16,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 2.5,
    borderColor: colors.teal,
    marginLeft: -8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  labels: {
    flexDirection: 'row',
    position: 'relative',
    height: 20,
    marginTop: spacing.xs,
  },
  labelItem: {
    position: 'absolute',
    transform: [{ translateX: -30 }],
    width: 60,
    alignItems: 'center',
  },
  labelText: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 0,
  },
  labelActive: {
    color: colors.teal,
    fontWeight: '600',
  },
});
