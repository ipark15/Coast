import Mapbox, {
  Camera,
  LineLayer,
  MapView,
  ShapeSource,
  UserLocation,
  UserTrackingMode,
} from '@rnmapbox/maps';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import PrimaryButton from '@/src/components/PrimaryButton';
import SafetyBar from '@/src/components/SafetyBar';
import { colors, radius, spacing, typography } from '@/src/tokens';
import { LaneType, laneConfig } from '@/src/utils/laneColor';
import { ROUTE_GEOJSON, ROUTE_START } from '@/src/utils/routeConfig';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '');

const MOCK_NAV = {
  distanceToTurn: '200 FT',
  direction:      'right' as const,
  street:         'Fountain Ave',
  laneType:       'safe' as LaneType,
  timeLeft:       '14 min',
  distance:       '3.2 mi',
  arrival:        '10:42 am',
  safePercent:    85,
  safety:         { safe: 85, caution: 10, hard: 5 },
};

const DIRECTION_ICON: Record<string, React.ComponentProps<typeof FontAwesome>['name']> = {
  straight: 'arrow-up',
  left:     'arrow-left',
  right:    'arrow-right',
};

export default function RideScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const cameraRef = useRef<Camera>(null);
  const [locationGranted, setLocationGranted] = useState(false);

  // Request location permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationGranted(status === 'granted');
      if (status !== 'granted') {
        Alert.alert(
          'Location required',
          'Coast needs your location to show your position on the route.',
        );
      }
    })();
  }, []);

  const handleFinish = () =>
    Alert.alert('End ride?', '', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End ride', style: 'destructive', onPress: () => router.dismiss() },
    ]);

  return (
    <View style={styles.root}>

      {/* ── Live Mapbox map ── */}
      <MapView
        style={StyleSheet.absoluteFill}
        styleURL="mapbox://styles/mapbox/light-v11"
        logoEnabled={false}
        attributionEnabled={false}
        scaleBarEnabled={false}
      >
        {/* Camera follows user location in navigation mode */}
        <Camera
          ref={cameraRef}
          followUserLocation={locationGranted}
          followUserMode={UserTrackingMode.FollowWithCourse}
          followZoomLevel={16}
          defaultSettings={{ centerCoordinate: ROUTE_START, zoomLevel: 15 }}
        />

        {/* Colored route line */}
        <ShapeSource id="route" shape={ROUTE_GEOJSON}>
          <LineLayer
            id="routeLine"
            style={{
              lineColor: ['get', 'color'],
              lineWidth: 6,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        </ShapeSource>

        {/* Live user location puck */}
        {locationGranted && (
          <UserLocation
            visible
            animated
          />
        )}
      </MapView>

      {/* ── Top overlays (turn card + lane pill) ── */}
      <SafeAreaView edges={['top']} style={styles.topOverlay} pointerEvents="box-none">

        {/* Turn instruction card */}
        <View style={styles.turnCard}>
          <View style={styles.turnLeft}>
            <Text style={styles.turnDistance}>IN {MOCK_NAV.distanceToTurn}</Text>
            <View style={styles.turnRow}>
              <View style={styles.arrowBox}>
                <FontAwesome name={DIRECTION_ICON[MOCK_NAV.direction]} size={26} color={colors.headerDark} />
              </View>
              <Text style={styles.turnStreet}>Turn right on{'\n'}{MOCK_NAV.street}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.speakerBtn} hitSlop={8}>
            <FontAwesome name="volume-up" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>

        {/* Lane status pill */}
        <View style={styles.laneRow}>
          <View style={styles.lanePill}>
            <View style={styles.laneDot} />
            <Text style={styles.lanePillText}>
              CURRENTLY: {laneConfig[MOCK_NAV.laneType].label.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.laneNext}>Then 1.2 mi</Text>
        </View>

      </SafeAreaView>

      {/* ── Fixed bottom bar ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.sm }]}>

        <View style={styles.safetyRow}>
          <Text style={styles.safetyLabel}>ROUTE SAFETY BREAKDOWN</Text>
          <Text style={styles.safetyPct}>{MOCK_NAV.safePercent}% PROTECTED</Text>
        </View>
        <SafetyBar safe={MOCK_NAV.safety.safe} caution={MOCK_NAV.safety.caution} hard={MOCK_NAV.safety.hard} />

        <View style={styles.statsRow}>
          <StatCol label="TIME LEFT" value={MOCK_NAV.timeLeft} />
          <View style={styles.statDivider} />
          <StatCol label="DISTANCE"  value={MOCK_NAV.distance} />
          <View style={styles.statDivider} />
          <StatCol label="ARRIVAL"   value={MOCK_NAV.arrival} />
        </View>

        <View style={styles.buttons}>
          <PrimaryButton
            label="Finish Ride"
            icon="flag-checkered"
            variant="dark"
            onPress={handleFinish}
            style={styles.finishBtn}
          />
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <FontAwesome name="times" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

function StatCol({ label, value }: { label: string; value: string }) {
  return (
    <View style={stat.col}>
      <Text style={stat.value}>{value}</Text>
      <Text style={stat.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.mapBackground },

  topOverlay: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },

  turnCard: {
    backgroundColor: colors.headerDark,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  turnLeft:     { flex: 1, gap: spacing.sm },
  turnDistance: { ...typography.label, color: 'rgba(255,255,255,0.65)', fontSize: 11, letterSpacing: 0.5 },
  turnRow:      { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  arrowBox: {
    width: 52, height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  turnStreet:  { ...typography.heading, color: colors.surface, flex: 1, lineHeight: 24 },
  speakerBtn:  { marginTop: 4, padding: spacing.xs },

  laneRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  lanePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.safeLight,
    borderRadius: radius.full,
    paddingVertical: 5, paddingHorizontal: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3,
    elevation: 2,
  },
  laneDot:      { width: 7, height: 7, borderRadius: radius.full, backgroundColor: colors.safe },
  lanePillText: { ...typography.label, color: colors.safe, fontSize: 11, letterSpacing: 0.3 },
  laneNext: {
    ...typography.bodySmall, color: colors.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: radius.full,
    paddingVertical: 4, paddingHorizontal: spacing.sm,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  safetyRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  safetyLabel: { ...typography.label, color: colors.textMuted, fontSize: 10 },
  safetyPct:   { ...typography.label, color: colors.safe, fontSize: 11, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  statDivider: { width: 1, backgroundColor: colors.border, alignSelf: 'stretch' },
  buttons:     { flexDirection: 'row', gap: spacing.sm },
  finishBtn:   { flex: 1 },
  closeBtn: {
    width: 52,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.lg,
  },
});

const stat = StyleSheet.create({
  col:   { flex: 1, alignItems: 'center', gap: 4 },
  value: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  label: { ...typography.label, color: colors.textMuted, fontSize: 10, letterSpacing: 0.3 },
});
