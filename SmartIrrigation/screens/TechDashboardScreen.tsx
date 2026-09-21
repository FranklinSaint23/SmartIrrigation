import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
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
  LogOut
} from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const cardWidth = (width - 52) / 2;

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

  // Filter technician's interventions
  const techInterventions = interventions.filter(item => item.status !== 'Résolue' && item.status !== 'Annulée');
  const finishedCount = interventions.filter(item => item.status === 'Résolue').length;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour {profile.name} 👋</Text>
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
          <Card style={[styles.kpiCard, { borderLeftColor: Colors.blue, borderLeftWidth: 4 }]}>
            <Card.Content style={styles.kpiContent}>
              <ClipboardList size={20} color={Colors.blue} />
              <Text style={styles.kpiLabel}>Assignées</Text>
              <Text style={styles.kpiValue}>{techInterventions.length + finishedCount}</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.kpiCard, { borderLeftColor: Colors.warning, borderLeftWidth: 4 }]}>
            <Card.Content style={styles.kpiContent}>
              <Play size={20} color={Colors.warning} />
              <Text style={styles.kpiLabel}>En cours</Text>
              <Text style={styles.kpiValue}>{techInterventions.filter(item => item.status === 'En cours').length}</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.kpiCard, { borderLeftColor: Colors.primary, borderLeftWidth: 4 }]}>
            <Card.Content style={styles.kpiContent}>
              <CheckSquare size={20} color={Colors.primary} />
              <Text style={styles.kpiLabel}>Terminées</Text>
              <Text style={styles.kpiValue}>{finishedCount}</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.kpiCard, { borderLeftColor: '#00ACC1', borderLeftWidth: 4 }]}>
            <Card.Content style={styles.kpiContent}>
              <Cpu size={20} color="#00ACC1" />
              <Text style={styles.kpiLabel}>ESP32 vérifiés</Text>
              <Text style={styles.kpiValue}>{finishedCount + 1}</Text>
            </Card.Content>
          </Card>
        </View>

        {/* View Interventions button */}
        <TouchableOpacity 
          style={styles.intervsBtn}
          onPress={() => router.push('/tech-interventions')}
          activeOpacity={0.8}
        >
          <ClipboardList size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.intervsBtnText}>Consulter toutes mes interventions</Text>
        </TouchableOpacity>

        {/* Mes prochaines interventions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes prochaines interventions</Text>
        </View>

        {techInterventions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text style={styles.emptyText}>Aucune intervention programmée. Bon travail !</Text>
            </Card.Content>
          </Card>
        ) : (
          <View style={styles.intervsList}>
            {techInterventions.slice(0, 3).map((item) => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => router.push({ pathname: '/tech-intervention-detail', params: { id: item.id } } as any)}
                activeOpacity={0.9}
              >
                <Card style={styles.intervCard}>
                  <Card.Content style={styles.intervContent}>
                    <View style={styles.row}>
                      <View style={styles.left}>
                        <Text style={styles.intervTitle}>{item.breakdown_type}</Text>
                        <View style={styles.farmerInfo}>
                          <Sprout size={12} color={Colors.gray} />
                          <Text style={styles.farmerText}>{item.farmer_name} - {item.farm_name}</Text>
                        </View>
                        <View style={styles.timeInfo}>
                          <Clock size={12} color={Colors.gray} />
                          <Text style={styles.timeText}>Signalé aujourd'hui</Text>
                        </View>
                      </View>
                      <ArrowRight size={18} color={Colors.primary} />
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Logout Quick Link */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogoutPress}>
          <Text style={styles.logoutBtnText}>Déconnexion Technicien</Text>
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
  kpiCard: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    ...Shadows.light,
  },
  kpiContent: {
    padding: 16,
    gap: 6,
  },
  kpiLabel: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '700',
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  intervsBtn: {
    height: 48,
    backgroundColor: '#0D5C3A',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...Shadows.light,
  },
  intervsBtnText: {
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
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    marginBottom: 24,
    ...Shadows.light,
  },
  emptyContent: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: '600',
  },
  intervsList: {
    gap: 12,
    marginBottom: 24,
  },
  intervCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    ...Shadows.light,
  },
  intervContent: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    gap: 4,
    flex: 1,
  },
  intervTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  farmerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  farmerText: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '600',
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
