export const Colors = {
  // Verts d'exception AgTech (Emerald & Mint)
  primary: '#065F46',         // Vert Forêt Émeraude profond (luxueux & institutionnel)
  primaryDark: '#064E3B',     // Émeraude sombre
  primaryLight: '#E6F4EA',    // Voile menthe translucide
  mint: '#10B981',            // Menthe vibrante (indicateurs actifs, accents vivants)
  mintLight: '#D1FAE5',       // Fond menthe douce
  accent: '#34D399',          // Vert sauge lumineux
  
  // Eaux & Fluides (Sky & Azure)
  blue: '#0284C7',            // Bleu ciel dynamique (cuves, humidité, arrosage)
  blueLight: '#E0F2FE',       // Bleu très doux
  blueDark: '#0369A1',        // Bleu océan profond

  // Neutres & Surfaces modernes
  background: '#F8FAFC',      // Fond général Slate 50 ultra-épuré
  surface: '#FFFFFF',         // Fond des cartes et conteneurs
  surfaceCard: '#FFFFFF',
  border: '#E2E8F0',          // Bordures fines Slate 200
  borderLight: '#F1F5F9',     // Séparateurs discrets Slate 100

  // Typographies Slate haute lisibilité
  text: '#0F172A',            // Titres et données majeures (Slate 900)
  textSecondary: '#475569',   // Sous-titres et labels (Slate 600)
  textMuted: '#94A3B8',       // Textes d'aide et dates (Slate 400)
  gray: '#64748B',            // Gris moyen équilibré
  grayLight: '#E2E8F0',       // Gris clair pour lignes
  grayBg: '#F1F5F9',          // Gris très clair pour puces
  white: '#FFFFFF',

  // Alertes & Statuts raffinés
  danger: '#E11D48',          // Rose corail vif (pompe arrêtée, panne, erreur)
  dangerLight: '#FFE4E6',     // Fond rose poudré
  dangerDark: '#9F1239',

  warning: '#D97706',         // Ambre soutenu (niveaux bas, attention)
  warningLight: '#FEF3C7',    // Fond ambre chaud
  
  success: '#059669',         // Vert succès / Pompe active
  successLight: '#D1FAE5',    // Fond succès mentholé

  info: '#0284C7',            // Bleu informationnel
  infoLight: '#E0F2FE',

  sun: '#F59E0B',             // Ambre solaire pour capteur lumière
  sunLight: '#FEF3C7',
  
  soil: '#854D0E',            // Brun terreux élégant
  soilLight: '#FEF9C3',
};

export const Radii = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  full: 9999,
};

export const Shadows = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  light: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  glowMint: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  glowDanger: {
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
};
