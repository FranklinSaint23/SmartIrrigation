import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, Cpu, Wifi, User, Sprout, Network } from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

export default function AdminDevicesScreen() {
  const router = useRouter();
  const { devices } = useSmartIrrigation();

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'Bon':
        return Colors.success;
      case 'Moyen':
        return Colors.warning;
      case 'Faible':
      default:
        return Colors.danger;
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
        <Text style={styles.headerTitle}>Gestion des ESP32</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {devices.map((device) => {
            const signalColor = getSignalColor(device.wifi_signal);
            return (
              <Card key={device.device_id} style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  
                  {/* Top: Name & Online Status */}
                  <View style={styles.rowTop}>
                    <View style={styles.titleContainer}>
                      <View style={styles.iconWrapper}>
                        <Cpu size={20} color={Colors.primary} />
                      </View>
                      <View>
                        <Text style={styles.deviceName}>{device.name}</Text>
                        <Text style={styles.deviceId}>ID: {device.device_id}</Text>
                      </View>
                    </View>
                    
                    <View style={[styles.statusBadge, { 
                      backgroundColor: device.is_online ? Colors.successLight : Colors.dangerLight,
                      borderColor: device.is_online ? Colors.success : Colors.danger
                    }]}>
                      <Text style={[styles.statusText, { color: device.is_online ? Colors.success : Colors.danger }]}>
                        {device.is_online ? 'En ligne' : 'Hors ligne'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* Info details */}
                  <View style={styles.details}>
                    <View style={styles.infoRow}>
                      <User size={14} color={Colors.gray} />
                      <Text style={styles.infoLabel}>Agriculteur :</Text>
                      <Text style={styles.infoValue}>{device.farmer_name}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Sprout size={14} color={Colors.gray} />
                      <Text style={styles.infoLabel}>Exploitation :</Text>
                      <Text style={styles.infoValue}>{device.farm_name}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Network size={14} color={Colors.gray} />
                      <Text style={styles.infoLabel}>Adresse IP :</Text>
                      <Text style={styles.infoValue}>{device.ip_address || 'Non attribuée'}</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* Footer: Wifi signal strength */}
                  <View style={styles.rowBottom}>
                    <View style={styles.wifiContainer}>
                      <Wifi size={16} color={signalColor} />
                      <Text style={styles.wifiLabel}>Signal Wi-Fi :</Text>
                      <Text style={[styles.wifiValue, { color: signalColor }]}>{device.wifi_signal}</Text>
                    </View>
                    <Text style={styles.lastSeen}>Mis à jour : Récemment</Text>
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
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  deviceId: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '600',
    marginTop: 1,
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
  divider: {
    height: 1,
    backgroundColor: Colors.grayLight,
    marginVertical: 12,
  },
  details: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
    marginLeft: 8,
    width: 90,
  },
  infoValue: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '700',
    flex: 1,
  },
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wifiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wifiLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
  },
  wifiValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  lastSeen: {
    fontSize: 10,
    color: Colors.gray,
    fontWeight: '600',
  },
});
