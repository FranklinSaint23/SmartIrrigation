import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, Camera, Image as ImageIcon, Send, CheckCircle2 } from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

const BREAKDOWN_TYPES = [
  'Pompe à eau',
  'ESP32',
  'Capteur d\'humidité',
  'Capteur de température',
  'Capteur de luminosité',
  'Capteur de niveau d\'eau',
  'Détecteur de pluie',
  'Relais',
  'Connexion Wi-Fi',
  'Autre'
];

export default function ReportIssueScreen() {
  const router = useRouter();
  const { reportBreakdown } = useSmartIrrigation();

  const [type, setType] = useState(BREAKDOWN_TYPES[0]);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSelectType = (selected: string) => {
    setType(selected);
    setShowDropdown(false);
  };

  const handleMockPhoto = (source: 'camera' | 'library') => {
    // Simulate attaching a photo using a high-quality placeholder image
    const demoPhotos = [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500',
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=500',
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=500'
    ];
    const chosen = demoPhotos[Math.floor(Math.random() * demoPhotos.length)];
    setPhoto(chosen);
    Alert.alert('Photo jointe', `Simulation de photo ${source === 'camera' ? 'prise' : 'sélectionnée'} avec succès.`);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Erreur', 'Veuillez décrire le problème rencontré.');
      return;
    }

    try {
      await reportBreakdown(type, description.trim(), photo || undefined);
      setSubmitted(true);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer le signalement.');
    }
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <StatusBar style="dark" />
        <CheckCircle2 size={80} color={Colors.primary} />
        <Text style={styles.successTitle}>Signalement envoyé</Text>
        <Text style={styles.successMessage}>
          Votre signalement a été envoyé avec succès. Un administrateur va attribuer un technicien pour résoudre votre problème dans les plus brefs délais.
        </Text>
        <TouchableOpacity 
          style={styles.successButton}
          onPress={() => router.replace('/my-reports')}
        >
          <Text style={styles.successButtonText}>Consulter mes signalements</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Signaler une panne</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.infoText}>
          Décrivez le problème rencontré avec votre système d'irrigation intelligent.
        </Text>

        {/* Picker / Dropdown */}
        <Text style={styles.label}>TYPE DE PANNE</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={styles.dropdownSelector}
            onPress={() => setShowDropdown(!showDropdown)}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownSelectorText}>{type}</Text>
          </TouchableOpacity>

          {showDropdown && (
            <Card style={styles.dropdownListCard}>
              <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                {BREAKDOWN_TYPES.map((t) => (
                  <TouchableOpacity 
                    key={t}
                    style={styles.dropdownItem}
                    onPress={() => handleSelectType(t)}
                  >
                    <Text style={styles.dropdownItemText}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Card>
          )}
        </View>

        {/* Text Input */}
        <Text style={styles.label}>DESCRIPTION DU PROBLÈME</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          placeholder="Détaillez le dysfonctionnement constaté (ex: la pompe ne démarre pas malgré une humidité basse)..."
          placeholderTextColor="#A0AEC0"
          value={description}
          onChangeText={setDescription}
        />

        {/* Image Attachment */}
        <Text style={styles.label}>PHOTO DU PROBLÈME (OPTIONNEL)</Text>
        {photo ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: photo }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => setPhoto(null)}>
              <Text style={styles.removeImageText}>Supprimer la photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoActionsRow}>
            <TouchableOpacity 
              style={styles.photoButton} 
              onPress={() => handleMockPhoto('camera')}
              activeOpacity={0.7}
            >
              <Camera size={20} color={Colors.primary} />
              <Text style={styles.photoButtonText}>Prendre une photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.photoButton} 
              onPress={() => handleMockPhoto('library')}
              activeOpacity={0.7}
            >
              <ImageIcon size={20} color={Colors.primary} />
              <Text style={styles.photoButtonText}>Choisir une photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Submit button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Send size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.submitButtonText}>ENVOYER LE SIGNALEMENT</Text>
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
    paddingTop: 24,
    paddingBottom: 40,
  },
  infoText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4A5568',
    marginBottom: 8,
    marginTop: 16,
  },
  dropdownContainer: {
    zIndex: 10,
    position: 'relative',
  },
  dropdownSelector: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    justifyContent: 'center',
    ...Shadows.light,
  },
  dropdownSelectorText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
  dropdownListCard: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.medium,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    height: 120,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    ...Shadows.light,
  },
  photoActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 14,
    ...Shadows.light,
  },
  photoButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  previewImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  removeImageButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.dangerLight,
  },
  removeImageText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.danger,
  },
  submitButton: {
    height: 52,
    backgroundColor: '#0D5C3A',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
    ...Shadows.light,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 8,
  },
  successMessage: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
    paddingHorizontal: 16,
  },
  successButton: {
    height: 52,
    backgroundColor: '#0D5C3A',
    borderRadius: 26,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    ...Shadows.light,
  },
  successButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
