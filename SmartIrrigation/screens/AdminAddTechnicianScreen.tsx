import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, User, Phone, Mail, MapPin, Wrench, Lock, Plus } from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

export default function AdminAddTechnicianScreen() {
  const router = useRouter();
  const { addTechnician } = useSmartIrrigation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !email.trim() || !city.trim() || !specialty.trim() || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      const success = await addTechnician({
        name: name.trim(),
        phone_number: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        specialty: specialty.trim(),
        password: password,
      });

      if (success) {
        Alert.alert('Succès', 'Technicien créé avec succès.');
        router.back();
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue lors de la création.');
      }
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de se connecter au serveur.');
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
        <Text style={styles.headerTitle}>Ajouter un technicien</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              
              {/* Name */}
              <Text style={styles.label}>NOM COMPLET</Text>
              <View style={styles.inputContainer}>
                <User size={18} color={Colors.gray} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Alain Tchoua"
                  placeholderTextColor="#A0AEC0"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Phone */}
              <Text style={styles.label}>TÉLÉPHONE</Text>
              <View style={styles.inputContainer}>
                <Phone size={18} color={Colors.gray} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: +237 6 55 44 33 22"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              {/* Email */}
              <Text style={styles.label}>ADRESSE EMAIL</Text>
              <View style={styles.inputContainer}>
                <Mail size={18} color={Colors.gray} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: alain@email.com"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* City */}
              <Text style={styles.label}>VILLE</Text>
              <View style={styles.inputContainer}>
                <MapPin size={18} color={Colors.gray} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Bafoussam"
                  placeholderTextColor="#A0AEC0"
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              {/* Specialty */}
              <Text style={styles.label}>SPÉCIALITÉ</Text>
              <View style={styles.inputContainer}>
                <Wrench size={18} color={Colors.gray} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Pompe & Hydraulique"
                  placeholderTextColor="#A0AEC0"
                  value={specialty}
                  onChangeText={setSpecialty}
                />
              </View>

              {/* Password */}
              <Text style={styles.label}>MOT DE PASSE</Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color={Colors.gray} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Minimum 6 caractères"
                  placeholderTextColor="#A0AEC0"
                  secureTextEntry
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {/* Confirm Password */}
              <Text style={styles.label}>CONFIRMER LE MOT DE PASSE</Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color={Colors.gray} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmer votre mot de passe"
                  placeholderTextColor="#A0AEC0"
                  secureTextEntry
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              {/* Submit button */}
              <TouchableOpacity 
                style={[styles.submitButton, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'CRÉATION...' : 'CRÉER LE TECHNICIEN'}
                </Text>
              </TouchableOpacity>

            </Card.Content>
          </Card>

        </ScrollView>
      </KeyboardAvoidingView>
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
    ...Shadows.light,
  },
  cardContent: {
    padding: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4A5568',
    marginBottom: 6,
    marginTop: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  submitButton: {
    height: 50,
    backgroundColor: '#0D5C3A',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    ...Shadows.light,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
