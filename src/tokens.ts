export const colors = {
  // Brand
  teal:          '#0F6E56',
  tealMid:       '#1D9E75',
  tealLight:     '#E8F5F0',

  // Safety spectrum
  safe:          '#1D9E75',
  safeLight:     '#E8F5F0',
  caution:       '#BA7517',
  cautionLight:  '#FEF3E2',
  hard:          '#C0392B',
  hardLight:     '#FDEEEC',

  // Neutrals
  background:    '#EDECEA',
  surface:       '#FFFFFF',
  border:        '#E0DEDB',
  textPrimary:   '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted:     '#9E9E9E',
  textTeal:      '#0F6E56',

  // Navigation
  navActive:     '#0F6E56',
  navInactive:   '#9E9E9E',
};

export const typography = {
  displayLarge:  { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  displayMedium: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  heading:       { fontSize: 18, fontWeight: '700' as const, lineHeight: 24 },
  subheading:    { fontSize: 15, fontWeight: '600' as const, lineHeight: 20 },
  body:          { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall:     { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  label:         { fontSize: 11, fontWeight: '500' as const, lineHeight: 14, letterSpacing: 0.5 },
  statNumber:    { fontSize: 26, fontWeight: '700' as const, lineHeight: 32 },
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 999,
};
