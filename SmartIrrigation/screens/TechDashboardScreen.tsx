import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows, Radii } from '../styles/Theme';
import { 
  Bell, 
  User, 
  Settings, 
  ClipboardList, 
  Play, 
  CheckSquare, 
  Cpu, 
  ArrowRight,
  Clock,
  Sprout,
  LogOut,
  Wrench
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function TechDashboardScreen() {
  const router = useRouter();
  const { profile, interventions, logout } = useSmartIrrigation();

  const handleLogoutPress = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
      if (confirmed) {
        await logout();
        router.replace('/login' as any);
      }
      return;
    }

    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login' as any);
          }
        }
      ]
    );
  };

  const techInterventions = interventions.filter(item => item.status !== 'Résolue' && item.status !== 'Annulée');
  const finishedCount = interventions.filter(item => item.status === 'Résolue').length;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.techBadge}>
            <Wrench size={12} color={Colors.blue} />
            <Text style={styles.techBadgeText}>ESPACE TECHNICIEN</Text>
          </View>
          <Text style={styles.greeting}>Bonjour, {profile?.name || 'Technicien'} 👋</Text>
          <Text style={styles.subGreeting}>Maintenance et dépannage sur site</Text>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/notifications' as any)}
            activeOpacity={0.7}
          >
            <Bell size={18} color={Colors.text} />
            <View style={styles.dot} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/profile' as any)}
            activeOpacity={0.7}
          >
            <User size={18} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/settings' as any)}
            activeOpacity={0.7}
          >
            <Settings size={18} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: '#FEE2E2' }]}
            onPress={handleLogoutPress}
            activeOpacity={0.7}
          >
            <LogOut size={18} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Titre Métriques */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>État des Interventions</Text>
          <Text style={styles.sectionSubtitle}>Vos missions actives et historique</Text>
        </View>

        {/* Grille 2x2 des Métriques Tech */}
        <View style={styles.grid}>
          
          <View style={{ width: cardWidth }}>
            <View style={styles.kpiCard}>
              <View style={[styles.iconWrap, { backgroundColor: '#E0F2FE' }]}>
                <ClipboardList size={20} color={Colors.blue} />
              </View>
              <Text style={styles.kpiValue}>{techInterventions.length + finishedCount}</Text>
              <Text style={styles.kpiLabel}>Total assignées</Text>
            </View>
          </View>

          <View style={{ width: cardWidth }}>
            <View style={styles.kpiCard}>
              <View style={[styles.iconWrap, { backgroundColor: '#FEF3C7' }]}>
                <Play size={20} color="#D97706" />
              </View>
              <Text style={styles.kpiValue}>{techInterventions.filter(item => item.status === 'En cours').length}</Text>
              <Text style={styles.kpiLabel}>En cours</Text>
            </View>
          </View>

          <View style={{ width: cardWidth }}>
            <View style={styles.kpiCard}>
              <View style={[styles.iconWrap, { backgroundColor: '#E8F5E9' }]}>
                <CheckSquare size={20} color={Colors.primary} />
              </View>
              <Text style={styles.kpiValue}>{finishedCount}</Text>
              <Text style={styles.kpiLabel}>Résolues</Text>
            </View>
          </View>

          <View style={{ width: cardWidth }}>
            <View style={styles.kpiCard}>
              <View style={[styles.iconWrap, { backgroundColor: '#F0FDFA' }]}>
                <Cpu size={20} color="#0D9488" />
              </View>
              <Text style={styles.kpiValue}>{finishedCount + 1}</Text>
              <Text style={styles.kpiLabel}>ESP32 diagnostiqués</Text>
            </View>
          </View>

        </View>

        {/* Bouton Toutes les interventions */}
        <TouchableOpacity 
          style={styles.intervsBtn}
          onPress={() => router.push('/tech-interventions' as any)}
          activeOpacity={0.85}
        >
          <ClipboardList size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.intervsBtnText}>Consulter la liste de mes interventions</Text>
        </TouchableOpacity>

        {/* Section Prochaines interventions */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Missions Prioritaires</Text>
          <Text style={styles.sectionSubtitle}>Interventions en attente de prise en charge</Text>
        </View>

        {techInterventions.length === 0 ? (
          <View style={styles.emptyCard}>
            <CheckSquare size={32} color={Colors.mint} style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>Toutes les pannes sont résolues !</Text>
            <Text style={styles.emptySubtitle}>Aucune intervention en cours sur votre secteur.</Text>
          </View>
        ) : (
          <View style={styles.intervsList}>
            {techInterventions.slice(0, 3).map((item) => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => router.push({ pathname: '/tech-intervention-detail', params: { id: item.id } } as any)}
                activeOpacity={0.85}
              >
                <View style={styles.intervCard}>
                  <View style={styles.intervTop}>
                    <Text style={styles.intervTitle}>{item.breakdown_type}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>{item.status}</Text>
                    </View>
                  </View>

                  <View style={styles.farmerRow}>
                    <Sprout size={13} color={Colors.primary} style={{ marginRight: 4 }} />
                    <Text style={styles.farmerText}>{item.farmer_name} • {item.farm_name || 'Ferme locale'}</Text>
                  </View>

                  <View style={styles.intervFooter}>
                    <View style={styles.timeRow}>
                      <Clock size={12} color={Colors.textMuted} style={{ marginRight: 4 }} />
                      <Text style={styles.timeText}>Signalé récemment</Text>
                    </View>
                    <View style={styles.actionLink}>
                      <Text style={styles.actionLinkText}>Intervenir</Text>
                      <ArrowRight size={13} color={Colors.primary} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 60 }} />
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
  techBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  techBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.blue,
    letterSpacing: 0.6,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  subGreeting: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.danger,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
    marginBottom: 16,
  },
  kpiCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  kpiValue: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  intervsBtn: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: Radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  intervsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  intervsList: {
    gap: 12,
    marginBottom: 20,
  },
  intervCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  intervTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  intervTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  farmerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  farmerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  intervFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
});
