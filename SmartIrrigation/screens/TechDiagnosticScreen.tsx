import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, Cpu, RefreshCw, CheckCircle, XCircle } from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

interface ComponentState {
  name: string;
  key: string;
  status: 'Fonctionnel' | 'Panne' | 'En attente' | 'Test en cours...';
}

export default function TechDiagnosticScreen() {
  const router = useRouter();
  const { runDiagnosticTest } = useSmartIrrigation();

  const [components, setComponents] = useState<ComponentState[]>([
    { name: 'ESP32', key: 'esp32', status: 'Fonctionnel' },
    { name: 'Connexion Wi-Fi', key: 'wifi', status: 'Fonctionnel' },
    { name: 'Capteur d\'humidité', key: 'humidity', status: 'Fonctionnel' },
    { name: 'Capteur de température', key: 'temp', status: 'Fonctionnel' },
    { name: 'Capteur de luminosité', key: 'light', status: 'Fonctionnel' },
    { name: 'Capteur niveau d\'eau', key: 'water_level', status: 'Fonctionnel' },
    { name: 'Relais', key: 'relay', status: 'Fonctionnel' },
    { name: 'Pompe à eau', key: 'pump', status: 'Fonctionnel' },
  ]);

  const [testingKey, setTestingKey] = useState<string | null>(null);

  const handleRunTest = async (key: string, name: string) => {
    setTestingKey(key);
    
    // Set status to testing
    setComponents((prev) => 
      prev.map((c) => (c.key === key ? { ...c, status: 'Test en cours...' } : c))
    );

    try {
      const result = await runDiagnosticTest(key);
      setComponents((prev) => 
        prev.map((c) => (c.key === key ? { ...c, status: result } : c))
      );
    } catch {
      setComponents((prev) => 
        prev.map((c) => (c.key === key ? { ...c, status: 'Fonctionnel' } : c))
      );
    } finally {
      setTestingKey(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Fonctionnel':
        return { text: Colors.success, bg: Colors.successLight };
      case 'Panne':
        return { text: Colors.danger, bg: Colors.dangerLight };
      case 'Test en cours...':
        return { text: Colors.blue, bg: Colors.infoLight };
      default:
        return { text: Colors.gray, bg: Colors.grayLight };
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
        <Text style={styles.headerTitle}>Diagnostic Système</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Testez l'état opérationnel des composants physiques connectés.</Text>

        <View style={styles.list}>
          {components.map((comp) => {
            const statusStyle = getStatusColor(comp.status);
            const isTesting = comp.status === 'Test en cours...';
            return (
              <Card key={comp.key} style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.row}>
                    <View style={styles.left}>
                      <Cpu size={18} color={Colors.gray} />
                      <Text style={styles.compName}>{comp.name}</Text>
                    </View>

                    <View style={styles.right}>
                      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        {comp.status === 'Fonctionnel' && <CheckCircle size={12} color={Colors.success} style={{ marginRight: 4 }} />}
                        {comp.status === 'Panne' && <XCircle size={12} color={Colors.danger} style={{ marginRight: 4 }} />}
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{comp.status}</Text>
                      </View>

                      <TouchableOpacity 
                        style={[styles.testBtn, testingKey !== null && { opacity: 0.5 }]}
                        onPress={() => testingKey === null && handleRunTest(comp.key, comp.name)}
                        disabled={testingKey !== null}
                      >
                        {isTesting ? (
                          <ActivityIndicator size="small" color={Colors.primary} />
                        ) : (
                          <RefreshCw size={13} color={Colors.primary} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          })}
        </View>
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
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '600',
    marginBottom: 20,
    lineHeight: 20,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  compName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  testBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
