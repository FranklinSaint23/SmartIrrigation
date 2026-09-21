import React, { useState } from 'react'; // Importation de React et du hook useState pour la gestion des états locaux.
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, Image } from 'react-native'; // Importation des composants React Native indispensables.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // Importation du hook de navigation pour rediriger l'utilisateur.
import { useSmartIrrigation } from '../context/SmartIrrigationContext'; // Importation du contexte global de l'application.
import { Shadows } from '../styles/Theme'; // Importation des ombres personnalisées du thème.
import { Eye, EyeOff, ArrowLeft, CheckSquare, Square } from 'lucide-react-native'; // Importation des icônes Lucide nécessaires pour l'interface.
import { StatusBar } from 'expo-status-bar'; // Importation de la barre de statut Expo pour gérer sa couleur.

export default function LoginScreen() { // Déclaration du composant principal pour la page de connexion.
  const router = useRouter(); // Récupération de l'instance du routeur pour naviguer entre les pages.
  const { login, profile } = useSmartIrrigation(); // Récupération de la fonction de connexion et du profil courant depuis le contexte.
  
  const [email, setEmail] = useState(''); // Déclaration de l'état local pour stocker l'adresse email saisie.
  const [password, setPassword] = useState(''); // Déclaration de l'état local pour stocker le mot de passe saisi.
  const [showPassword, setShowPassword] = useState(false); // Déclaration de l'état local pour basculer la visibilité du mot de passe.
  const [rememberMe, setRememberMe] = useState(false); // Déclaration de l'état local pour la case "Se souvenir de moi".
  const [loading, setLoading] = useState(false); // Déclaration de l'état local pour gérer l'indicateur de chargement du bouton.

  const handleLoginSubmit = async () => { // Définition de la fonction de soumission du formulaire de connexion.
    if (!email.trim() || !password) { // Vérification si l'un des deux champs obligatoires est vide.
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.'); // Affichage d'une alerte si les champs ne sont pas remplis.
      return; // Interruption de la fonction si la condition n'est pas remplie.
    } // Fin de la condition de validation des champs.
    
    setLoading(true); // Activation de l'état de chargement lors de l'appel de l'API.
    const success = await login(email.trim(), password); // Appel de la fonction de connexion avec les identifiants saisis.
    setLoading(false); // Désactivation de l'état de chargement après la réponse de l'API.
    
    if (success) { // Si la connexion est établie avec succès.
      let role = profile?.role;
      
      if (!role) {
        const profileString = await AsyncStorage.getItem('profile');
        if (profileString) {
          try {
            const parsed = JSON.parse(profileString);
            role = parsed.role;
          } catch (e) {
            console.log('Erreur de lecture du profil stocké:', e);
          }
        }
      }

      if (role === 'Administrateur') {
        router.replace('/admin-dashboard');
      } else if (role === 'Technicien') {
        router.replace('/tech-dashboard');
      } else {
        router.replace('/home');
      }
    } else { // Si les identifiants sont erronés ou s'il y a un problème de réseau.
      Alert.alert('Erreur de connexion', 'Identifiants invalides ou serveur hors ligne. Mode Démo activé.'); // Alerte informant du mode démo.
      
      // Détermination de la route en mode démo selon le format de l'email
      let resolvedRoute = '/home';
      if (email.toLowerCase().includes('admin')) {
        resolvedRoute = '/admin-dashboard';
      } else if (email.toLowerCase().includes('alain') || email.toLowerCase().includes('tech')) {
        resolvedRoute = '/tech-dashboard';
      }
      
      router.replace(resolvedRoute as any); // Redirection sécurisée vers l'interface correspondante.
    } // Fin de la condition de succès ou d'échec de la connexion.
  }; // Fin de la fonction handleLoginSubmit.

  return ( // Début du rendu visuel du composant de connexion.
    <View style={styles.mainContainer}> {/* Conteneur racine de l'écran pour superposer l'en-tête et le clavier. */}
      <StatusBar style="light" /> {/* Barre de statut avec icônes de couleur claire (blanche). */}
      
      {/* Barre d'en-tête verte en haut */}
      <View style={styles.headerBar}> {/* Conteneur de la barre d'en-tête. */}
        <TouchableOpacity // Bouton pour retourner à l'écran précédent.
          style={styles.headerBackButton} // Style pour la position de la flèche de retour.
          onPress={() => router.back()} // Déclenchement du retour arrière dans l'historique lors du clic.
        > {/* Début du contenu du bouton de retour. */}
          <ArrowLeft size={24} color="#FFFFFF" /> {/* Flèche de retour blanche. */}
        </TouchableOpacity> {/* Fin du bouton de retour. */}
        <Text style={styles.headerTitle}>Connexion</Text> {/* Titre textuel blanc de l'en-tête. */}
      </View> {/* Fin de la barre d'en-tête. */}

      <KeyboardAvoidingView // Conteneur qui décale l'interface vers le haut lorsque le clavier apparaît.
        style={styles.avoidingContainer} // Style d'ajustement de la vue.
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Comportement dynamique selon la plateforme (iOS ou Android).
      > {/* Début du KeyboardAvoidingView. */}
        <ScrollView // Conteneur de défilement pour éviter les coupures sur les petits écrans.
          contentContainerStyle={styles.scrollContent} // Style de remplissage et alignement pour le ScrollView.
          keyboardShouldPersistTaps="handled" // Permet de masquer le clavier lors du clic en dehors des inputs.
        > {/* Début du ScrollView. */}
          
          {/* Logo de l'application centré au-dessus de la carte */}
          <View style={styles.logoWrapper}> {/* Conteneur pour centrer le boîtier du logo. */}
            <View style={styles.logoContainer}> {/* Boîtier blanc avec coins arrondis et bordure fine pour le logo. */}
              <Image // Composant Image pour afficher le logo.
                source={require('../assets/images/logo.png')} // Source locale de l'image de notre logo.
                style={styles.logoImage} // Style pour fixer la taille et ajuster le logo.
              /> {/* Fin du composant Image. */}
            </View> {/* Fin du boîtier du logo. */}
          </View> {/* Fin du conteneur du logo. */}

          {/* Carte blanche de connexion contenant les inputs et le bouton */}
          <View style={styles.card}> {/* Boîtier blanc avec ombres et coins arrondis. */}
            <Text style={styles.cardTitle}>Connexion</Text> {/* Titre principal de la carte de connexion. */}

            {/* Label adresse email */}
            <Text style={styles.label}>ADRESSE EMAIL</Text> {/* Label en majuscules pour le champ email. */}
            
            {/* Conteneur pour le champ de saisie email */}
            <View style={styles.inputContainer}> {/* Conteneur d'input avec bordure. */}
              <TextInput // Champ de saisie de texte pour l'email.
                style={styles.input} // Style de police et hauteur de l'input.
                placeholder="ex: joyce@gmail.com" // Texte indicatif en arrière-plan.
                placeholderTextColor="#A0AEC0" // Couleur grise du texte indicatif.
                keyboardType="email-address" // Clavier optimisé pour la saisie des adresses email.
                autoCapitalize="none" // Désactivation des majuscules automatiques.
                value={email} // Liaison de la valeur de l'input à l'état local email.
                onChangeText={setEmail} // Mise à jour de l'état email à chaque frappe.
              /> {/* Fin du TextInput d'email. */}
            </View> {/* Fin du conteneur d'input email. */}

            {/* Label mot de passe */}
            <Text style={styles.label}>MOT DE PASSE</Text> {/* Label pour le mot de passe. */}
            
            {/* Conteneur pour le champ de saisie mot de passe */}
            <View style={styles.inputContainer}> {/* Conteneur d'input avec icône d'œil à droite. */}
              <TextInput // Champ de saisie pour le mot de passe.
                style={styles.input} // Style d'input textuel.
                placeholder="Votre mot de passe" // Texte indicatif pour le mot de passe.
                placeholderTextColor="#A0AEC0" // Couleur grise du texte indicatif.
                secureTextEntry={!showPassword} // Masquage des caractères si showPassword est faux.
                autoCapitalize="none" // Pas de majuscule automatique pour le mot de passe.
                value={password} // Liaison de la valeur à l'état local password.
                onChangeText={setPassword} // Mise à jour de l'état password à chaque frappe.
              /> {/* Fin du TextInput de mot de passe. */}
              <TouchableOpacity // Bouton cliquable pour masquer/afficher le mot de passe.
                style={styles.eyeButton} // Zone de clic pour l'icône de l'œil.
                onPress={() => setShowPassword(!showPassword)} // Inversion de l'état showPassword au clic.
              > {/* Début du contenu du bouton. */}
                {showPassword ? <EyeOff size={20} color="#718096" /> : <Eye size={20} color="#718096" />} {/* Rendu dynamique de l'icône selon la visibilité. */}
              </TouchableOpacity> {/* Fin du bouton cliquable de l'œil. */}
            </View> {/* Fin du conteneur d'input mot de passe. */}

            {/* Rangée : Se souvenir de moi (gauche) & Mot de passe oublié (droite) */}
            <View style={styles.optionsRow}> {/* Alignement horizontal des deux options sous le mot de passe. */}
              <TouchableOpacity 
                style={styles.rememberMeContainer} 
                onPress={() => setRememberMe(!rememberMe)} // Inversion de l'état "Se souvenir de moi".
                activeOpacity={0.7}
              > {/* Option Se souvenir de moi à gauche. */}
                {rememberMe ? (
                  <CheckSquare size={18} color="#0D5C3A" />
                ) : (
                  <Square size={18} color="#A0AEC0" />
                )}
                <Text style={styles.rememberMeText}>Se souvenir de moi</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/forgot-password')}> {/* Option Mot de passe oublié à droite. */}
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            </View> {/* Fin de la rangée des options. */}

            {/* Bouton de soumission du formulaire de connexion */}
            <TouchableOpacity // Bouton tactile de connexion.
              style={[styles.submitButton, loading && { opacity: 0.7 }]} // Style du bouton avec réduction d'opacité en cas de chargement.
              onPress={handleLoginSubmit} // Appel de la fonction de soumission lors du clic.
              disabled={loading} // Désactivation du bouton si un chargement est en cours.
              activeOpacity={0.8} // Opacité visuelle lors du clic pour le retour utilisateur.
            > {/* Début du contenu du bouton. */}
              <Text style={styles.submitButtonText}> {/* Texte du bouton de connexion. */}
                {loading ? 'CONNEXION...' : 'SE CONNECTER'} {/* Affichage du texte en majuscules avec état de chargement dynamique. */}
              </Text> {/* Fin du texte du bouton. */}
            </TouchableOpacity> {/* Fin du bouton de connexion. */}
          </View> {/* Fin de la carte blanche de connexion. */}

          {/* Lien du bas pour créer un nouveau compte */}
          <View style={styles.footer}> {/* Conteneur du pied de page. */}
            <Text style={styles.footerText}>Nouveau agriculteur ? </Text> {/* Texte d'invitation gris pour s'enregistrer. */}
            <TouchableOpacity onPress={() => router.push('/register')}> {/* Bouton tactile redirigeant vers l'inscription. */}
              <Text style={styles.registerLinkText}>Créer un compte</Text> {/* Texte cliquable en couleur verte forêt. */}
            </TouchableOpacity> {/* Fin du bouton d'inscription. */}
          </View> {/* Fin du pied de page. */}
        </ScrollView> {/* Fin du ScrollView. */}
      </KeyboardAvoidingView> {/* Fin du KeyboardAvoidingView. */}
    </View> // Fin du conteneur racine.
  ); // Fin du retour de la vue principale.
} // Fin de la déclaration du composant LoginScreen.

const styles = StyleSheet.create({ // Création des styles CSS-in-JS pour la page de connexion.
  mainContainer: { // Style du conteneur principal à la racine de la page.
    flex: 1, // Utilisation de tout l'espace d'écran.
    backgroundColor: '#F8F9FA', // Couleur de fond gris clair/bleuté pour faire ressortir la carte blanche.
  }, // Fin du style mainContainer.
  headerBar: { // Style de la barre d'en-tête verte en haut.
    flexDirection: 'row', // Alignement horizontal des éléments de l'en-tête (flèche et titre).
    alignItems: 'center', // Alignement vertical au centre.
    height: 90, // Hauteur de la barre d'en-tête incluant l'espace de la barre de statut.
    paddingTop: 40, // Rembourrage supérieur pour décaler sous la barre de statut.
    paddingHorizontal: 16, // Rembourrage sur les côtés pour espacer la flèche de retour.
    backgroundColor: '#0D5C3A', // Couleur de fond vert forêt foncé (identique à l'accueil).
  }, // Fin du style headerBar.
  headerBackButton: { // Style pour la zone tactile du bouton de retour dans l'en-tête.
    marginRight: 16, // Marge à droite pour créer un espace avec le titre de la page.
    padding: 4, // Rembourrage interne pour faciliter le clic.
  }, // Fin du style headerBackButton.
  headerTitle: { // Style pour le texte de titre de l'en-tête.
    fontSize: 20, // Taille de la police pour un titre visible.
    fontWeight: '800', // Police très grasse.
    color: '#FFFFFF', // Couleur blanche pour le contraste sur fond vert.
  }, // Fin du style headerTitle.
  avoidingContainer: { // Style pour le conteneur d'évitement de clavier.
    flex: 1, // Utilisation de tout l'espace restant sous l'en-tête.
  }, // Fin du style avoidingContainer.
  scrollContent: { // Style pour le conteneur interne de défilement.
    flexGrow: 1, // Permet au conteneur de grandir si nécessaire pour combler l'espace.
    paddingHorizontal: 24, // Marge de sécurité de chaque côté de la page.
    paddingTop: 30, // Rembourrage en haut pour décoller le logo de l'en-tête.
    paddingBottom: 40, // Rembourrage en bas pour éviter que le footer soit tronqué.
    alignItems: 'center', // Centrage horizontal de tous les éléments enfants (logo, carte, footer).
  }, // Fin du style scrollContent.
  logoWrapper: { // Style pour encadrer le logo.
    marginBottom: 30, // Espace sous le logo avant la carte de formulaire.
  }, // Fin du style logoWrapper.
  logoContainer: { // Style du boîtier blanc contenant l'image de notre logo.
    width: 130, // Largeur du boîtier de logo carré.
    height: 130, // Hauteur du boîtier de logo.
    borderRadius: 20, // Coins arrondis du boîtier pour l'esthétique moderne.
    backgroundColor: '#FFFFFF', // Fond blanc opaque.
    alignItems: 'center', // Centrage horizontal du logo.
    justifyContent: 'center', // Centrage vertical du logo.
    borderWidth: 1, // Épaisseur de la bordure fine.
    borderColor: '#E2E8F0', // Couleur de bordure gris clair.
    overflow: 'hidden', // Rognage des parties du logo qui dépassent.
    ...Shadows.light, // Application d'une ombre douce.
  }, // Fin du style logoContainer.
  logoImage: { // Style pour le logo lui-même à l'intérieur du boîtier.
    width: 110, // Largeur de l'image.
    height: 110, // Hauteur de l'image.
    resizeMode: 'contain', // Redimensionnement pour s'adapter à la boîte sans distorsion.
  }, // Fin du style logoImage.
  card: { // Style de la carte blanche contenant le formulaire de connexion.
    width: '100%', // La carte occupe toute la largeur disponible de la page.
    backgroundColor: '#FFFFFF', // Couleur de fond blanche de la carte.
    borderRadius: 20, // Bords de la carte arrondis.
    padding: 24, // Remplissage interne pour aérer les champs de saisie.
    borderWidth: 1, // Bordure très fine.
    borderColor: '#E2E8F0', // Couleur de bordure grise pour définir la carte.
    ...Shadows.medium, // Application d'une ombre intermédiaire.
  }, // Fin du style card.
  cardTitle: { // Style pour le titre interne de la carte.
    fontSize: 24, // Taille de la police intermédiaire.
    fontWeight: '800', // Police très grasse.
    color: '#1A202C', // Couleur sombre presque noire.
    marginBottom: 20, // Espacement sous le titre avant le premier label.
    textAlign: 'center', // Centrage du texte dans la carte.
  }, // Fin du style cardTitle.
  label: { // Style pour les labels au-dessus des champs de saisie.
    fontSize: 12, // Taille de police petite.
    fontWeight: '800', // Police très grasse pour ressortir.
    color: '#4A5568', // Couleur grise foncée.
    marginBottom: 8, // Espace entre le label et le champ d'input correspondant.
    marginTop: 16, // Marge supérieure pour espacer les blocs de champs.
  }, // Fin du style label.
  inputContainer: { // Style pour le boîtier contenant le TextInput.
    flexDirection: 'row', // Alignement en ligne pour intégrer l'icône d'œil sur la même ligne.
    alignItems: 'center', // Alignement vertical au centre.
    backgroundColor: '#FFFFFF', // Fond blanc.
    borderRadius: 14, // Coins de l'input arrondis.
    height: 52, // Hauteur confortable de saisie de 52 pixels.
    paddingHorizontal: 16, // Espacement interne de sécurité sur les côtés.
    borderWidth: 1.5, // Bordure de l'input.
    borderColor: '#E2E8F0', // Couleur de bordure grise claire standard.
  }, // Fin du style inputContainer.
  input: { // Style pour le champ de texte saisissable lui-même.
    flex: 1, // L'input occupe tout l'espace disponible dans son conteneur parent.
    fontSize: 15, // Taille de police lisible pour la saisie.
    color: '#2D3748', // Couleur du texte saisi (sombre).
    fontWeight: '500', // Poids moyen de la police.
  }, // Fin du style input.
  eyeButton: { // Style pour le bouton tactile de visibilité du mot de passe.
    padding: 8, // Rembourrage interne pour faciliter le tapotage.
  }, // Fin du style eyeButton.
  optionsRow: { // Style de la ligne contenant Se souvenir de moi et Mot de passe oublié.
    flexDirection: 'row', // Alignement horizontal des deux éléments.
    justifyContent: 'space-between', // Espace dynamique (gauche et droite).
    alignItems: 'center', // Alignement vertical au centre.
    marginTop: 12, // Espacement juste en dessous du champ de mot de passe.
  }, // Fin du style optionsRow.
  rememberMeContainer: { // Style du bouton d'option Se souvenir de moi.
    flexDirection: 'row', // Alignement horizontal de l'icône et du texte.
    alignItems: 'center', // Alignement vertical au centre.
  }, // Fin du style rememberMeContainer.
  rememberMeText: { // Style du texte Se souvenir de moi.
    fontSize: 13, // Taille de police.
    color: '#4A5568', // Couleur grise foncée.
    fontWeight: '600', // Police semi-grasse.
    marginLeft: 6, // Espace entre la case et le texte.
  }, // Fin du style rememberMeText.
  forgotPasswordText: { // Style du lien Mot de passe oublié.
    fontSize: 13, // Même taille de police pour la cohérence.
    color: '#0D5C3A', // Couleur vert forêt foncée pour le lien.
    fontWeight: '700', // Police grasse.
  }, // Fin du style forgotPasswordText.
  submitButton: { // Style pour le bouton vert de connexion.
    height: 52, // Hauteur identique à celle des inputs pour l'harmonie visuelle.
    backgroundColor: '#0D5C3A', // Couleur de fond vert forêt foncé (identique à l'accueil).
    borderRadius: 26, // Bords en forme de pilule pour correspondre au bouton Commencer.
    alignItems: 'center', // Centrage horizontal du texte du bouton.
    justifyContent: 'center', // Centrage vertical du texte du bouton.
    marginTop: 24, // Espacement ajusté au-dessus du bouton.
    ...Shadows.light, // Ombre légère sous le bouton.
  }, // Fin du style submitButton.
  submitButtonText: { // Style pour le texte à l'intérieur du bouton de soumission.
    color: '#FFFFFF', // Couleur de texte blanche pour un contraste optimal.
    fontSize: 16, // Taille de police lisible.
    fontWeight: '700', // Police grasse.
  }, // Fin du style submitButtonText.
  footer: { // Style pour le conteneur du lien sous la carte.
    flexDirection: 'row', // Alignement horizontal des deux parties de texte.
    justifyContent: 'center', // Centrage horizontal complet.
    alignItems: 'center', // Alignement vertical au centre.
    marginTop: 30, // Espacement par rapport au bas de la carte.
  }, // Fin du style footer.
  footerText: { // Style du texte standard dans le pied de page.
    fontSize: 14, // Taille standard.
    color: '#718096', // Couleur grise.
    fontWeight: '600', // Police semi-grasse.
  }, // Fin du style footerText.
  registerLinkText: { // Style du lien d'inscription cliquable.
    fontSize: 14, // Même taille que le reste du pied de page.
    color: '#0D5C3A', // Couleur vert forêt foncée pour le lien.
    fontWeight: '800', // Police très grasse pour l'identifier comme un bouton d'action.
  }, // Fin du style registerLinkText.
}); // Fin de la création de la feuille de style.