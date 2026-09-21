import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, User, Phone, Mail, MapPin, Wrench, Plus, CheckCircle, AlertTriangle } from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

export default function AdminTechniciansScreen() {
  const router = useRouter();
  const { technicians } = useSmartIrrigation();

  const getStatusBadgeStyle = (status: string) => {
    if (status === 'Disponible') {
      return { bg: Colors.successLight, text: Colors.success, border: Colors.success };
    }
    return { bg: Colors.warningLight, text: Colors.warning, border: Colors.warning };
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
        <Text style={styles.headerTitle}>Gestion des Techniciens</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Add Tech button */}
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => router.push('/admin-add-technician')}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.addBtnText}>Ajouter un technicien</Text>
        </TouchableOpacity>

        {/* List of Techs */}
        <View style={styles.list}>
          {technicians.map((item) => {
            const badgeStyle = getStatusBadgeStyle(item.status);
            return (
              <Card key={item.email} style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  
                  {/* Top line: Name & Status */}
                  <View style={styles.rowTop}>
                    <View style={styles.nameSection}>
                      <AvatarSection name={item.name} />
                      <View>
                        <Text style={styles.name}>{item.name}</Text>
                        <View style={styles.specialtyRow}>
                          <Wrench size={12} color={Colors.gray} />
                          <Text style={styles.specialtyText}>{item.specialty}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }]}>
                      <Text style={[styles.statusText, { color: badgeStyle.text }]}>{item.status}</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* Body contact details */}
                  <View style={styles.detailsSection}>
                    <View style={styles.infoRow}>
                      <Phone size={13} color={Colors.gray} />
                      <Text style={styles.infoValue}>{item.phone_number}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Mail size={13} color={Colors.gray} />
                      <Text style={styles.infoValue}>{item.email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <MapPin size={13} color={Colors.gray} />
                      <Text style={styles.infoValue}>Ville : {item.city}</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* Foot statistics */}
                  <View style={styles.rowFoot}>
                    <Text style={styles.intervsText}>
                      Interventions réalisées : <Text style={styles.intervsBold}>{item.interventions_count || 0}</Text>
                    </Text>
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

const AvatarSection = ({ name }: { name: string }) => (
  <View style={styles.avatarCircle}>
    <Text style={styles.avatarLabel}>{name.substring(0, 2).toUpperCase()}</Text>
  </View>
);

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
  addBtn: {
    height: 48,
    backgroundColor: '#0D5C3A',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Shadows.light,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.infoLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.blue,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
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
  detailsSection: {
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoValue: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '600',
  },
  rowFoot: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  intervsText: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '600',
  },
  intervsBold: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '800',
  },
});
