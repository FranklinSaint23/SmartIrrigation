import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows, Radii } from '../styles/Theme';
import { 
  Users, 
  Wrench, 
  Cpu, 
  AlertTriangle, 
  Bell, 
  User, 
  Settings, 
  Clock, 
  Activity,
  BarChart2,
  LogOut,
  ArrowRight,
  Shield
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { statistics, logout } = useSmartIrrigation();

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

  const recentActivities = [
    { id: 1, type: 'inscription', title: 'Nouvel agriculteur inscrit', desc: 'Pierre Nguema a créé un compte.', time: 'Il y a 10 min' },
    { id: 2, type: 'technicien', title: 'Nouveau technicien créé', desc: 'Martin Fokam a été ajouté.', time: 'Il y a 1h' },
    { id: 3, type: 'panne', title: 'Nouvelle panne signalée', desc: 'Capteur d\'humidité défaillant (Ferme Jean).', time: 'Il y a 2h' },
    { id: 4, type: 'cloture', title: 'Intervention terminée', desc: 'Pompe réparée par Alain Tchoua.', time: 'Il y a 4h' },
    { id: 5, type: 'reseau', title: 'ESP32 déconnecté', desc: 'ESP32-IRR-02 hors ligne depuis 30 min.', time: 'Il y a 5h' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.adminBadge}>
            <Shield size={12} color={Colors.primary} />
            <Text style={styles.adminBadgeText}>ESPACE ADMINISTRATEUR</Text>
          </View>
          <Text style={styles.greeting}>Console Centrale</Text>
          <Text style={styles.subGreeting}>Gestion du réseau et du parc IoT</Text>
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
        
        {/* Titre KPIs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Indicateurs Clés (KPI)</Text>
          <Text style={styles.sectionSubtitle}>État global du réseau SmartIrrigation</Text>
        </View>

        {/* Grille 2x2 des Statistiques */}
        <View style={styles.grid}>
          
          {/* Agriculteurs */}
          <TouchableOpacity 
            style={{ width: cardWidth }} 
            onPress={() => router.push('/admin-farmers' as any)} 
            activeOpacity={0.85}
          >
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <View style={[styles.iconWrap, { backgroundColor: '#E8F5E9' }]}>
                  <Users size={20} color={Colors.primary} />
                </View>
                <ArrowRight size={14} color={Colors.textMuted} />
              </View>
              <Text style={styles.kpiValue}>{statistics?.num_farmers ?? 25}</Text>
              <Text style={styles.kpiLabel}>Agriculteurs inscrits</Text>
            </View>
          </TouchableOpacity>

          {/* Techniciens */}
          <TouchableOpacity 
            style={{ width: cardWidth }} 
            onPress={() => router.push('/admin-technicians' as any)} 
            activeOpacity={0.85}
          >
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <View style={[styles.iconWrap, { backgroundColor: '#E0F2FE' }]}>
                  <Wrench size={20} color={Colors.blue} />
                </View>
                <ArrowRight size={14} color={Colors.textMuted} />
              </View>
              <Text style={styles.kpiValue}>{statistics?.num_techs ?? 8}</Text>
              <Text style={styles.kpiLabel}>Techniciens actifs</Text>
            </View>
          </TouchableOpacity>

          {/* Boîtiers ESP32 */}
          <TouchableOpacity 
            style={{ width: cardWidth }} 
            onPress={() => router.push('/admin-devices' as any)} 
            activeOpacity={0.85}
          >
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <View style={[styles.iconWrap, { backgroundColor: '#F0FDFA' }]}>
                  <Cpu size={20} color="#0D9488" />
                </View>
                <ArrowRight size={14} color={Colors.textMuted} />
              </View>
              <Text style={styles.kpiValue}>{statistics?.num_devices ?? 22}</Text>
              <Text style={styles.kpiLabel}>ESP32 connectés</Text>
            </View>
          </TouchableOpacity>

          {/* Pannes en attente */}
          <TouchableOpacity 
            style={{ width: cardWidth }} 
            onPress={() => router.push('/admin-interventions' as any)} 
            activeOpacity={0.85}
          >
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <View style={[styles.iconWrap, { backgroundColor: '#FEF3C7' }]}>
                  <AlertTriangle size={20} color="#D97706" />
                </View>
                <View style={styles.alertChip}>
                  <Text style={styles.alertChipText}>Action</Text>
                </View>
              </View>
              <Text style={styles.kpiValue}>{statistics?.num_pannes_attente ?? 4}</Text>
              <Text style={styles.kpiLabel}>Pannes à assigner</Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* Bouton Statistiques Avancées */}
        <TouchableOpacity 
          style={styles.statsButton}
          onPress={() => router.push('/admin-statistics' as any)}
          activeOpacity={0.85}
        >
          <BarChart2 size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.statsButtonText}>Consulter les rapports et consommations d'eau</Text>
        </TouchableOpacity>

        {/* Section Activités Récentes */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Activités Récentes du Réseau</Text>
          <Text style={styles.sectionSubtitle}>Événements IoT et flux opérationnel</Text>
        </View>

        <View style={styles.activitiesCard}>
          {recentActivities.map((activity, index) => (
            <View key={activity.id}>
              <View style={styles.activityRow}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                  <Text style={styles.activityDesc}>{activity.desc}</Text>
                </View>
              </View>
              {index < recentActivities.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

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
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
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
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertChip: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  alertChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  kpiValue: {
    fontSize: 28,
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
  statsButton: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: Radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  statsButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  activitiesCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
    marginBottom: 20,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.mint,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
  },
  activityTime: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  activityDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 4,
  },
});