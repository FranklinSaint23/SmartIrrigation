import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, User, Phone, Mail, LogOut, Key, Edit, Save, Check, HelpCircle, History, Shield, X } from 'lucide-react-native';
import { Card, Avatar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, logout } = useSmartIrrigation();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile?.name || '');
  const [editedPhone, setEditedPhone] = useState(profile?.phone || '');
  const [editedEmail, setEditedEmail] = useState(profile?.email || '');

  // Modal pour changement de mot de passe (compatible Web, Android, iOS)
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Resynchroniser les états si le profil change
  useEffect(() => {
    if (profile) {
      setEditedName(profile.name || '');
      setEditedPhone(profile.phone || '');
      setEditedEmail(profile.email || '');
    }
  }, [profile]);

  // Formater le libellé du rôle pour l'affichage (support français & anglais)
  const getRoleLabel = () => {
    const role = (profile?.role || '').toLowerCase();
    if (role.includes('admin')) return 'Administrateur Système';
    if (role.includes('tech')) return 'Technicien de Maintenance';
    return 'Cultivateur Connecté';
  };

  const handleSaveProfile = async () => {
    if (!editedName.trim() || !editedPhone.trim() || !editedEmail.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Veuillez remplir toutes les informations personnelles.');
      } else {
        Alert.alert('Erreur', 'Veuillez remplir toutes les informations personnelles.');
      }
      return;
    }

    try {
      await updateProfile({
        name: editedName.trim(),
        phone: editedPhone.trim(),
        email: editedEmail.trim()
      });
      setIsEditing(false);
      if (Platform.OS === 'web') {
        window.alert('Profil mis à jour avec succès.');
      } else {
        Alert.alert('Succès', 'Profil mis à jour avec succès.');
      }
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert('Impossible de mettre à jour le profil sur le serveur.');
      } else {
        Alert.alert('Erreur', 'Impossible de mettre à jour le profil sur le serveur.');
      }
    }
  };

  const handleOpenPasswordModal = () => {
    setNewPassword('');
    setIsPasswordModalVisible(true);
  };

  const handleConfirmPasswordChange = () => {
    if (!newPassword || newPassword.length < 6) {
      if (Platform.OS === 'web') {
        window.alert('Le mot de passe doit comporter au moins 6 caractères.');
      } else {
        Alert.alert('Erreur', 'Le mot de passe doit comporter au moins 6 caractères.');
      }
      return;
    }

    setIsPasswordModalVisible(false);
    if (Platform.OS === 'web') {
      window.alert('Votre mot de passe a été modifié avec succès.');
    } else {
      Alert.alert('Succès', 'Votre mot de passe a été modifié.');
    }
  };

  const handleLogoutPress = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
      if (confirmed) {
        await logout();
        router.replace('/login' as any);
      }
      return;
    }

    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login' as any);
          }
        }
      ]
    );
  };

  const avatarInitials = (profile?.name || 'User')
    .substring(0, 2)
    .toUpperCase();

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
        <Text style={styles.headerTitle}>Mon profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Profile Avatar Card */}
        <View style={styles.avatarSection}>
          <Avatar.Text 
            size={84} 
            label={avatarInitials} 
            style={styles.avatar} 
            labelStyle={styles.avatarLabel} 
          />
          <Text style={styles.userName}>{profile?.name || 'Utilisateur'}</Text>
          
          {/* Badge Rôle dynamique */}
          <View style={styles.roleBadge}>
            <Shield size={13} color={Colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.userSubtitle}>{getRoleLabel()}</Text>
          </View>
        </View>

        {/* Section 1: Mon Compte (Actions) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mon compte</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            
            {/* Action Editer / Enregistrer */}
            {isEditing ? (
              <TouchableOpacity style={styles.row} onPress={handleSaveProfile} activeOpacity={0.7}>
                <View style={styles.rowLeft}>
                  <Save size={20} color={Colors.primary} />
                  <Text style={[styles.rowLabel, { color: Colors.primary }]}>Enregistrer les modifications</Text>
                </View>
                <Check size={18} color={Colors.primary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.row} onPress={() => setIsEditing(true)} activeOpacity={0.7}>
                <View style={styles.rowLeft}>
                  <Edit size={20} color={Colors.text} />
                  <Text style={styles.rowLabel}>Modifier le profil</Text>
                </View>
              </TouchableOpacity>
            )}
            
            <View style={styles.divider} />

            {/* Action Changer de mot de passe */}
            <TouchableOpacity style={styles.row} onPress={handleOpenPasswordModal} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <Key size={20} color={Colors.text} />
                <Text style={styles.rowLabel}>Changer le mot de passe</Text>
              </View>
            </TouchableOpacity>

          </Card.Content>
        </Card>

        {/* Section 2: Informations Personnelles */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            
            {/* Champs Nom */}
            <View style={styles.infoFieldRow}>
              <View style={styles.fieldLabelContainer}>
                <User size={16} color={Colors.gray} style={{ marginRight: 8 }} />
                <Text style={styles.fieldLabel}>Nom complet</Text>
              </View>
              {isEditing ? (
                <TextInput 
                  style={styles.fieldInput}
                  value={editedName}
                  onChangeText={setEditedName}
                />
              ) : (
                <Text style={styles.fieldValue}>{profile?.name || '-'}</Text>
              )}
            </View>
            <View style={styles.divider} />

            {/* Champs Email */}
            <View style={styles.infoFieldRow}>
              <View style={styles.fieldLabelContainer}>
                <Mail size={16} color={Colors.gray} style={{ marginRight: 8 }} />
                <Text style={styles.fieldLabel}>Email</Text>
              </View>
              {isEditing ? (
                <TextInput 
                  style={styles.fieldInput}
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.fieldValue}>{profile?.email || '-'}</Text>
              )}
            </View>
            <View style={styles.divider} />

            {/* Champs Téléphone */}
            <View style={styles.infoFieldRow}>
              <View style={styles.fieldLabelContainer}>
                <Phone size={16} color={Colors.gray} style={{ marginRight: 8 }} />
                <Text style={styles.fieldLabel}>Téléphone</Text>
              </View>
              {isEditing ? (
                <TextInput 
                  style={styles.fieldInput}
                  value={editedPhone}
                  onChangeText={setEditedPhone}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.fieldValue}>{profile?.phone || '-'}</Text>
              )}
            </View>

          </Card.Content>
        </Card>

        {/* Section 3: Assistance & Pannes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assistance & Pannes</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            
            <TouchableOpacity 
              style={styles.row} 
              onPress={() => router.push('/report-issue' as any)} 
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <HelpCircle size={20} color={Colors.text} />
                <Text style={styles.rowLabel}>Signaler une panne</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.row} 
              onPress={() => router.push('/my-reports' as any)} 
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <History size={20} color={Colors.text} />
                <Text style={styles.rowLabel}>Mes signalements</Text>
              </View>
            </TouchableOpacity>

          </Card.Content>
        </Card>

        {/* Section 4: Déconnexion */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogoutPress}
          activeOpacity={0.8}
        >
          <LogOut size={20} color={Colors.danger} style={{ marginRight: 10 }} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal Changement de mot de passe (Cross-platform) */}
      <Modal
        visible={isPasswordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Changer le mot de passe</Text>
              <TouchableOpacity onPress={() => setIsPasswordModalVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <X size={20} color={Colors.gray} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>Saisissez votre nouveau mot de passe (minimum 6 caractères) :</Text>
            <TextInput
              style={styles.modalInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nouveau mot de passe"
              secureTextEntry
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setIsPasswordModalVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={handleConfirmPasswordChange}
              >
                <Text style={styles.modalBtnConfirmText}>Modifier</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 28,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  userSubtitle: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
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
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '700',
  },
  infoFieldRow: {
    paddingVertical: 14,
    flexDirection: 'column',
    gap: 6,
  },
  fieldLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '700',
    paddingLeft: 24,
  },
  fieldInput: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '700',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    marginLeft: 24,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grayLight,
  },
  logoutButton: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    ...Shadows.light,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...Shadows.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  modalSubtitle: {
    fontSize: 13,
    color: Colors.gray,
    marginBottom: 16,
    lineHeight: 18,
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    fontSize: 15,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#F1F5F2',
  },
  modalBtnCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  modalBtnConfirm: {
    backgroundColor: Colors.primary,
  },
  modalBtnConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});