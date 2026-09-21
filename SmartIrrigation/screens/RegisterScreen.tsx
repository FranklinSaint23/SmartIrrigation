import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { User, Phone, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import Logo from '../components/Logo';

export default function RegisterScreen() {
  const router = useRouter();
  const { registerUser } = useSmartIrrigation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async () => {
    if (!name.trim() || !phone.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    const success = await registerUser(name.trim(), phone.trim(), email.trim(), password);
    setLoading(false);

    if (success) {
      Alert.alert(
        'Succès',
        'Votre compte a été créé avec succès.',
        [{ text: 'Se connecter', onPress: () => router.replace('/login' as any) }]
      );
    } else {
      Alert.alert('Erreur', 'Échec de la création de compte. Veuillez réessayer.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Back button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>

        {/* Logo centered */}
        <View style={styles.logoWrapper}>
          <Logo size={70} />
        </View>

        {/* Header */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Enregistrez votre ferme pour commencer l'irrigation connectée</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Nom */}
          <Text style={styles.label}>Nom complet</Text>
          <View style={styles.inputContainer}>
            <User size={18} color={Colors.gray} style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="Jean Agriculteur"
              placeholderTextColor={Colors.gray}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Téléphone */}
          <Text style={styles.label}>Téléphone</Text>
          <View style={styles.inputContainer}>
            <Phone size={18} color={Colors.gray} style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="+237 6 12 34 56 78"
              placeholderTextColor={Colors.gray}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Mail size={18} color={Colors.gray} style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="exemple@email.com"
              placeholderTextColor={Colors.gray}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.inputContainer}>
            <Lock size={18} color={Colors.gray} style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.gray}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} color={Colors.gray} /> : <Eye size={18} color={Colors.gray} />}
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <View style={styles.inputContainer}>
            <Lock size={18} color={Colors.gray} style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.gray}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} color={Colors.gray} /> : <Eye size={18} color={Colors.gray} />}
            </TouchableOpacity>
          </View>

          {/* Submit */}
          <TouchableOpacity 
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            onPress={handleRegisterSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Création...' : 'Créer un compte'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Déjà membre ? </Text>
          <TouchableOpacity onPress={() => router.push('/login' as any)}>
            <Text style={styles.loginLinkText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 6,
    fontWeight: '500',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 8,
  },
  submitButton: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    ...Shadows.light,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
  },
  loginLinkText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
  },
});
