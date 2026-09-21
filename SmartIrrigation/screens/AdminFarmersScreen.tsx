import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, Search, User, Phone, Mail, ChevronRight, Sprout } from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

export default function AdminFarmersScreen() {
  const router = useRouter();
  const { farmers } = useSmartIrrigation();
  const [search, setSearch] = useState('');

  const filteredFarmers = farmers.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.email.toLowerCase().includes(search.toLowerCase())
  );

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
        <Text style={styles.headerTitle}>Gestion des Agriculteurs</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un agriculteur..."
            placeholderTextColor="#A0AEC0"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* List of Farmers */}
        <View style={styles.list}>
          {filteredFarmers.map((item, index) => (
            <TouchableOpacity 
              key={item.email}
              activeOpacity={0.9}
              onPress={() => router.push({ pathname: '/admin-farmer-detail', params: { id: index, name: item.name, email: item.email, phone: item.phone } } as any)}
            >
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.row}>
                    <View style={styles.left}>
                      <View style={styles.avatar}>
                        <User size={20} color={Colors.primary} />
                      </View>
                      <View style={styles.details}>
                        <Text style={styles.name}>{item.name}</Text>
                        <View style={styles.contactRow}>
                          <Phone size={12} color={Colors.gray} />
                          <Text style={styles.contactText}>{item.phone}</Text>
                        </View>
                        <View style={styles.contactRow}>
                          <Mail size={12} color={Colors.gray} />
                          <Text style={styles.contactText}>{item.email}</Text>
                        </View>
                        <View style={styles.farmBadge}>
                          <Sprout size={12} color={Colors.primary} style={{ marginRight: 4 }} />
                          <Text style={styles.farmText}>Exploitation : Ferme Jean</Text>
                        </View>
                      </View>
                    </View>
                    <ChevronRight size={18} color={Colors.gray} />
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
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
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
    ...Shadows.light,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
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
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  details: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
  },
  farmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  farmText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
});
