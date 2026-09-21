const brandEmerald = '#065F46';
const brandMint = '#10B981';
const brandEmeraldLight = '#E6F4EA';
const textSlate = '#0F172A';
const textSlateMuted = '#64748B';

export default {
  light: {
    text: textSlate,
    textSecondary: textSlateMuted,
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    border: '#E2E8F0',
    tint: brandEmerald,
    tabIconDefault: '#94A3B8',
    tabIconSelected: brandEmerald,
    brand: brandEmerald,
    brandMint: brandMint,
    brandLight: brandEmeraldLight,
    danger: '#E11D48',
    dangerLight: '#FFE4E6',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    success: '#059669',
    successLight: '#D1FAE5',
    info: '#0284C7',
    infoLight: '#E0F2FE',
    gray: '#64748B',
    grayLight: '#F1F5F9',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    background: '#0B1310',
    cardBackground: '#131F1A',
    border: '#1E322A',
    tint: brandMint,
    tabIconDefault: '#64748B',
    tabIconSelected: brandMint,
    brand: brandMint,
    brandMint: brandMint,
    brandLight: '#162F24',
    danger: '#F43F5E',
    dangerLight: '#3B1822',
    warning: '#FBBF24',
    warningLight: '#3D2F12',
    success: '#10B981',
    successLight: '#133528',
    info: '#38BDF8',
    infoLight: '#102E44',
    gray: '#94A3B8',
    grayLight: '#1E293B',
  },
};
export type ColorsType = typeof import('./Colors').default;
