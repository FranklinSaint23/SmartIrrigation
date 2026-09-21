import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, Clock, User, AlertCircle, Calendar } from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

export default function MyReportsScreen() {
  const router = useRouter();
  const { interventions } = useSmartIrrigation();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'En attente':
        return { bg: Colors.warningLight, text: Colors.warning, border: Colors.warning };
      case 'En cours':
        return { bg: Colors.infoLight, text: Colors.info, border: Colors.info };
      case 'Résolue':
        return { bg: Colors.successLight, text: Colors.success, border: Colors.success };
      case 'Annulée':
      default:
        return { bg: Colors.grayLight, text: Colors.gray, border: Colors.gray };
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
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
        <Text style={styles.headerTitle}>Mes signalements</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {interventions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AlertCircle size={48} color={Colors.grayLight} />
            <Text style={styles.emptyText}>Aucun signalement de panne enregistré.</Text>
            <TouchableOpacity 
              style={styles.reportBtn}
              onPress={() => router.push('/report-issue')}
            >
              <Text style={styles.reportBtnText}>Signaler un problème</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {interventions.map((item) => {
              const statusStyle = getStatusStyle(item.status);
              return (
                <Card key={item.id} style={styles.card}>
                  <Card.Content style={styles.cardContent}>
                    {/* Top Row: Type & Status */}
                    <View style={styles.rowTop}>
                      <Text style={styles.breakdownType}>{item.breakdown_type}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                      </View>
                    </View>

                    {/* Date */}
                    <View style={styles.infoRow}>
                      <Calendar size={14} color={Colors.gray} />
                      <Text style={styles.infoValue}>{formatDate(item.created_at)}</Text>
                    </View>

                    {/* Description */}
                    <Text style={styles.description} numberOfLines={3}>
                      {item.description}
                    </Text>

                    {item.photo_url && (
                      <View style={styles.attachmentBadge}>
                        <Text style={styles.attachmentText}>Photo jointe</Text>
                      </View>
                    )}

                    <View style={styles.divider} />

                    {/* Bottom Info: Tech details */}
                    <View style={styles.rowBottom}>
                      <View style={styles.techContainer}>
                        <User size={15} color={Colors.gray} />
                        <Text style={styles.techLabel}>Technicien :</Text>
                        <Text style={styles.techValue}>
                          {item.technician_name || 'Non attribué'}
                        </Text>
                      </View>
                      <View style={styles.updateContainer}>
                        <Clock size={13} color={Colors.gray} style={{ marginRight: 4 }} />
                        <Text style={styles.updateText}>Mis à jour : {item.status === 'Résolue' ? 'Terminé' : 'Récemment'}</Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
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
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  list: {
    gap: 16,
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
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownType: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  infoValue: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  attachmentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 12,
  },
  attachmentText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grayLight,
    marginVertical: 12,
  },
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  techContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  techLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
  },
  techValue: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '700',
  },
  updateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateText: {
    fontSize: 10,
    color: Colors.gray,
    fontWeight: '600',
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
    textAlign: 'center',
  },
  reportBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    ...Shadows.light,
  },
  reportBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
