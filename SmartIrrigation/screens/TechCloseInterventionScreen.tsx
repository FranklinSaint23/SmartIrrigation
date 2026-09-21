import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, CheckSquare, Square, FileText, CheckCircle } from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

export default function TechCloseInterventionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = parseInt(params.id as string);

  const { interventions, closeIntervention } = useSmartIrrigation();
  const current = interventions.find(item => item.id === id);

  const [notes, setNotes] = useState('');
  
  // Checklist states
  const [pumpChecked, setPumpChecked] = useState(false);
  const [espChecked, setEspChecked] = useState(false);
  const [sensorsChecked, setSensorsChecked] = useState(false);
  const [relayChecked, setRelayChecked] = useState(false);
  const [testChecked, setTestChecked] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!notes.trim()) {
      Alert.alert('Erreur', 'Veuillez renseigner les travaux effectués.');
      return;
    }

    if (!pumpChecked || !espChecked || !sensorsChecked || !relayChecked || !testChecked) {
      Alert.alert('Attention', 'Veuillez valider toutes les étapes de la checklist avant de clôturer.');
      return;
    }

    setLoading(true);
    try {
      const checks = {
        pumpChecked,
        espChecked,
        sensorsChecked,
        relayChecked,
        testChecked,
      };

      const success = await closeIntervention(id, notes.trim(), checks);
      if (success) {
        Alert.alert('Intervention clôturée', 'Le rapport a été transmis et le statut de la panne est désormais "Résolue".');
        router.replace('/tech-dashboard');
      } else {
        Alert.alert('Erreur', 'Impossible de clôturer l\'intervention.');
      }
    } catch {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la communication réseau.');
    } finally {
      setLoading(false);
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
        <Text style={styles.headerTitle}>Clôture Intervention</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {current && (
          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryCardContent}>
              <Text style={styles.summaryTitle}>Rapport d'intervention #{id}</Text>
              <Text style={styles.summaryDetail}>Panne : <Text style={styles.bold}>{current.breakdown_type}</Text></Text>
              <Text style={styles.summaryDetail}>Exploitation : <Text style={styles.bold}>{current.farm_name}</Text> ({current.farmer_name})</Text>
            </Card.Content>
          </Card>
        )}

        {/* Text Input */}
        <Text style={styles.label}>TRAVAUX EFFECTUÉS</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholder="Décrivez précisément les réparations accomplies (ex: remplacement du relais électromagnétique, recalibrage du capteur)..."
          placeholderTextColor="#A0AEC0"
          value={notes}
          onChangeText={setNotes}
        />

        {/* Checklist */}
        <Text style={styles.label}>CHECKLIST DE VÉRIFICATION</Text>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            
            {/* Checklist item 1 */}
            <TouchableOpacity 
              style={styles.checkRow} 
              onPress={() => setPumpChecked(!pumpChecked)}
              activeOpacity={0.8}
            >
              {pumpChecked ? <CheckSquare size={20} color={Colors.primary} /> : <Square size={20} color={Colors.grayLight} />}
              <Text style={styles.checkText}>Pompe vérifiée et opérationnelle</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Checklist item 2 */}
            <TouchableOpacity 
              style={styles.checkRow} 
              onPress={() => setEspChecked(!espChecked)}
              activeOpacity={0.8}
            >
              {espChecked ? <CheckSquare size={20} color={Colors.primary} /> : <Square size={20} color={Colors.grayLight} />}
              <Text style={styles.checkText}>ESP32 alimenté et connecté</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Checklist item 3 */}
            <TouchableOpacity 
              style={styles.checkRow} 
              onPress={() => setSensorsChecked(!sensorsChecked)}
              activeOpacity={0.8}
            >
              {sensorsChecked ? <CheckSquare size={20} color={Colors.primary} /> : <Square size={20} color={Colors.grayLight} />}
              <Text style={styles.checkText}>Capteurs nettoyés et testés</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Checklist item 4 */}
            <TouchableOpacity 
              style={styles.checkRow} 
              onPress={() => setRelayChecked(!relayChecked)}
              activeOpacity={0.8}
            >
              {relayChecked ? <CheckSquare size={20} color={Colors.primary} /> : <Square size={20} color={Colors.grayLight} />}
              <Text style={styles.checkText}>Relais de commande fonctionnel</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Checklist item 5 */}
            <TouchableOpacity 
              style={styles.checkRow} 
              onPress={() => setTestChecked(!testChecked)}
              activeOpacity={0.8}
            >
              {testChecked ? <CheckSquare size={20} color={Colors.primary} /> : <Square size={20} color={Colors.grayLight} />}
              <Text style={styles.checkText}>Test final d'arrosage effectué</Text>
            </TouchableOpacity>

          </Card.Content>
        </Card>

        {/* Submit */}
        <TouchableOpacity 
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          <CheckCircle size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.submitBtnText}>
            {loading ? 'CLÔTURE...' : 'CLÔTURER L\'INTERVENTION'}
          </Text>
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
    backgroundColor: Colors.infoLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    marginBottom: 20,
  },
  summaryCardContent: {
    padding: 16,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
  },
  summaryDetail: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
    marginTop: 2,
  },
  bold: {
    fontWeight: '800',
    color: Colors.text,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4A5568',
    marginBottom: 8,
    marginTop: 16,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    height: 120,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    ...Shadows.light,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    ...Shadows.light,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  checkText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grayLight,
  },
  submitBtn: {
    height: 52,
    backgroundColor: '#0D5C3A',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    ...Shadows.light,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
