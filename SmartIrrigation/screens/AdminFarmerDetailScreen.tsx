import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, User, Phone, Mail, Sprout, Cpu, MapPin, Layers } from 'lucide-react-native';
import { Card, Avatar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

export default function AdminFarmerDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const name = (params.name as string) || 'Jean Agriculteur';
  const email = (params.email as string) || 'jean@email.com';
  const phone = (params.phone as string) || '+237 6 12 34 56 78';

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
        <Text style={styles.headerTitle}>Fiche Agriculteur</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <View style={styles.avatarSection}>
          <Avatar.Text 
            size={80} 
            label={name.substring(0, 2).toUpperCase()} 
            style={styles.avatar} 
            labelStyle={styles.avatarLabel} 
          />
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userSubtitle}>Membre actif depuis mars 2025</Text>
        </View>

        {/* Section 1: Informations de contact */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informations de contact</Text>
        </View>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Phone size={18} color={Colors.gray} />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Téléphone</Text>
                <Text style={styles.infoValue}>{phone}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Mail size={18} color={Colors.gray} />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Adresse Email</Text>
                <Text style={styles.infoValue}>{email}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Section 2: Exploitation agricole */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exploitation agricole</Text>
        </View>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Sprout size={18} color={Colors.gray} />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Nom de la ferme</Text>
                <Text style={styles.infoValue}>Ferme Jean</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <MapPin size={18} color={Colors.gray} />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Localisation</Text>
                <Text style={styles.infoValue}>Ouest, Cameroun (Bafoussam)</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Layers size={18} color={Colors.gray} />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Cultures principales</Text>
                <Text style={styles.infoValue}>Tomates, Pommes de terre, Maïs</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Section 3: Appareil connecté */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Matériel IoT Associé</Text>
        </View>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Cpu size={18} color={Colors.primary} />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Boîtier Contrôleur</Text>
                <Text style={styles.infoValue}>ESP32-IRR-01</Text>
              </View>
              <View style={styles.onlineBadge}>
                <Text style={styles.onlineText}>En ligne</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <TouchableOpacity 
          style={styles.historyBtn}
          onPress={() => router.push('/admin-interventions')}
        >
          <Text style={styles.historyBtnText}>Voir l'historique des pannes</Text>
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: Colors.successLight,
    marginBottom: 12,
    ...Shadows.light,
  },
  avatarLabel: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 26,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  userSubtitle: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
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
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoCol: {
    marginLeft: 12,
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '700',
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '700',
  },
  onlineBadge: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.success,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  onlineText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grayLight,
  },
  historyBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    ...Shadows.light,
  },
  historyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
});
