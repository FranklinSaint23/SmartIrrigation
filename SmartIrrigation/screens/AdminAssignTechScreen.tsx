import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, User, Wrench, Check, Circle } from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

export default function AdminAssignTechScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const interventionId = parseInt(params.id as string);

  const { interventions, technicians, assignTechnician } = useSmartIrrigation();
  const [selectedTech, setSelectedTech] = useState<number | null>(null);

  const currentIntervention = interventions.find(item => item.id === interventionId);

  const handleAssign = async () => {
    if (!selectedTech) {
      Alert.alert('Erreur', 'Veuillez sélectionner un technicien.');
      return;
    }

    try {
      const success = await assignTechnician(interventionId, selectedTech);
      if (success) {
        Alert.alert('Succès', 'Technicien affecté avec succès.');
        router.back();
      } else {
        Alert.alert('Erreur', 'Impossible de procéder à l\'affectation.');
      }
    } catch (e) {
      Alert.alert('Erreur', 'Erreur réseau.');
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
        <Text style={styles.headerTitle}>Affecter un technicien</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Intervention Summary */}
        {currentIntervention && (
          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryContent}>
              <Text style={styles.summaryTitle}>Intervention #{interventionId}</Text>
              <Text style={styles.summaryDetails}>
                Panne : <Text style={styles.bold}>{currentIntervention.breakdown_type}</Text>
              </Text>
              <Text style={styles.summaryDetails}>
                Agriculteur : <Text style={styles.bold}>{currentIntervention.farmer_name}</Text> ({currentIntervention.farm_name})
              </Text>
            </Card.Content>
          </Card>
        )}

        <Text style={styles.sectionTitle}>Techniciens Disponibles</Text>

        {/* Tech list */}
        <View style={styles.list}>
          {technicians.map((tech) => {
            const isSelected = selectedTech === tech.id;
            const isOccupied = tech.status === 'Occupé';
            return (
              <TouchableOpacity 
                key={tech.id} 
                activeOpacity={isOccupied ? 1 : 0.8}
                onPress={() => !isOccupied && setSelectedTech(tech.id)}
              >
                <Card style={[
                  styles.techCard, 
                  isSelected && { borderColor: Colors.primary, borderWidth: 2 },
                  isOccupied && { opacity: 0.5 }
                ]}>
                  <Card.Content style={styles.techCardContent}>
                    <View style={styles.row}>
                      <View style={styles.left}>
                        <View style={[styles.avatarCircle, { backgroundColor: isOccupied ? Colors.grayLight : Colors.successLight }]}>
                          <User size={18} color={isOccupied ? Colors.gray : Colors.primary} />
                        </View>
                        <View style={styles.details}>
                          <Text style={styles.techName}>{tech.name}</Text>
                          <Text style={styles.techCity}>Ville : {tech.city}</Text>
                          <View style={styles.specialtyRow}>
                            <Wrench size={12} color={Colors.gray} />
                            <Text style={styles.specialtyText}>{tech.specialty}</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View style={styles.right}>
                        <View style={[styles.statusBadge, { 
                          backgroundColor: isOccupied ? Colors.warningLight : Colors.successLight,
                          borderColor: isOccupied ? Colors.warning : Colors.success
                        }]}>
                          <Text style={[styles.statusText, { color: isOccupied ? Colors.warning : Colors.success }]}>
                            {tech.status}
                          </Text>
                        </View>
                        
                        {!isOccupied && (
                          <View style={{ marginTop: 8 }}>
                            {isSelected ? (
                              <Check size={20} color={Colors.primary} />
                            ) : (
                              <Circle size={20} color={Colors.grayLight} />
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Submit button */}
        <TouchableOpacity 
          style={[styles.submitButton, !selectedTech && { opacity: 0.6 }]}
          onPress={handleAssign}
          disabled={!selectedTech}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>ATTRIBUER L'INTERVENTION</Text>
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    marginBottom: 24,
    ...Shadows.light,
  },
  summaryContent: {
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  summaryDetails: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: '600',
    marginTop: 2,
  },
  bold: {
    color: Colors.text,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  techCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E8ECE9',
    ...Shadows.light,
  },
  techCardContent: {
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    gap: 2,
  },
  techName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  techCity: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '600',
  },
  specialtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  specialtyText: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '600',
  },
  right: {
    alignItems: 'flex-end',
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
  submitButton: {
    height: 52,
    backgroundColor: '#0D5C3A',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    ...Shadows.light,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
