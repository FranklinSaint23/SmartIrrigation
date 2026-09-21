import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows, Radii } from '../styles/Theme';
import { 
  Bell, 
  Settings, 
  Thermometer, 
  Droplets, 
  Sprout, 
  Sun, 
  Layers, 
  CloudRain, 
  Power, 
  User,
  Sparkles,
  ArrowRight,
  Wifi,
  Activity
} from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const { sensors, pumpActive, setPumpActive, wateringMode, profile } = useSmartIrrigation();

  const handleTogglePump = async () => {
    await setPumpActive(!pumpActive);
  };

  // Statuts intelligents pour chaque mesure
  const getSoilStatus = (val: number) => {
    if (val < 25) return { label: 'Critique', color: Colors.danger, bg: Colors.dangerLight };
    if (val < 35) return { label: 'Sec', color: Colors.warning, bg: Colors.warningLight };
    return { label: 'Optimal', color: Colors.success, bg: Colors.successLight };
  };

  const getTempStatus = (val: number) => {
    if (val > 32) return { label: 'Chaud', color: Colors.danger, bg: Colors.dangerLight };
    if (val < 18) return { label: 'Frais', color: Colors.blue, bg: Colors.blueLight };
    return { label: 'Tempéré', color: Colors.success, bg: Colors.successLight };
  };

  const soilStatus = getSoilStatus(sensors.soilHumidity);
  const tempStatus = getTempStatus(sensors.temperature);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* En-tête Moderne */}
      <View style={styles.header}>
        <View>
          <View style={styles.onlinePill}>
            <View style={styles.onlineDot} />
            <Wifi size={12} color={Colors.mint} style={{ marginRight: 4 }} />
            <Text style={styles.onlineText}>ESP32 Connecté</Text>
          </View>
          <Text style={styles.greeting}>Bonjour, {profile?.name || 'Agriculteur'} 👋</Text>
          <Text style={styles.subGreeting}>Supervision intelligente de votre parcelle</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconBtn}
            onPress={() => router.push('/notifications' as any)}
            activeOpacity={0.7}
          >
            <Bell size={19} color={Colors.text} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconBtn}
            onPress={() => router.push('/profile' as any)}
            activeOpacity={0.7}
          >
            <User size={19} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconBtn}
            onPress={() => router.push('/settings' as any)}
            activeOpacity={0.7}
          >
            <Settings size={19} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Hero Card : Bannière Prédictive & Météo */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => router.push('/predictions' as any)}
          style={styles.heroCardWrapper}
        >
          <LinearGradient
            colors={[Colors.primaryDark, '#0B4734', '#042C20']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.heroBadge}>
                <Sparkles size={14} color="#34D399" />
                <Text style={styles.heroBadgeText}>IA Prédictive Active</Text>
              </View>
              <View style={styles.heroModePill}>
                <Activity size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.heroModeText}>Mode {wateringMode}</Text>
              </View>
            </View>

            <View style={styles.heroBody}>
              <View>
                <Text style={styles.heroMainValue}>{sensors.soilHumidity}%</Text>
                <Text style={styles.heroMainLabel}>Humidité du sol actuelle</Text>
              </View>
              <View style={styles.heroActionArrow}>
                <Text style={styles.heroActionText}>Voir analyse IA</Text>
                <ArrowRight size={16} color="#34D399" />
              </View>
            </View>

            <View style={styles.heroFooter}>
              <Text style={styles.heroFooterText}>
                {sensors.rainDetected 
                  ? '🌧️ Pluie détectée : arrosage automatique suspendu' 
                  : '🌿 Recommandation : Cycle d\'irrigation sous surveillance continue'}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Titre de section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Télémétrie en temps réel</Text>
          <Text style={styles.sectionSubtitle}>Relevés instantanés des capteurs IoT</Text>
        </View>

        {/* Grille 2x2 des Capteurs */}
        <View style={styles.grid}>
          
          {/* Carte 1: Humidité du sol */}
          <TouchableOpacity 
            style={styles.metricCardTouchable}
            activeOpacity={0.85}
            onPress={() => router.push('/predictions' as any)}
          >
            <View style={styles.metricCard}>
              <View style={styles.metricCardHeader}>
                <View style={[styles.metricIconWrap, { backgroundColor: '#E8F5E9' }]}>
                  <Sprout size={20} color={Colors.primary} />
                </View>
                <View style={[styles.statusChip, { backgroundColor: soilStatus.bg }]}>
                  <Text style={[styles.statusChipText, { color: soilStatus.color }]}>{soilStatus.label}</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>{sensors.soilHumidity} <Text style={styles.metricUnit}>%</Text></Text>
              <Text style={styles.metricLabel}>Humidité Sol</Text>
              <View style={styles.cardFootLink}>
                <Sparkles size={11} color={Colors.mint} style={{ marginRight: 3 }} />
                <Text style={styles.cardFootLinkText}>Modèle IA &gt;</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Carte 2: Température */}
          <View style={styles.metricCardTouchable}>
            <View style={styles.metricCard}>
              <View style={styles.metricCardHeader}>
                <View style={[styles.metricIconWrap, { backgroundColor: '#FEE2E2' }]}>
                  <Thermometer size={20} color="#DC2626" />
                </View>
                <View style={[styles.statusChip, { backgroundColor: tempStatus.bg }]}>
                  <Text style={[styles.statusChipText, { color: tempStatus.color }]}>{tempStatus.label}</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>{sensors.temperature} <Text style={styles.metricUnit}>°C</Text></Text>
              <Text style={styles.metricLabel}>Température</Text>
              <Text style={styles.metricSubInfo}>Air ambiant</Text>
            </View>
          </View>

          {/* Carte 3: Humidité de l'air */}
          <View style={styles.metricCardTouchable}>
            <View style={styles.metricCard}>
              <View style={styles.metricCardHeader}>
                <View style={[styles.metricIconWrap, { backgroundColor: '#E0F2FE' }]}>
                  <Droplets size={20} color={Colors.blue} />
                </View>
                <View style={[styles.statusChip, { backgroundColor: '#E0F2FE' }]}>
                  <Text style={[styles.statusChipText, { color: Colors.blue }]}>Capteur DHT</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>{sensors.airHumidity} <Text style={styles.metricUnit}>%</Text></Text>
              <Text style={styles.metricLabel}>Humidité Air</Text>
              <Text style={styles.metricSubInfo}>Plage nominale</Text>
            </View>
          </View>

          {/* Carte 4: Luminosité */}
          <View style={styles.metricCardTouchable}>
            <View style={styles.metricCard}>
              <View style={styles.metricCardHeader}>
                <View style={[styles.metricIconWrap, { backgroundColor: '#FEF3C7' }]}>
                  <Sun size={20} color="#D97706" />
                </View>
                <View style={[styles.statusChip, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[styles.statusChipText, { color: '#B45309' }]}>Solaire</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>{sensors.light} <Text style={styles.metricUnit}>lux</Text></Text>
              <Text style={styles.metricLabel}>Luminosité</Text>
              <Text style={styles.metricSubInfo}>Capteur optique</Text>
            </View>
          </View>

        </View>

        {/* Niveau de Cuve & Capteur Pluie (Carte Horizontale) */}
        <View style={styles.wideCard}>
          <View style={styles.tankHeader}>
            <View style={styles.tankHeaderLeft}>
              <View style={[styles.metricIconWrap, { backgroundColor: '#E0F2FE' }]}>
                <Layers size={20} color={Colors.blue} />
              </View>
              <View>
                <Text style={styles.wideCardTitle}>Réserve d'eau & Cuve</Text>
                <Text style={styles.wideCardSubtitle}>Capteur ultrasonique</Text>
              </View>
            </View>
            <View style={styles.tankPercentBadge}>
              <Text style={styles.tankPercentText}>{sensors.tankLevel}%</Text>
            </View>
          </View>

          {/* Barre de progression avec dégradé visuel */}
          <View style={styles.progressBarBg}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${Math.min(Math.max(sensors.tankLevel, 5), 100)}%`,
                  backgroundColor: sensors.tankLevel > 30 ? Colors.blue : Colors.warning
                }
              ]} 
            />
          </View>
          
          <View style={styles.tankFooterRow}>
            <Text style={styles.tankFooterText}>Capacité estimée disponible</Text>
            <View style={styles.rainBadge}>
              <CloudRain size={13} color={sensors.rainDetected ? Colors.blue : Colors.gray} />
              <Text style={[styles.rainText, { color: sensors.rainDetected ? Colors.blue : Colors.gray }]}>
                {sensors.rainDetected ? 'Pluie en cours' : 'Ciel dégagé'}
              </Text>
            </View>
          </View>
        </View>

        {/* Grand Widget Commande Rapide Pompe */}
        <View style={[styles.pumpCard, pumpActive ? styles.pumpCardActive : styles.pumpCardIdle]}>
          <View style={styles.pumpCardContent}>
            <View style={styles.pumpInfo}>
              <View style={styles.pumpStatusRow}>
                <View style={[styles.pumpStatusPulse, { backgroundColor: pumpActive ? Colors.mint : Colors.gray }]} />
                <Text style={[styles.pumpStatusText, { color: pumpActive ? Colors.mint : Colors.gray }]}>
                  {pumpActive ? 'ARROSAGE EN COURS' : 'POMPE EN VEILLE'}
                </Text>
              </View>
              <Text style={styles.pumpMainTitle}>Électrovanne Principale</Text>
              <Text style={styles.pumpModeHint}>Mode de commande : {wateringMode === 'Auto' ? 'Automatisé (IA)' : 'Contrôle Manuel'}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.pumpButton, pumpActive ? styles.pumpButtonStop : styles.pumpButtonStart]}
              onPress={handleTogglePump}
              activeOpacity={0.8}
            >
              <Power size={22} color="#FFFFFF" />
              <Text style={styles.pumpButtonText}>{pumpActive ? 'Arrêter' : 'Démarrer'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.mint,
    marginRight: 5,
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  subGreeting: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: Radii.full,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  heroCardWrapper: {
    marginBottom: 22,
    borderRadius: Radii.xl,
    ...Shadows.medium,
  },
  heroGradient: {
    borderRadius: Radii.xl,
    padding: 20,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.full,
    gap: 6,
  },
  heroBadgeText: {
    color: '#E6F4EA',
    fontSize: 12,
    fontWeight: '700',
  },
  heroModePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  heroModeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  heroBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  heroMainValue: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  heroMainLabel: {
    fontSize: 13,
    color: '#A7F3D0',
    fontWeight: '600',
    marginTop: 2,
  },
  heroActionArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.md,
    gap: 6,
  },
  heroActionText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '700',
  },
  heroFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    paddingTop: 12,
  },
  heroFooterText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    marginBottom: 18,
  },
  metricCardTouchable: {
    width: cardWidth,
  },
  metricCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metricSubInfo: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  cardFootLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardFootLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mint,
  },
  wideCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 18,
    ...Shadows.subtle,
  },
  tankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tankHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wideCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  wideCardSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tankPercentBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  tankPercentText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.blue,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  tankFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tankFooterText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  rainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rainText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pumpCard: {
    borderRadius: Radii.xl,
    padding: 18,
    borderWidth: 1.5,
    marginBottom: 20,
    ...Shadows.light,
  },
  pumpCardActive: {
    backgroundColor: '#F0FDF4',
    borderColor: Colors.mint,
  },
  pumpCardIdle: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  pumpCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pumpInfo: {
    flex: 1,
    paddingRight: 10,
  },
  pumpStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pumpStatusPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  pumpStatusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pumpMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  pumpModeHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  pumpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: Radii.full,
    ...Shadows.subtle,
  },
  pumpButtonStart: {
    backgroundColor: Colors.primary,
  },
  pumpButtonStop: {
    backgroundColor: Colors.danger,
  },
  pumpButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
