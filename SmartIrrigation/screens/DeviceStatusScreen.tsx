import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, RotateCw, CheckCircle, Wifi, Cpu } from 'lucide-react-native';
import Svg, { Rect, G, Line, Circle, Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

export default function DeviceStatusScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>État du dispositif</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleRefresh} disabled={refreshing}>
          {refreshing ? <ActivityIndicator size="small" color={Colors.primary} /> : <RotateCw size={18} color={Colors.text} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Device Information Card */}
        <View style={styles.deviceCard}>
          <View style={styles.chipContainer}>
            <Svg width="80" height="110" viewBox="0 0 90 120">
              <Rect x="15" y="10" width="60" height="100" rx="6" fill="#1e1e1e" />
              <G stroke="#bdc3c7" strokeWidth="1.5">
                <Line x1="10" y1="25" x2="15" y2="25" /><Line x1="10" y1="35" x2="15" y2="35" /><Line x1="10" y1="45" x2="15" y2="45" />
                <Line x1="10" y1="55" x2="15" y2="55" /><Line x1="10" y1="65" x2="15" y2="65" /><Line x1="10" y1="75" x2="15" y2="75" />
                <Line x1="75" y1="25" x2="80" y2="25" /><Line x1="75" y1="35" x2="80" y2="35" /><Line x1="75" y1="45" x2="80" y2="45" />
                <Line x1="75" y1="55" x2="80" y2="55" /><Line x1="75" y1="65" x2="80" y2="65" /><Line x1="75" y1="75" x2="80" y2="75" />
              </G>
              <Rect x="27" y="25" width="36" height="40" rx="3" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="1" />
              <Path d="M 35 15 H 55 V 19 H 35 V 23 H 55" stroke="#f5b041" strokeWidth="1.5" fill="none" />
              <Circle cx="35" cy="85" r="2" fill={refreshing ? Colors.blue : Colors.primary} />
            </Svg>
          </View>

          <View style={styles.deviceDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.deviceNameText}>ESP32-IRR-01</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Connecté</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Adresse IP :</Text>
              <Text style={styles.detailValue}>192.168.3.2</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Signal Wi-Fi :</Text>
              <View style={styles.wifiRow}>
                <Wifi size={14} color={Colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.detailValue}>-62 dBm</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Uptime :</Text>
              <Text style={styles.detailValue}>2 jours 4h</Text>
            </View>
          </View>
        </View>

        {/* Sensor checklist */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Diagnostics Capteurs</Text>
        </View>

        <View style={styles.checklistCard}>
          {['Humidité du sol', 'DHT22 (Temp. & Hum)', 'Luminosité', 'Niveau d\'eau', 'Détecteur de pluie'].map((sensor, idx) => (
            <View key={idx}>
              <View style={styles.checkRow}>
                <Text style={styles.sensorName}>{sensor}</Text>
                <View style={styles.statusLabelContainer}>
                  <Text style={styles.statusLabel}>Fonctionnel</Text>
                  <CheckCircle size={18} color={Colors.primary} strokeWidth={2.5} />
                </View>
              </View>
              {idx < 4 && <View style={styles.rowDivider} />}
            </View>
          ))}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  deviceCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    ...Shadows.light,
  },
  chipContainer: {
    marginRight: 16,
  },
  deviceDetails: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  deviceNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  statusBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  wifiRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    paddingHorizontal: 16,
    paddingVertical: 4,
    ...Shadows.light,
  },
  checkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  sensorName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  statusLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.grayLight,
  },
});
