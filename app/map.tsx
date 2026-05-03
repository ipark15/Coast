import Mapbox, {
  Camera,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
} from '@rnmapbox/maps';
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import GhostButton from '@/src/components/GhostButton';
import LanePill from '@/src/components/LanePill';
import PrimaryButton from '@/src/components/PrimaryButton';
import RouteListItem from '@/src/components/RouteListItem';
import SafetyBar from '@/src/components/SafetyBar';
import { colors, radius, spacing, typography } from '@/src/tokens';
import { LaneType, laneConfig } from '@/src/utils/laneColor';
import { ROUTE_CENTER, ROUTE_END, ROUTE_GEOJSON } from '@/src/utils/routeConfig';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '');

const MOCK_ROUTE = {
  destination: 'Silver Lake Reservoir',
  address:     '1850 W Silver Lake Dr',
  time:        '18 min',
  distance:    '2.4 MILES',
  description: 'Low traffic & wide bike lanes',
  safePercent: 92,
  safety:      { safe: 78, caution: 15, hard: 7 },
  turns: [
    { type: 'safe'    as LaneType, direction: 'straight' as const, street: 'Fountain Ave',     distance: '0.4 mi' },
    { type: 'safe'    as LaneType, direction: 'right'    as const, street: 'Virgil Ave',       distance: '0.2 mi' },
    { type: 'caution' as LaneType, direction: 'straight' as const, street: 'Sunset Blvd',      distance: '0.3 mi' },
    { type: 'safe'    as LaneType, direction: 'left'     as const, street: 'Silver Lake Blvd', distance: '0.8 mi' },
    { type: 'safe'    as LaneType, direction: 'right'    as const, street: 'Reservoir Dr',     distance: '0.2 mi' },
  ],
};

const SHEET_COLLAPSED = 220;
const SHEET_EXPANDED  = 480;
const DRAG_RANGE      = SHEET_EXPANDED - SHEET_COLLAPSED;

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [learnLane, setLearnLane]   = useState<LaneType | null>(null);

  const positionRef   = useRef(DRAG_RANGE);
  const translateY    = useRef(new Animated.Value(DRAG_RANGE)).current;

  const snapTo = (expand: boolean) => {
    const toValue = expand ? 0 : DRAG_RANGE;
    positionRef.current = toValue;
    setIsExpanded(expand);
    Animated.spring(translateY, { toValue, useNativeDriver: true, tension: 65, friction: 11 }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  (_, { dy }) => Math.abs(dy) > 4,
      onPanResponderGrant:  () => { translateY.stopAnimation(); },
      onPanResponderMove:   (_, { dy }) => {
        translateY.setValue(Math.max(0, Math.min(DRAG_RANGE, positionRef.current + dy)));
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        const landed = Math.max(0, Math.min(DRAG_RANGE, positionRef.current + dy));
        snapTo(vy < -0.3 ? true : vy > 0.3 ? false : landed < DRAG_RANGE / 2);
      },
    })
  ).current;

  return (
    <View style={styles.root}>

      {/* ── Dark green header ── */}
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.headerBtn}>
            <FontAwesome name="arrow-left" size={16} color={colors.surface} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Bicycle Kitchen</Text>
            <Text style={styles.headerSub}>{MOCK_ROUTE.destination.toUpperCase()}</Text>
          </View>
          <TouchableOpacity style={styles.headerIconCircle} hitSlop={8}>
            <FontAwesome name="compass" size={14} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ── Map + overlays ── */}
      <View style={styles.mapArea}>

        {/* Mapbox map */}
        <MapView
          style={StyleSheet.absoluteFill}
          styleURL="mapbox://styles/mapbox/light-v11"
          logoEnabled={false}
          attributionEnabled={false}
          scaleBarEnabled={false}
        >
          <Camera
            centerCoordinate={ROUTE_CENTER}
            zoomLevel={13.5}
            animationMode="none"
          />

          {/* Colored route segments */}
          <ShapeSource id="route" shape={ROUTE_GEOJSON}>
            <LineLayer
              id="routeLine"
              style={{
                lineColor: ['get', 'color'],
                lineWidth: 5,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </ShapeSource>

          {/* Destination pin */}
          <PointAnnotation id="destination" coordinate={ROUTE_END}>
            <View style={styles.destPin}>
              <FontAwesome name="map-marker" size={24} color={colors.teal} />
            </View>
          </PointAnnotation>
        </MapView>

        {/* Destination card overlaid on map */}
        <View style={styles.destCard}>
          <View style={styles.destIconWrap}>
            <FontAwesome name="bicycle" size={18} color={colors.teal} />
          </View>
          <View style={styles.destText}>
            <Text style={styles.destName}>Navigating to Silver Lake</Text>
            <Text style={styles.destAddress}>{MOCK_ROUTE.address}</Text>
          </View>
          <TouchableOpacity style={styles.destNav} hitSlop={8}>
            <FontAwesome name="location-arrow" size={16} color={colors.teal} />
          </TouchableOpacity>
        </View>

        {/* Draggable bottom sheet */}
        <Animated.View
          style={[styles.sheet, { height: SHEET_EXPANDED + insets.bottom, transform: [{ translateY }] }]}
        >
          <View style={styles.dragArea} {...panResponder.panHandlers}>
            <View style={styles.handle} />
          </View>
          <View style={[styles.sheetContent, { paddingBottom: insets.bottom + spacing.sm }]}>
            {isExpanded ? (
              <ExpandedDirections
                turns={MOCK_ROUTE.turns}
                safety={MOCK_ROUTE.safety}
                onCollapse={() => snapTo(false)}
              />
            ) : (
              <CollapsedCard
                route={MOCK_ROUTE}
                onPreview={() => router.push('/preview')}
                onStart={() => router.push('/ride')}
              />
            )}
          </View>
        </Animated.View>
      </View>

      {/* Lane learn overlay */}
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

// ─── Collapsed card ───────────────────────────────────────────────────────────

function CollapsedCard({
  route, onPreview, onStart,
}: {
  route: typeof MOCK_ROUTE;
  onPreview: () => void;
  onStart: () => void;
}) {
  return (
    <>
      <View style={card.titleRow}>
        <View style={card.recommendedBadge}>
          <Text style={card.recommendedText}>RECOMMENDED</Text>
        </View>
        <Text style={card.routeName}>Safest route</Text>
        <Text style={card.time}>{route.time}</Text>
      </View>
      <View style={card.subtitleRow}>
        <Text style={card.description}>{route.description}</Text>
        <Text style={card.distance}>{route.distance}</Text>
      </View>
      <View style={card.profileRow}>
        <Text style={card.profileLabel}>ROUTE SAFETY PROFILE</Text>
        <Text style={card.profilePct}>{route.safePercent}% SAFE</Text>
      </View>
      <SafetyBar safe={route.safety.safe} caution={route.safety.caution} hard={route.safety.hard} />
      <View style={card.buttons}>
        <GhostButton label="Preview" icon="eye" onPress={onPreview} style={card.halfBtn} />
        <PrimaryButton label="Start ride" icon="play" variant="dark" onPress={onStart} style={card.halfBtn} />
      </View>
    </>
  );
}

// ─── Expanded directions ──────────────────────────────────────────────────────

function ExpandedDirections({
  turns, safety, onCollapse,
}: {
  turns: typeof MOCK_ROUTE.turns;
  safety: { safe: number; caution: number; hard: number };
  onCollapse: () => void;
}) {
  return (
    <>
      <View style={card.titleRow}>
        <Text style={card.routeName}>Turn-by-turn</Text>
        <TouchableOpacity onPress={onCollapse} style={card.collapseBtn} hitSlop={8}>
          <Text style={card.collapseText}>Less </Text>
          <FontAwesome name="chevron-down" size={11} color={colors.teal} />
        </TouchableOpacity>
      </View>
      <SafetyBar safe={safety.safe} caution={safety.caution} hard={safety.hard} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: spacing.sm }}>
        {turns.map((turn, i) => (
          <RouteListItem key={i} type={turn.type} direction={turn.direction} street={turn.street} distance={turn.distance} />
        ))}
      </ScrollView>
    </>
  );
}

// ─── Lane learn sheet ─────────────────────────────────────────────────────────

function LaneLearnSheet({ type, insetBottom, onClose }: { type: LaneType; insetBottom: number; onClose: () => void }) {
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
  root:       { flex: 1, backgroundColor: colors.headerDark },
  headerSafe: { backgroundColor: colors.headerDark },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  headerBtn: {
    width: 32, height: 32,
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { ...typography.subheading, color: colors.surface },
  headerSub: {
    ...typography.label,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  headerIconCircle: {
    width: 32, height: 32,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },

  mapArea: { flex: 1, backgroundColor: colors.mapBackground },

  destPin: { alignItems: 'center' },

  destCard: {
    position: 'absolute',
    top: spacing.md, left: spacing.md, right: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  destIconWrap: {
    width: 38, height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.tealLight,
    alignItems: 'center', justifyContent: 'center',
  },
  destText: { flex: 1 },
  destName: { ...typography.subheading, color: colors.textPrimary, fontSize: 14 },
  destAddress: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  destNav: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },

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
  dragArea:    { alignItems: 'center', paddingTop: spacing.sm, paddingBottom: spacing.xs },
  handle:      { width: 44, height: 5, borderRadius: radius.full, backgroundColor: colors.border },
  sheetContent:{ flex: 1, paddingHorizontal: spacing.md },
});

const card = StyleSheet.create({
  titleRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: spacing.sm, marginBottom: spacing.xs,
  },
  recommendedBadge: {
    backgroundColor: colors.tealLight,
    borderRadius: radius.full,
    paddingVertical: 3, paddingHorizontal: spacing.sm,
  },
  recommendedText: { ...typography.label, color: colors.teal, fontSize: 9, letterSpacing: 0.5 },
  routeName:  { ...typography.subheading, color: colors.textPrimary, flex: 1 },
  time:       { ...typography.subheading, color: colors.textPrimary, fontSize: 16 },
  subtitleRow:{
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: spacing.sm,
  },
  description:{ ...typography.bodySmall, color: colors.textMuted, flex: 1 },
  distance:   { ...typography.label, color: colors.textSecondary, fontWeight: '600', fontSize: 11, letterSpacing: 0.3 },
  profileRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 6,
  },
  profileLabel: { ...typography.label, color: colors.textMuted, fontSize: 10 },
  profilePct:   { ...typography.label, color: colors.safe, fontSize: 11, fontWeight: '600' },
  buttons:    { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  halfBtn:    { flex: 1 },
  collapseBtn:{ flexDirection: 'row', alignItems: 'center' },
  collapseText:{ ...typography.label, color: colors.teal, letterSpacing: 0, fontSize: 12 },
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
  tip:         { borderLeftWidth: 3, borderRadius: radius.sm, padding: spacing.sm },
  tipText:     { ...typography.bodySmall, fontStyle: 'italic' },
  close:       { alignItems: 'center', paddingVertical: spacing.sm },
  closeText:   { ...typography.subheading, color: colors.teal },
});
