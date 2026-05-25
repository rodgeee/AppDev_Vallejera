/**
 * Theme: auth screens keep brand blue; main app uses retail neutrals + accent.
 */
export const COLORS = {
  primary: '#0033a0',
  primaryHover: '#0047c7',
  primaryDark: '#002878',
  brandLanding: '#0044CC',
  accent: '#0033a0',
  accentSoft: '#002878',
  primaryLight: '#e8eef9',
  success: '#16A34A',
  white: '#fff',
  black: '#000',
  text: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  border: '#e5e7eb',
  borderFocus: '#d1d5db',
  placeholder: '#9CA3AF',
  background: '#ffffff',
  surface: '#f4f4f5',
  cardBackground: '#f4f4f5',
  fieldBg: '#f4f4f5',
  googleBorder: '#d1d5db',
  heroFallback: '#18181b',
  tabInactive: '#a1a1aa',
  errorBg: '#fef2f2',
  errorBorder: '#fca5a5',
  errorText: '#b91c1c',
};

export const TYPO = {
  hero: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  title: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.3 },
  section: { fontSize: 17, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  label: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.6, textTransform: 'uppercase' as const },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
  none: 0,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
};

/** Login / auth screens (matches customer/login.html.twig). */
export const LOGIN = {
  titleSize: 28,
  titleWeight: '800' as const,
  titleLetterSpacing: 1.1,
  subtitleSize: 15,
  labelSize: 15,
  inputSize: 15,
  buttonSize: 13,
  buttonLetterSpacing: 0.8,
  dividerSize: 11,
  hintSize: 12,
  footerSize: 15,
  fieldMaxWidth: 420,
  gutterX: 16,
};
