import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, Calendar, User, Sprout, AlertCircle, UserPlus, CheckCircle } from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

export default function AdminInterventionsScreen() {
  const router = useRouter();
  const { interventions } = useSmartIrrigation();

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

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
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
        <Text style={styles.headerTitle}>Gestion des Interventions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {interventions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AlertCircle size={48} color={Colors.grayLight} />
            <Text style={styles.emptyText}>Aucune demande d'intervention pour le moment.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {interventions.map((item) => {
              const badgeStyle = getStatusBadgeStyle(item.status);
              return (
                <Card key={item.id} style={styles.card}>
                  <Card.Content style={styles.cardContent}>
                    
                    {/* Header: Type & Status */}
                    <View style={styles.rowTop}>
                      <Text style={styles.breakdownType}>{item.breakdown_type}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }]}>
                        <Text style={[styles.statusText, { color: badgeStyle.text }]}>{item.status}</Text>
                      </View>
                    </View>

                    {/* Metadata: Farmer, farm, date */}
                    <View style={styles.metadata}>
                      <View style={styles.metaRow}>
                        <User size={13} color={Colors.gray} />
                        <Text style={styles.metaLabel}>Agriculteur :</Text>
                        <Text style={styles.metaValue}>{item.farmer_name} ({item.farmer_phone})</Text>
                      </View>
                      <View style={styles.metaRow}>
                        <Sprout size={13} color={Colors.gray} />
                        <Text style={styles.metaLabel}>Exploitation :</Text>
                        <Text style={styles.metaValue}>{item.farm_name}</Text>
                      </View>
                      <View style={styles.metaRow}>
                        <Calendar size={13} color={Colors.gray} />
                        <Text style={styles.metaLabel}>Signalé le :</Text>
                        <Text style={styles.metaValue}>{formatDate(item.created_at)}</Text>
                      </View>
                    </View>

                    <Text style={styles.descriptionLabel}>DESCRIPTION DU PROBLÈME :</Text>
                    <Text style={styles.description}>{item.description}</Text>

                    {/* Attached Photo Preview */}
                    {item.photo_url && (
                      <View style={styles.photoContainer}>
                        <Image source={{ uri: item.photo_url }} style={styles.photo} />
                      </View>
                    )}

                    {item.technician_name && (
                      <View style={styles.techAssignedContainer}>
                        <CheckCircle size={14} color={Colors.success} />
                        <Text style={styles.techText}>
                          Technicien affecté : <Text style={styles.techBold}>{item.technician_name}</Text>
                        </Text>
                      </View>
                    )}

                    {item.status === 'En attente' && (
                      <TouchableOpacity 
                        style={styles.actionBtn}
                        onPress={() => router.push({ pathname: '/admin-assign-technician', params: { id: item.id } } as any)}
                        activeOpacity={0.8}
                      >
                        <UserPlus size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={styles.actionBtnText}>Attribuer à un technicien</Text>
                      </TouchableOpacity>
                    )}

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
    marginBottom: 12,
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
    fontSize: 10,
    fontWeight: '800',
  },
  metadata: {
    gap: 6,
    marginBottom: 12,
    backgroundColor: Colors.background,
    padding: 10,
    borderRadius: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '600',
    marginLeft: 6,
    width: 80,
  },
  metaValue: {
    fontSize: 11,
    color: Colors.text,
    fontWeight: '700',
    flex: 1,
  },
  descriptionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.gray,
    marginTop: 8,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  photoContainer: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  techAssignedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.successLight,
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  techText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  techBold: {
    fontWeight: '800',
  },
  actionBtn: {
    height: 44,
    backgroundColor: '#0D5C3A',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    ...Shadows.light,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
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
