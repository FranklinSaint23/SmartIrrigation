import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, User, Phone, Sprout, Cpu, Calendar, Play, CheckCircle } from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

export default function TechInterventionDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = parseInt(params.id as string);

  const { interventions, startIntervention } = useSmartIrrigation();
  const current = interventions.find(item => item.id === id);

  const handleStart = async () => {
    try {
      const success = await startIntervention(id);
      if (success) {
        Alert.alert('Succès', 'Intervention démarrée.');
      }
    } catch {
      Alert.alert('Erreur', 'Erreur réseau.');
    }
  };

  if (!current) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Intervention introuvable.</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Détail Intervention</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Intervention General Card */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            
            {/* Top row: Type & Status */}
            <View style={styles.rowTop}>
              <Text style={styles.title}>{current.breakdown_type}</Text>
              <View style={[styles.statusBadge, { 
                backgroundColor: current.status === 'Résolue' ? Colors.successLight : Colors.warningLight,
                borderColor: current.status === 'Résolue' ? Colors.success : Colors.warning
              }]}>
                <Text style={[styles.statusText, { color: current.status === 'Résolue' ? Colors.success : Colors.warning }]}>
                  {current.status}
                </Text>
              </View>
            </View>

            {/* Farm & Farmer details */}
            <View style={styles.metaSection}>
              <View style={styles.infoRow}>
                <User size={16} color={Colors.gray} />
                <View style={styles.infoCol}>
                  <Text style={styles.label}>Agriculteur</Text>
                  <Text style={styles.value}>{current.farmer_name}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Phone size={16} color={Colors.gray} />
                <View style={styles.infoCol}>
                  <Text style={styles.label}>Téléphone</Text>
                  <Text style={styles.value}>{current.farmer_phone}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Sprout size={16} color={Colors.gray} />
                <View style={styles.infoCol}>
                  <Text style={styles.label}>Exploitation</Text>
                  <Text style={styles.value}>{current.farm_name}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Cpu size={16} color={Colors.gray} />
                <View style={styles.infoCol}>
                  <Text style={styles.label}>Matériel Concerné</Text>
                  <Text style={styles.value}>ESP32-IRR-01</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Calendar size={16} color={Colors.gray} />
                <View style={styles.infoCol}>
                  <Text style={styles.label}>Signalé le</Text>
                  <Text style={styles.value}>Aujourd'hui à 10:00</Text>
                </View>
              </View>
            </View>

          </Card.Content>
        </Card>

        {/* Breakdown Description */}
        <Text style={styles.sectionTitle}>Description du problème</Text>
        <Card style={styles.card}>
          <Card.Content style={styles.descriptionContent}>
            <Text style={styles.descriptionText}>{current.description}</Text>
            {current.photo_url && (
              <View style={styles.photoContainer}>
                <Image source={{ uri: current.photo_url }} style={styles.photo} />
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Action buttons */}
        {current.status === 'En cours' ? (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.diagBtn}
              onPress={() => router.push({ pathname: '/tech-diagnostic', params: { id: current.id } } as any)}
              activeOpacity={0.8}
            >
              <Cpu size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.diagBtnText}>Diagnostic système</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.closeBtn}
              onPress={() => router.push({ pathname: '/tech-close-intervention', params: { id: current.id } } as any)}
              activeOpacity={0.8}
            >
              <CheckCircle size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.closeBtnText}>Clôturer l'intervention</Text>
            </TouchableOpacity>
          </View>
        ) : (
          current.status === 'En attente' && (
            <TouchableOpacity 
              style={styles.startBtn}
              onPress={handleStart}
              activeOpacity={0.8}
            >
              <Play size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.startBtnText}>Démarrer l'intervention</Text>
            </TouchableOpacity>
          )
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    marginBottom: 20,
    ...Shadows.light,
  },
  cardContent: {
    padding: 16,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
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
  metaSection: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCol: {
    marginLeft: 12,
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '700',
  },
  value: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grayLight,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 10,
  },
  descriptionContent: {
    padding: 16,
  },
  descriptionText: {
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 18,
    fontWeight: '600',
  },
  photoContainer: {
    marginTop: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  actionsContainer: {
    gap: 12,
    marginTop: 12,
  },
  diagBtn: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.light,
  },
  diagBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  closeBtn: {
    height: 52,
    backgroundColor: '#0D5C3A',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.light,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  startBtn: {
    height: 52,
    backgroundColor: '#0D5C3A',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    ...Shadows.light,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 14,
    color: Colors.danger,
    fontWeight: '700',
  },
});
