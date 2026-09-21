const brandGreen = '#0d7a3a';
const brandGreenLight = '#eaf4ee';
const textLight = '#2c3e50';
const textDark = '#f8f9fa';

export default {
  light: {
    text: textLight,
    background: '#f8faf9',
    cardBackground: '#ffffff',
    border: '#e8ece9',
    tint: brandGreen,
    tabIconDefault: '#95a5a6',
    tabIconSelected: brandGreen,
    brand: brandGreen,
    brandLight: brandGreenLight,
    danger: '#d32f2f',
    dangerLight: '#ffebee',
    warning: '#f39c12',
    warningLight: '#fef5e7',
    success: '#2ecc71',
    successLight: '#eafaf1',
    info: '#3498db',
    infoLight: '#ebf5fb',
    gray: '#7f8c8d',
    grayLight: '#f2f4f4',
  },
  dark: {
    text: textDark,
    background: '#121814',
    cardBackground: '#1b241e',
    border: '#2a362e',
    tint: '#2ecc71',
    tabIconDefault: '#7f8c8d',
    tabIconSelected: '#2ecc71',
    brand: '#2ecc71',
    brandLight: '#1b2f23',
    danger: '#e74c3c',
    dangerLight: '#3a2321',
    warning: '#f1c40f',
    warningLight: '#3a341b',
    success: '#2ecc71',
    successLight: '#1b3a24',
    info: '#3498db',
    infoLight: '#1b2c3a',
    gray: '#95a5a6',
    grayLight: '#2c3e50',
  },
};
export type ColorsType = typeof import('./Colors').default;
