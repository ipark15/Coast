import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing, typography } from '@/src/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Suggestion {
  id: string;
  name: string;
  address: string;
  center: [number, number];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RECENTS: Suggestion[] = [
  { id: 'r1', name: 'Silver Lake Reservoir', address: '1850 W Silver Lake Dr, Los Angeles', center: [-118.2556, 34.0882] },
  { id: 'r2', name: 'Griffith Park',          address: '4730 Crystal Springs Dr, Los Angeles', center: [-118.2940, 34.1366] },
  { id: 'r3', name: 'Echo Park Lake',         address: '751 Echo Park Ave, Los Angeles',    center: [-118.2607, 34.0780] },
];

// Bounding box roughly covering greater LA
const LA_BBOX = '-118.9500,33.7000,-117.6462,34.8233';
// Proximity bias: Bicycle Kitchen
const LA_PROXIMITY = '-118.2774,34.0956';

// ─── Mapbox geocoding ─────────────────────────────────────────────────────────

async function geocode(query: string): Promise<Suggestion[]> {
  const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
  if (!token || !query.trim()) return [];

  const url = [
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
    `?access_token=${token}`,
    `&proximity=${LA_PROXIMITY}`,
    `&bbox=${LA_BBOX}`,
    `&country=US`,
    `&types=address,poi,neighborhood,place`,
    `&limit=6`,
    `&language=en`,
  ].join('');

  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();

  return (data.features ?? []).map((f: any) => ({
    id:      f.id,
    name:    f.text ?? f.place_name,
    address: f.place_name,
    center:  f.center,
  }));
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [query, setQuery]           = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading]       = useState(false);

  // Auto-focus input when screen mounts
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  const handleChangeText = useCallback((text: string) => {
    setQuery(text);
    clearTimeout(debounceRef.current);

    if (!text.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const results = await geocode(text);
      setSuggestions(results);
      setLoading(false);
    }, 300);
  }, []);

  const handleSelect = (suggestion: Suggestion) => {
    // TODO(MVP): Pass destination coords + name to comfort screen via params
    router.push('/comfort');
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const showRecents = !query.trim();
  const listData    = showRecents ? RECENTS : suggestions;

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Search bar row ── */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <FontAwesome name="arrow-left" size={17} color={colors.teal} />
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Where are you heading?"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={handleChangeText}
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="never"
        />

        {loading ? (
          <ActivityIndicator size="small" color={colors.teal} style={styles.inputRight} />
        ) : query.length > 0 ? (
          <TouchableOpacity onPress={handleClear} hitSlop={8} style={styles.inputRight}>
            <FontAwesome name="times-circle" size={17} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.divider} />

      {/* ── Section label ── */}
      <Text style={styles.sectionLabel}>
        {showRecents ? 'RECENT' : `${suggestions.length} RESULT${suggestions.length !== 1 ? 'S' : ''}`}
      </Text>

      {/* ── Results list ── */}
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => handleSelect(item)} activeOpacity={0.7}>
            <View style={styles.rowIcon}>
              <FontAwesome
                name={showRecents ? 'clock-o' : 'map-marker'}
                size={15}
                color={colors.teal}
              />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.rowAddress} numberOfLines={1}>{item.address}</Text>
            </View>
            <FontAwesome name="chevron-right" size={12} color={colors.border} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.rowDivider} />}
        ListEmptyComponent={
          !loading && query.trim() ? (
            <View style={styles.empty}>
              <FontAwesome name="search" size={28} color={colors.border} />
              <Text style={styles.emptyText}>No results for "{query}"</Text>
            </View>
          ) : null
        }
      />

    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  inputRight: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  // Section label
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },

  // Result rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 3,
  },
  rowName: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  rowAddress: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 36 + spacing.md,
  },

  // Empty state
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
