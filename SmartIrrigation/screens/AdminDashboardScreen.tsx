import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
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
  LogOut
} from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const cardWidth = (width - 52) / 2;

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
          <Text style={styles.greeting}>Bonjour Admin 👋</Text>
          <Text style={styles.headerTitle}>Tableau de bord</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/notifications')}
            activeOpacity={0.7}
          >
            <Bell size={20} color="#0D5C3A" />
            <View style={styles.dot} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/profile')}
            activeOpacity={0.7}
          >
            <User size={20} color="#0D5C3A" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}
          >
            <Settings size={20} color="#0D5C3A" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleLogoutPress}
            activeOpacity={0.7}
          >
            <LogOut size={20} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Statistics Grid */}
        <View style={styles.grid}>
          {/* Farmers */}
          <TouchableOpacity style={{ width: cardWidth }} onPress={() => router.push('/admin-farmers')} activeOpacity={0.9}>
            <Card style={[styles.card, { borderLeftColor: Colors.primary, borderLeftWidth: 4 }]}>
              <Card.Content style={styles.cardContent}>
                <View style={[styles.iconCircle, { backgroundColor: Colors.successLight }]}>
                  <Users size={22} color={Colors.primary} />
                </View>
                <Text style={styles.cardLabel}>Agriculteurs</Text>
                <Text style={styles.cardValue}>{statistics?.num_farmers ?? 25}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          {/* Technicians */}
          <TouchableOpacity style={{ width: cardWidth }} onPress={() => router.push('/admin-technicians')} activeOpacity={0.9}>
            <Card style={[styles.card, { borderLeftColor: Colors.blue, borderLeftWidth: 4 }]}>
              <Card.Content style={styles.cardContent}>
                <View style={[styles.iconCircle, { backgroundColor: Colors.infoLight }]}>
                  <Wrench size={22} color={Colors.blue} />
                </View>
                <Text style={styles.cardLabel}>Techniciens</Text>
                <Text style={styles.cardValue}>{statistics?.num_techs ?? 8}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          {/* Devices */}
          <TouchableOpacity style={{ width: cardWidth }} onPress={() => router.push('/admin-devices')} activeOpacity={0.9}>
            <Card style={[styles.card, { borderLeftColor: '#00ACC1', borderLeftWidth: 4 }]}>
              <Card.Content style={styles.cardContent}>
                <View style={[styles.iconCircle, { backgroundColor: '#E0F7FA' }]}>
                  <Cpu size={22} color="#00ACC1" />
                </View>
                <Text style={styles.cardLabel}>ESP32 connectés</Text>
                <Text style={styles.cardValue}>{statistics?.num_devices ?? 22}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          {/* Pending Breakdowns */}
          <TouchableOpacity style={{ width: cardWidth }} onPress={() => router.push('/admin-interventions')} activeOpacity={0.9}>
            <Card style={[styles.card, { borderLeftColor: Colors.warning, borderLeftWidth: 4 }]}>
              <Card.Content style={styles.cardContent}>
                <View style={[styles.iconCircle, { backgroundColor: Colors.warningLight }]}>
                  <AlertTriangle size={22} color={Colors.warning} />
                </View>
                <Text style={styles.cardLabel}>Pannes en attente</Text>
                <Text style={styles.cardValue}>{statistics?.num_pannes_attente ?? 4}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Global Stats button */}
        <TouchableOpacity 
          style={styles.statsButton}
          onPress={() => router.push('/admin-statistics')}
          activeOpacity={0.8}
        >
          <BarChart2 size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.statsButtonText}>Consulter les statistiques avancées</Text>
        </TouchableOpacity>

        {/* Recent Activities Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activités récentes</Text>
        </View>

        <Card style={styles.activitiesCard}>
          <Card.Content style={styles.activitiesContent}>
            {recentActivities.map((act, index) => (
              <View key={act.id}>
                <View style={styles.activityRow}>
                  <View style={styles.activityIconWrapper}>
                    <Activity size={16} color={Colors.primary} />
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityTitle}>{act.title}</Text>
                    <Text style={styles.activityDesc}>{act.desc}</Text>
                  </View>
                  <View style={styles.activityTimeContainer}>
                    <Clock size={12} color={Colors.gray} style={{ marginRight: 4 }} />
                    <Text style={styles.activityTime}>{act.time}</Text>
                  </View>
                </View>
                {index < recentActivities.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Logout Quick Link */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogoutPress}>
          <Text style={styles.logoutBtnText}>Quitter l'Espace Admin</Text>
        </TouchableOpacity>

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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  greeting: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    ...Shadows.light,
  },
  cardContent: {
    padding: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '700',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 4,
  },
  statsButton: {
    height: 48,
    backgroundColor: '#0D5C3A',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...Shadows.light,
  },
  statsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  activitiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    ...Shadows.light,
    marginBottom: 24,
  },
  activitiesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
    gap: 2,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  activityDesc: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '600',
  },
  activityTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 10,
    color: Colors.gray,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grayLight,
  },
  logoutBtn: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoutBtnText: {
    fontSize: 15,
    color: Colors.danger,
    fontWeight: '700',
  },
});