import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows, Radii } from '../styles/Theme';
import { 
  Bot, 
  Hand, 
  Power, 
  Clock, 
  CloudRain, 
  ShieldCheck, 
  AlertTriangle,
  Sliders,
  Droplet
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function ControlScreen() {
  const { 
    wateringMode, 
    setWateringMode, 
    pumpActive, 
    setPumpActive, 
    sensors,
    settings 
  } = useSmartIrrigation();

  const handleToggleMode = async (mode: 'Auto' | 'Manual') => {
    await setWateringMode(mode);
  };

  const handleTogglePump = async () => {
    await setPumpActive(!pumpActive);
  };

  const getNextWateringForecast = () => {
    if (sensors.rainDetected) {
      return 'Arrosage suspendu (Pluie détectée par capteur)';
    }
    if (sensors.soilHumidity >= (settings?.soilHumidityThreshold || 30)) {
      return 'Sol suffisamment hydraté. Prochaine analyse dans 10 min';
    }
    return 'Irrigation requise immédiatement (Sol sous le seuil)';
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Centre de Commande</Text>
        <Text style={styles.headerSubtitle}>Pilotage automatisé et manuel de l'irrigation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Sélecteur de Mode Segmenté (Pill Switcher) */}
        <View style={styles.modeSwitcherContainer}>
          <TouchableOpacity 
            style={[styles.modeTab, wateringMode === 'Auto' && styles.modeTabActive]}
            onPress={() => handleToggleMode('Auto')}
            activeOpacity={0.8}
          >
            <Bot size={18} color={wateringMode === 'Auto' ? '#FFFFFF' : Colors.textSecondary} />
            <Text style={[styles.modeTabText, wateringMode === 'Auto' && styles.modeTabTextActive]}>
              Mode Automatique (IA)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.modeTab, wateringMode === 'Manual' && styles.modeTabActive]}
            onPress={() => handleToggleMode('Manual')}
            activeOpacity={0.8}
          >
            <Hand size={18} color={wateringMode === 'Manual' ? '#FFFFFF' : Colors.textSecondary} />
            <Text style={[styles.modeTabText, wateringMode === 'Manual' && styles.modeTabTextActive]}>
              Mode Manuel
            </Text>
          </TouchableOpacity>
        </View>

        {/* Grand Cadran Interactif de Commande de Pompe */}
        <View style={styles.controllerCard}>
          <Text style={styles.controllerTitle}>État du Relais d'Arrosage</Text>
          <Text style={styles.controllerSubtitle}>
            {wateringMode === 'Auto' 
              ? 'Le système ajuste la pompe selon la régression IA et la météo'
              : 'Appuyez pour forcer le démarrage ou l\'arrêt de la pompe'}
          </Text>

          {/* Grand Disque Tactile */}
          <View style={styles.dialWrapper}>
            <View style={[styles.outerRing, pumpActive ? styles.outerRingActive : styles.outerRingIdle]}>
              <TouchableOpacity 
                style={[styles.dialButton, pumpActive ? styles.dialButtonActive : styles.dialButtonIdle]}
                onPress={handleTogglePump}
                activeOpacity={0.85}
              >
                <Power size={46} color="#FFFFFF" />
                <Text style={styles.dialStatusText}>{pumpActive ? 'EN MARCHE' : 'À L\'ARRÊT'}</Text>
                <Text style={styles.dialSubText}>
                  {pumpActive ? 'Appuyer pour couper' : 'Appuyer pour activer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pastille de retour d'état */}
          <View style={[styles.statePill, pumpActive ? styles.statePillActive : styles.statePillIdle]}>
            <View style={[styles.stateDot, { backgroundColor: pumpActive ? Colors.mint : Colors.gray }]} />
            <Text style={[styles.statePillText, { color: pumpActive ? Colors.primaryDark : Colors.textSecondary }]}>
              {pumpActive ? 'Électrovanne ouverte • Débit actif' : 'Circuit fermé • Aucune pression d\'eau'}
            </Text>
          </View>
        </View>

        {/* Carte de Décision Intelligente & Prévision */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <View style={[styles.infoIconWrap, { backgroundColor: '#E0F2FE' }]}>
              <Droplet size={20} color={Colors.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoCardTitle}>Analyse d'Irrigation</Text>
              <Text style={styles.infoCardSubtitle}>Consigne basée sur les capteurs</Text>
            </View>
            <View style={styles.shieldBadge}>
              <ShieldCheck size={14} color={Colors.primary} />
              <Text style={styles.shieldText}>Actif</Text>
            </View>
          </View>

          <View style={styles.forecastBox}>
            <Text style={styles.forecastText}>{getNextWateringForecast()}</Text>
          </View>

          {/* Résumé des Seuils de Sécurité */}
          <View style={styles.thresholdsGrid}>
            <View style={styles.thresholdItem}>
              <Text style={styles.thresholdLabel}>Seuil d'humidité</Text>
              <Text style={styles.thresholdValue}>{settings?.soilHumidityThreshold || 30}%</Text>
            </View>
            <View style={styles.thresholdDivider} />
            <View style={styles.thresholdItem}>
              <Text style={styles.thresholdLabel}>Durée max/cycle</Text>
              <Text style={styles.thresholdValue}>{settings?.maxWateringDuration || 15} min</Text>
            </View>
            <View style={styles.thresholdDivider} />
            <View style={styles.thresholdItem}>
              <Text style={styles.thresholdLabel}>Cuve eau</Text>
              <Text style={styles.thresholdValue}>{sensors.tankLevel}%</Text>
            </View>
          </View>
        </View>

        {/* Note de sécurité */}
        <View style={styles.securityNote}>
          <AlertTriangle size={16} color={Colors.warning} style={{ marginRight: 8 }} />
          <Text style={styles.securityNoteText}>
            En cas de pluie détectée par le capteur optique ou le radar météo, le mode automatique interrompt immédiatement tout cycle pour préserver la ressource en eau.
          </Text>
        </View>

        <View style={{ height: 90 }} />
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modeSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F6',
    borderRadius: Radii.full,
    padding: 4,
    marginBottom: 20,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Radii.full,
    gap: 8,
  },
  modeTabActive: {
    backgroundColor: Colors.primary,
    ...Shadows.subtle,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },
  controllerCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    ...Shadows.light,
  },
  controllerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  controllerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
    paddingHorizontal: 10,
    lineHeight: 18,
  },
  dialWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  outerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  outerRingActive: {
    backgroundColor: '#DCFCE7',
    borderWidth: 2,
    borderColor: Colors.mint,
    ...Shadows.glowMint,
  },
  outerRingIdle: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dialButton: {
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  dialButtonActive: {
    backgroundColor: Colors.primary,
  },
  dialButtonIdle: {
    backgroundColor: '#475569',
  },
  dialStatusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: 8,
  },
  dialSubText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  statePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radii.full,
  },
  statePillActive: {
    backgroundColor: '#DCFCE7',
  },
  statePillIdle: {
    backgroundColor: '#F1F5F9',
  },
  stateDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 8,
  },
  statePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    ...Shadows.subtle,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  infoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  infoCardSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  shieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.full,
    gap: 4,
  },
  shieldText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  forecastBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: Radii.md,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.blue,
    marginBottom: 16,
  },
  forecastText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
    lineHeight: 18,
  },
  thresholdsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 12,
  },
  thresholdItem: {
    flex: 1,
    alignItems: 'center',
  },
  thresholdDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  thresholdLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  thresholdValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  securityNote: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderRadius: Radii.md,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  securityNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 17,
    fontWeight: '500',
  },
});
