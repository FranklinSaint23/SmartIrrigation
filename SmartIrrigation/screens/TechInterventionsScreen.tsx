import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, Clock, User, Sprout, AlertCircle, ChevronRight } from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

export default function TechInterventionsScreen() {
  const router = useRouter();
  const { interventions } = useSmartIrrigation();
  const [filter, setFilter] = useState<'Toutes' | 'En cours' | 'Résolue'>('Toutes');

  const filteredIntervs = interventions.filter(item => {
    if (filter === 'Toutes') return true;
    return item.status === filter;
  });

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'En attente':
        return { bg: Colors.warningLight, text: Colors.warning, border: Colors.warning };
      case 'En cours':
        return { bg: Colors.infoLight, text: Colors.info, border: Colors.info };
      case 'Résolue':
        return { bg: Colors.successLight, text: Colors.success, border: Colors.success };
      default:
        return { bg: Colors.grayLight, text: Colors.gray, border: Colors.gray };
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Interventions</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        {(['Toutes', 'En cours', 'Résolue'] as const).map((t) => {
          const isActive = filter === t;
          const label = t === 'Résolue' ? 'Terminées' : t;
          return (
            <TouchableOpacity 
              key={t}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setFilter(t)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {filteredIntervs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AlertCircle size={48} color={Colors.grayLight} />
            <Text style={styles.emptyText}>Aucune intervention trouvée.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredIntervs.map((item) => {
              const badgeStyle = getStatusBadgeStyle(item.status);
              return (
                <TouchableOpacity 
                  key={item.id}
                  onPress={() => router.push({ pathname: '/tech-intervention-detail', params: { id: item.id } } as any)}
                  activeOpacity={0.9}
                >
                  <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                      <View style={styles.row}>
                        <View style={styles.left}>
                          <View style={styles.rowTitle}>
                            <Text style={styles.title}>#{item.id} - {item.breakdown_type}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }]}>
                              <Text style={[styles.statusText, { color: badgeStyle.text }]}>{item.status}</Text>
                            </View>
                          </View>
                          
                          <View style={styles.meta}>
                            <View style={styles.metaRow}>
                              <User size={13} color={Colors.gray} />
                              <Text style={styles.metaLabel}>Agriculteur :</Text>
                              <Text style={styles.metaValue}>{item.farmer_name}</Text>
                            </View>
                            <View style={styles.metaRow}>
                              <Sprout size={13} color={Colors.gray} />
                              <Text style={styles.metaLabel}>Exploitation :</Text>
                              <Text style={styles.metaValue}>{item.farm_name}</Text>
                            </View>
                          </View>
                        </View>
                        <ChevronRight size={18} color={Colors.gray} />
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
    gap: 8,
  },
  tab: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.gray,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    ...Shadows.light,
  },
  cardContent: {
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    gap: 10,
  },
  rowTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  meta: {
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
    marginLeft: 6,
    width: 80,
  },
  metaValue: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '700',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '600',
  },
});
