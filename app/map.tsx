import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import GhostButton from '@/src/components/GhostButton';
import LanePill from '@/src/components/LanePill';
import PrimaryButton from '@/src/components/PrimaryButton';
import RouteListItem from '@/src/components/RouteListItem';
import SafetyBar from '@/src/components/SafetyBar';
import { colors, radius, spacing, typography } from '@/src/tokens';
import { LaneType, laneConfig } from '@/src/utils/laneColor';

// TODO(MVP): Replace with real route data from Mapbox Directions API
const MOCK_ROUTE = {
  destination: 'Silver Lake Reservoir',
  summary: '2.4 mi · 18 min · Gentle',
  safety: { safe: 78, caution: 15, hard: 7 },
  turns: [
    { type: 'safe'    as LaneType, direction: 'straight' as const, street: 'Fountain Ave',     distance: '0.4 mi' },
    { type: 'safe'    as LaneType, direction: 'right'    as const, street: 'Virgil Ave',       distance: '0.2 mi' },
    { type: 'caution' as LaneType, direction: 'straight' as const, street: 'Sunset Blvd',      distance: '0.3 mi' },
    { type: 'safe'    as LaneType, direction: 'left'     as const, street: 'Silver Lake Blvd', distance: '0.8 mi' },
    { type: 'safe'    as LaneType, direction: 'right'    as const, street: 'Reservoir Dr',     distance: '0.2 mi' },
  ],
};

// Sheet snap positions (excluding bottom inset, added at render time)
const COLLAPSED_HEIGHT = 215;
const EXPANDED_HEIGHT  = 490;
const DRAG_RANGE       = EXPANDED_HEIGHT - COLLAPSED_HEIGHT; // 275

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [learnLane, setLearnLane] = useState<LaneType | null>(null);

  // Refs so PanResponder callbacks never go stale
  const positionRef    = useRef(DRAG_RANGE); // current translateY value
  const isExpandedRef  = useRef(false);
  const translateY     = useRef(new Animated.Value(DRAG_RANGE)).current;

  const snapTo = (expand: boolean) => {
    const toValue = expand ? 0 : DRAG_RANGE;
    positionRef.current   = toValue;
    isExpandedRef.current = expand;
    setIsExpanded(expand);
    Animated.spring(translateY, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  (_, { dy }) => Math.abs(dy) > 4,
      onPanResponderGrant: () => {
        translateY.stopAnimation();
      },
      onPanResponderMove: (_, { dy }) => {
        const next = Math.max(0, Math.min(DRAG_RANGE, positionRef.current + dy));
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        const landed = Math.max(0, Math.min(DRAG_RANGE, positionRef.current + dy));
        const goingUp   = vy < -0.3;
        const goingDown = vy >  0.3;
        const expand    = goingDown ? false : goingUp ? true : landed < DRAG_RANGE / 2;
        snapTo(expand);
      },
    })
  ).current;

  const sheetHeight = EXPANDED_HEIGHT + insets.bottom;

  return (
    <View style={styles.container}>

      {/* ── Map layer ── */}
      <View style={StyleSheet.absoluteFill}>
        <MapPlaceholder onTapLearn={() => setLearnLane('caution')} />
      </View>

      {/* ── Top bar ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <FontAwesome name="arrow-left" size={18} color={colors.surface} />
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.topBarSub}>Navigating to</Text>
          <Text style={styles.topBarTitle}>{MOCK_ROUTE.destination}</Text>
        </View>
        <LegendPill />
      </View>

      {/* ── Bottom sheet ── */}
      <Animated.View
        style={[
          styles.sheet,
          { height: sheetHeight, transform: [{ translateY }] },
        ]}
      >
        {/* Drag zone — only this area has pan handlers */}
        <View style={styles.dragArea} {...panResponder.panHandlers}>
          <View style={styles.handle} />
        </View>

        {/* Sheet content */}
        <View style={[styles.sheetContent, { paddingBottom: insets.bottom + spacing.sm }]}>
          {isExpanded ? (
            <ExpandedDirections
              turns={MOCK_ROUTE.turns}
              safety={MOCK_ROUTE.safety}
              summary={MOCK_ROUTE.summary}
              onCollapse={() => snapTo(false)}
            />
          ) : (
            <CollapsedSheet
              summary={MOCK_ROUTE.summary}
              safety={MOCK_ROUTE.safety}
              onExpand={() => snapTo(true)}
              onPreview={() => router.push('/preview')}
              onStart={() => router.push('/ride')}
            />
          )}
        </View>
      </Animated.View>

      {/* ── Lane learn overlay ── */}
      {learnLane && (
        <LaneLearnSheet
          type={learnLane}
          insetBottom={insets.bottom}
          onClose={() => setLearnLane(null)}
        />
      )}

    </View>
  );
}

// ─── Map placeholder ─────────────────────────────────────────────────────────

function MapPlaceholder({ onTapLearn }: { onTapLearn: () => void }) {
  return (
    <View style={map.container}>
      {/* TODO(MVP): Replace with Mapbox MapView + colored route LineLayer */}
      <Text style={map.label}>Map preview</Text>
      <Text style={map.sub}>Mapbox renders here once API key is added</Text>
      <View style={map.routeTrack}>
        <View style={[map.segment, { flex: 78, backgroundColor: colors.safe }]} />
        <View style={[map.segment, { flex: 15, backgroundColor: colors.caution }]} />
        <View style={[map.segment, { flex: 7,  backgroundColor: colors.hard }]} />
      </View>
      <TouchableOpacity style={map.tooltip} onPress={onTapLearn} activeOpacity={0.8}>
        <View style={map.tooltipDot} />
        <Text style={map.tooltipText}>Tap to learn</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Legend pill ─────────────────────────────────────────────────────────────

function LegendPill() {
  const LABELS: Record<LaneType, string> = { safe: 'Safe', caution: 'Caution', hard: 'Hard' };
  return (
    <View style={legend.pill}>
      {(['safe', 'caution', 'hard'] as LaneType[]).map((type) => (
        <View key={type} style={legend.item}>
          <View style={[legend.dot, { backgroundColor: laneConfig[type].color }]} />
          <Text style={legend.label}>{LABELS[type]}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Collapsed sheet content ──────────────────────────────────────────────────

function CollapsedSheet({
  summary, safety, onExpand, onPreview, onStart,
}: {
  summary: string;
  safety: { safe: number; caution: number; hard: number };
  onExpand: () => void;
  onPreview: () => void;
  onStart: () => void;
}) {
  return (
    <>
      <View style={sheet.titleRow}>
        <View>
          <Text style={sheet.routeTitle}>Safest route</Text>
          <Text style={sheet.summary}>{summary}</Text>
        </View>
        <TouchableOpacity onPress={onExpand} style={sheet.directionsToggle} hitSlop={8}>
          <Text style={sheet.directionsLabel}>Directions </Text>
          <FontAwesome name="chevron-up" size={11} color={colors.teal} />
        </TouchableOpacity>
      </View>
      <View style={sheet.bar}>
        <SafetyBar safe={safety.safe} caution={safety.caution} hard={safety.hard} />
      </View>
      <View style={sheet.buttons}>
        <View style={sheet.buttonHalf}>
          <GhostButton label="Preview ride" onPress={onPreview} />
        </View>
        <View style={sheet.buttonHalf}>
          <PrimaryButton label="Start ride →" onPress={onStart} />
        </View>
      </View>
    </>
  );
}

// ─── Expanded directions content ─────────────────────────────────────────────

function ExpandedDirections({
  turns, safety, summary, onCollapse,
}: {
  turns: typeof MOCK_ROUTE.turns;
  safety: { safe: number; caution: number; hard: number };
  summary: string;
  onCollapse: () => void;
}) {
  return (
    <>
      <View style={sheet.titleRow}>
        <View>
          <Text style={sheet.routeTitle}>Safest route</Text>
          <Text style={sheet.summary}>{summary}</Text>
        </View>
        <TouchableOpacity onPress={onCollapse} style={sheet.directionsToggle} hitSlop={8}>
          <Text style={sheet.directionsLabel}>Less </Text>
          <FontAwesome name="chevron-down" size={11} color={colors.teal} />
        </TouchableOpacity>
      </View>
      <View style={sheet.bar}>
        <SafetyBar safe={safety.safe} caution={safety.caution} hard={safety.hard} />
      </View>
      <Text style={sheet.turnLabel}>TURN-BY-TURN</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {turns.map((turn, i) => (
          <RouteListItem
            key={i}
            type={turn.type}
            direction={turn.direction}
            street={turn.street}
            distance={turn.distance}
          />
        ))}
      </ScrollView>
    </>
  );
}

// ─── Lane learn sheet ────────────────────────────────────────────────────────

function LaneLearnSheet({
  type, insetBottom, onClose,
}: {
  type: LaneType;
  insetBottom: number;
  onClose: () => void;
}) {
  const config = laneConfig[type];
  return (
    <>
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
      <View style={[learn.sheet, { paddingBottom: insetBottom + spacing.md }]}>
        <View style={styles.handle} />
        <LanePill type={type} />
        <Text style={learn.description}>{config.description}</Text>
        {config.tip && (
          <View style={[learn.tip, { backgroundColor: config.lightBg, borderLeftColor: config.color }]}>
            <Text style={[learn.tipText, { color: config.color }]}>{config.tip}</Text>
          </View>
        )}
        <TouchableOpacity onPress={onClose} style={learn.close}>
          <Text style={learn.closeText}>Got it</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    backgroundColor: colors.teal,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  topBarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  topBarSub: {
    ...typography.label,
    color: 'rgba(255,255,255,0.7)',
  },
  topBarTitle: {
    ...typography.subheading,
    color: colors.surface,
  },
  // Sheet wrapper (Animated.View)
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  // Drag-sensitive zone at the top of the sheet
  dragArea: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    marginBottom: spacing.xs,
  },
  // Scrollable content below drag zone
  sheetContent: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
});

const map = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E4D8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  label:   { ...typography.subheading, color: colors.textMuted },
  sub:     { ...typography.bodySmall, color: colors.textMuted, textAlign: 'center', paddingHorizontal: spacing.xl },
  routeTrack: {
    flexDirection: 'row',
    height: 6,
    width: '70%',
    borderRadius: radius.full,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  segment: { height: '100%' },
  tooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cautionLight,
    borderRadius: radius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    gap: 4,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.caution,
  },
  tooltipDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.caution,
  },
  tooltipText: {
    ...typography.label,
    color: colors.caution,
    letterSpacing: 0,
    fontSize: 12,
  },
});

const legend = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.full,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  item:  { flexDirection: 'row', alignItems: 'center', gap: 3 },
  dot:   { width: 6, height: 6, borderRadius: radius.full },
  label: { ...typography.label, color: colors.surface, fontSize: 10, letterSpacing: 0 },
});

const sheet = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  routeTitle:      { ...typography.subheading, color: colors.textPrimary },
  summary:         { ...typography.bodySmall, color: colors.textMuted },
  directionsToggle:{ flexDirection: 'row', alignItems: 'center' },
  directionsLabel: { ...typography.label, color: colors.teal, letterSpacing: 0, fontSize: 12 },
  bar:             { marginVertical: spacing.sm },
  buttons:         { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  buttonHalf:      { flex: 1 },
  turnLabel:       { ...typography.label, color: colors.textMuted, marginBottom: spacing.xs, marginTop: spacing.sm },
});

const learn = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  description: { ...typography.body, color: colors.textSecondary },
  tip: {
    borderLeftWidth: 3,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  tipText:   { ...typography.bodySmall, fontStyle: 'italic' },
  close:     { alignItems: 'center', paddingVertical: spacing.sm },
  closeText: { ...typography.subheading, color: colors.teal },
});
