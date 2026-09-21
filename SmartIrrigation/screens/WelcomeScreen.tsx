import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator, 
  Image,
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows, Radii } from '../styles/Theme';
import { Sprout, Cpu, Droplets, Bot, ArrowRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useSmartIrrigation();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace('/(tabs)/home' as any);
    }
  }, [isLoggedIn, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Haut avec Dégradé Émeraude */}
      <LinearGradient
        colors={[Colors.primaryDark, '#0B4734', '#042C20']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topSection}
      >
        <View style={styles.decorBubble1} />
        <View style={styles.decorBubble2} />

        <View style={styles.logoBadgeContainer}>
          <View style={styles.logoHaloOuter}>
            <View style={styles.logoCircle}>
              <Image 
                source={require('../assets/images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        <View style={styles.topTagline}>
          <View style={styles.countryPill}>
            <Text style={styles.countryText}>IAI CAMEROUN • EXCELLENCE</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Carte Blanche Inférieure */}
      <View style={styles.bottomCard}>
        <View style={styles.brandTitleRow}>
          <Sprout size={24} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.brandTitle}>Smart<Text style={{ color: Colors.mint }}>Irrigation</Text></Text>
        </View>

        <Text style={styles.headline}>L'Agriculture de Précision Propulsée par l'IoT & l'IA</Text>
        <Text style={styles.subheadline}>
          Surveillez l'humidité du sol, anticipez la météo et automatisez l'arrosage pour préserver vos ressources et maximiser vos récoltes.
        </Text>

        {/* 3 Pilliers Fonctionnels Clés */}
        <View style={styles.featuresRow}>
          <View style={styles.featurePill}>
            <View style={[styles.featureIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <Cpu size={16} color={Colors.primary} />
            </View>
            <Text style={styles.featurePillText}>ESP32 IoT</Text>
          </View>

          <View style={styles.featurePill}>
            <View style={[styles.featureIconWrap, { backgroundColor: '#E0F2FE' }]}>
              <Droplets size={16} color={Colors.blue} />
            </View>
            <Text style={styles.featurePillText}>Arrosage Auto</Text>
          </View>

          <View style={styles.featurePill}>
            <View style={[styles.featureIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Bot size={16} color="#B45309" />
            </View>
            <Text style={styles.featurePillText}>IA Prédictive</Text>
          </View>
        </View>

        {/* Boutons d'Action */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => router.push('/login' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Accéder à la plateforme</Text>
            <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryBtn}
            onPress={() => router.push('/register' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryBtnText}>Créer un nouveau compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#042C20',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  topSection: {
    height: height * 0.44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  decorBubble1: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
  },
  decorBubble2: {
    position: 'absolute',
    bottom: 20,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(52, 211, 153, 0.06)',
  },
  logoBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoHaloOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  topTagline: {
    marginTop: 14,
  },
  countryPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radii.full,
  },
  countryText: {
    color: '#D1FAE5',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bottomCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 26,
    paddingTop: 30,
    paddingBottom: Platform.OS === 'ios' ? 40 : 26,
    justifyContent: 'space-between',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  headline: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -0.6,
    lineHeight: 30,
    marginTop: 12,
  },
  subheadline: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 8,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    marginBottom: 10,
  },
  featurePill: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  featurePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
  actionContainer: {
    gap: 12,
    marginTop: 10,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: Radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryBtn: {
    height: 48,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  secondaryBtnText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
