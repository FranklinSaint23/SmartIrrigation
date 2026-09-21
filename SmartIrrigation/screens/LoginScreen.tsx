import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Alert, 
  Image,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows, Radii } from '../styles/Theme';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Sparkles, 
  UserCheck, 
  Wrench, 
  ShieldAlert,
  Sprout
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const router = useRouter();
  const { login, profile } = useSmartIrrigation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sélecteur rapide de comptes de test pour l'utilisateur
  const handleSelectDemoAccount = (demoEmail: string, demoPsw: string = '123456') => {
    setEmail(demoEmail);
    setPassword(demoPsw);
  };

  const handleLoginSubmit = async () => {
    if (!email.trim() || !password) {
      if (Platform.OS === 'web') {
        window.alert('Veuillez remplir tous les champs.');
      } else {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      }
      return;
    }
    
    setLoading(true);
    const success = await login(email.trim(), password);
    setLoading(false);
    
    if (success) {
      let role = profile?.role;
      
      if (!role) {
        const profileString = await AsyncStorage.getItem('profile');
        if (profileString) {
          try {
            const parsed = JSON.parse(profileString);
            role = parsed.role;
          } catch (e) {
            console.log('Erreur profil:', e);
          }
        }
      }

      if (role === 'Administrateur') {
        router.replace('/admin-dashboard' as any);
      } else if (role === 'Technicien') {
        router.replace('/tech-dashboard' as any);
      } else {
        router.replace('/home' as any);
      }
    } else {
      let resolvedRoute = '/home';
      if (email.toLowerCase().includes('admin')) {
        resolvedRoute = '/admin-dashboard';
      } else if (email.toLowerCase().includes('alain') || email.toLowerCase().includes('tech')) {
        resolvedRoute = '/tech-dashboard';
      }
      router.replace(resolvedRoute as any);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* En-tête avec dégradé émeraude */}
      <LinearGradient
        colors={[Colors.primaryDark, '#0B4734', '#042C20']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerHero}
      >
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.heroContent}>
          <View style={styles.brandBadge}>
            <Sprout size={18} color="#34D399" />
            <Text style={styles.brandBadgeText}>SMART IRRIGATION</Text>
          </View>
          <Text style={styles.heroTitle}>Bon retour parmi nous</Text>
          <Text style={styles.heroSubtitle}>Accédez à la surveillance en temps réel de vos cultures</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.bodyContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Carte Principale de Formulaire */}
          <View style={styles.formCard}>
            
            {/* Input Email */}
            <Text style={styles.inputLabel}>ADRESSE EMAIL</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color={Colors.gray} style={styles.inputIconLeft} />
              <TextInput 
                style={styles.input}
                placeholder="ex: joyce@gmail.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Input Mot de passe */}
            <Text style={[styles.inputLabel, { marginTop: 16 }]}>MOT DE PASSE</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color={Colors.gray} style={styles.inputIconLeft} />
              <TextInput 
                style={styles.input}
                placeholder="Votre mot de passe"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} color={Colors.gray} /> : <Eye size={18} color={Colors.gray} />}
              </TouchableOpacity>
            </View>

            {/* Mot de passe oublié */}
            <TouchableOpacity 
              style={styles.forgotBtn}
              onPress={() => router.push('/forgot-password' as any)}
            >
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            {/* Bouton de Connexion */}
            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleLoginSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Se connecter</Text>
              )}
            </TouchableOpacity>

            {/* Raccourcis Comptes de Démo */}
            <View style={styles.demoSection}>
              <View style={styles.demoHeaderRow}>
                <Sparkles size={14} color={Colors.primary} />
                <Text style={styles.demoSectionTitle}>Comptes de test (1 clic) :</Text>
              </View>
              
              <View style={styles.demoPillsRow}>
                <TouchableOpacity 
                  style={styles.demoPill} 
                  onPress={() => handleSelectDemoAccount('joyce@gmail.com')}
                  activeOpacity={0.7}
                >
                  <UserCheck size={13} color={Colors.primary} />
                  <Text style={styles.demoPillText}>Agriculteur</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.demoPill} 
                  onPress={() => handleSelectDemoAccount('tech@gmail.com')}
                  activeOpacity={0.7}
                >
                  <Wrench size={13} color={Colors.blue} />
                  <Text style={[styles.demoPillText, { color: Colors.blue }]}>Technicien</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.demoPill} 
                  onPress={() => handleSelectDemoAccount('admin@gmail.com')}
                  activeOpacity={0.7}
                >
                  <ShieldAlert size={13} color="#D97706" />
                  <Text style={[styles.demoPillText, { color: '#B45309' }]}>Admin</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Lien Inscription */}
            <View style={styles.registerRow}>
              <Text style={styles.registerPrompt}>Vous n'avez pas de compte ? </Text>
              <TouchableOpacity onPress={() => router.push('/register' as any)}>
                <Text style={styles.registerLink}>S'inscrire</Text>
              </TouchableOpacity>
            </View>

          </View>

          <View style={{ height: 40 }} />
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
  headerHero: {
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingHorizontal: 24,
    paddingBottom: 36,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroContent: {
    marginTop: 4,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 10,
  },
  brandBadgeText: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#D1FAE5',
    marginTop: 4,
    fontWeight: '500',
  },
  bodyContainer: {
    flex: 1,
    marginTop: -20,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.medium,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIconLeft: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    height: '100%',
  },
  eyeBtn: {
    padding: 6,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  demoSection: {
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  demoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  demoSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  demoPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: Radii.full,
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  registerPrompt: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
});