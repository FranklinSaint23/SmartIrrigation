import React, { useEffect } from 'react'; // Importation de React et de useEffect pour les effets secondaires.
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ActivityIndicator, Image } from 'react-native'; // Importation des composants natifs de React Native.
import { useRouter } from 'expo-router'; // Importation du routeur d'Expo pour la navigation.
import { useSmartIrrigation } from '../context/SmartIrrigationContext'; // Importation du contexte personnalisé de l'application.
import { Shadows } from '../styles/Theme'; // Importation des styles d'ombres du thème de l'application.
import { StatusBar } from 'expo-status-bar'; // Importation de la barre de statut Expo pour contrôler son apparence.

const { width, height } = Dimensions.get('window'); // Récupération des dimensions de l'écran de l'utilisateur.

export default function WelcomeScreen() { // Déclaration du composant principal de l'écran de bienvenue.
  const router = useRouter(); // Initialisation du hook de navigation pour rediriger l'utilisateur.
  const { isLoggedIn, isLoading } = useSmartIrrigation(); // Récupération de l'état de connexion et de chargement depuis le contexte.

  useEffect(() => { // Hook d'effet secondaire pour vérifier l'état de connexion de l'utilisateur.
    if (!isLoading && isLoggedIn) { // Si le chargement est fini et que l'utilisateur est déjà connecté.
      router.replace('/(tabs)/home' as any); // Redirection automatique vers la page d'accueil de l'application.
    } // Fin de la condition de redirection.
  }, [isLoggedIn, isLoading]); // Exécution de l'effet lorsque l'état de connexion ou de chargement change.

  if (isLoading) { // Affichage d'un indicateur de chargement si l'application récupère les données de session.
    return ( // Retour de la vue de chargement temporaire.
      <View style={styles.loadingContainer}> {/* Conteneur centré pour le chargement. */}
        <ActivityIndicator size="large" color="#0D5C3A" /> {/* Icône de chargement circulaire de couleur verte. */}
      </View> // Fin du conteneur de chargement.
    ); // Fin du retour de la vue de chargement.
  } // Fin du bloc de chargement.

  return ( // Retour de la vue principale de l'écran de bienvenue si non connecté.
    <View style={styles.container}> {/* Conteneur principal de l'écran. */}
      <StatusBar style="light" /> {/* Barre de statut avec icônes blanches car le fond du haut est vert foncé. */}
      
      {/* Partie supérieure verte avec le logo */}
      <View style={styles.topContainer}> {/* Conteneur de la section supérieure verte. */}
        <View style={styles.decorCircleLeft} /> {/* Cercle décoratif flou en haut à gauche. */}
        <View style={styles.decorCircleRight} /> {/* Cercle décoratif flou en haut à droite. */}
        
        {/* Auréoles et Logo au centre */}
        <View style={styles.haloOuter}> {/* Première auréole blanche semi-transparente externe. */}
          <View style={styles.haloInner}> {/* Deuxième auréole blanche semi-transparente interne. */}
            <View style={styles.logoCircle}> {/* Cercle blanc opaque contenant l'image du logo de l'application. */}
              <Image // Composant image pour afficher le logo.
                source={require('../assets/images/logo.png')} // Chargement de l'image locale PNG du logo de l'application.
                style={styles.logoImage} // Style de redimensionnement pour l'image du logo.
              /> {/* Fin du composant image. */}
            </View> {/* Fin du cercle blanc du logo. */}
          </View> {/* Fin de l'auréole interne. */}
        </View> {/* Fin de l'auréole externe. */}
      </View> {/* Fin de la section supérieure verte. */}

      {/* Carte blanche inférieure pour les informations de bienvenue */}
      <View style={styles.card}> {/* Conteneur de la carte blanche arrondie. */}
        <View style={styles.brandContainer}> {/* Conteneur du titre de l'application et du pays. */}
          <Text style={styles.brandTitle}>SmartIrrigation</Text> {/* Titre de l'application en vert forêt foncé. */}
          <Text style={styles.brandCountry}>CAMEROUN</Text> {/* Nom du pays en rouge vif avec espacement des lettres. */}
          <View style={styles.yellowBar} /> {/* Petite ligne horizontale de séparation jaune orangé. */}
        </View> {/* Fin du conteneur de marque. */}

        <Text style={styles.title}>Bienvenue !</Text> {/* Message de salutation principal en grand et gras. */}
        
        <Text style={styles.description}> {/* Paragraphe de description expliquant l'objectif de l'application. */}
          Optimisez l'irrigation de vos cultures en quelques secondes. {/* Texte de description personnalisé pour l'irrigation. */}
        </Text> {/* Fin de la description. */}

        {/* Ligne contenant les trois images de composants clés (ESP32, Pompe, Capteur) */}
        <View style={styles.componentsRow}> {/* Conteneur horizontal pour aligner les composants d'irrigation. */}
          <View style={styles.componentItem}> {/* Bloc du composant pour la carte ESP32. */}
            <View style={styles.componentImageWrapper}> {/* Conteneur circulaire pour l'image de la carte. */}
              <Image // Composant Image.
                source={require('../assets/images/esp32.png')} // Chargement du fichier image de la puce ESP32.
                style={styles.componentImage} // Application des dimensions de l'image.
              /> {/* Fin du composant Image. */}
            </View> {/* Fin du conteneur circulaire. */}
            <Text style={styles.componentLabel}>ESP32</Text> {/* Libellé textuel sous l'icône de l'ESP32. */}
          </View> {/* Fin du bloc du composant. */}

          <View style={styles.componentItem}> {/* Bloc du composant pour la pompe d'irrigation. */}
            <View style={styles.componentImageWrapper}> {/* Conteneur de l'image de la pompe. */}
              <Image // Composant Image.
                source={require('../assets/images/pump.png')} // Chargement du fichier image de la pompe.
                style={styles.componentImage} // Dimensions.
              /> {/* Fin de l'image. */}
            </View> {/* Fin du conteneur. */}
            <Text style={styles.componentLabel}>Pompe à eau</Text> {/* Libellé sous la pompe. */}
          </View> {/* Fin du bloc. */}

          <View style={styles.componentItem}> {/* Bloc du composant pour le capteur physique. */}
            <View style={styles.componentImageWrapper}> {/* Conteneur circulaire de l'image. */}
              <Image // Composant Image.
                source={require('../assets/images/sensor.png')} // Chargement du fichier image du capteur thermique.
                style={styles.componentImage} // Dimensions.
              /> {/* Fin de l'image. */}
            </View> {/* Fin du conteneur. */}
            <Text style={styles.componentLabel}>Capteur Temp</Text> {/* Libellé sous le capteur. */}
          </View> {/* Fin du bloc. */}
        </View> {/* Fin de la rangée des composants. */}

        {/* Bouton pour passer à l'écran de connexion */}
        <TouchableOpacity // Composant tactile interactif pour le bouton d'action.
          style={styles.button} // Styles du bouton vert arrondi.
          activeOpacity={0.8} // Opacité lors du clic pour un retour visuel fluide.
          onPress={() => router.push('/login' as any)} // Navigation vers l'écran de connexion lors du clic.
        > {/* Début du contenu du bouton. */}
          <Text style={styles.buttonText}>COMMENCER</Text> {/* Texte du bouton en majuscules et en blanc. */}
        </TouchableOpacity> {/* Fin du bouton tactile. */}
      </View> {/* Fin de la carte blanche. */}
    </View> // Fin du conteneur principal de l'écran.
  ); // Fin du retour de la vue principale.
} // Fin de la déclaration du composant WelcomeScreen.

const styles = StyleSheet.create({ // Création des styles CSS-in-JS pour l'écran.
  container: { // Style du conteneur global de l'écran.
    flex: 1, // Utilisation de tout l'espace disponible de l'écran.
    backgroundColor: '#FFFFFF', // Couleur de fond blanche de l'écran.
    alignItems: 'center', // Alignement des enfants horizontalement au centre.
  }, // Fin du style container.
  loadingContainer: { // Style du conteneur de l'indicateur de chargement.
    flex: 1, // Utilisation de tout l'espace disponible de l'écran.
    backgroundColor: '#FFFFFF', // Couleur de fond blanche.
    alignItems: 'center', // Alignement horizontal au centre.
    justifyContent: 'center', // Alignement vertical au centre.
  }, // Fin du style loadingContainer.
  topContainer: { // Style du conteneur vert supérieur de l'écran.
    width: width, // Largeur égale à la largeur complète de l'écran.
    height: height * 0.44, // Hauteur occupant 44% de l'écran.
    backgroundColor: '#0D5C3A', // Couleur de fond vert forêt foncé.
    alignItems: 'center', // Alignement horizontal des enfants au centre.
    justifyContent: 'center', // Alignement vertical des enfants au centre.
    position: 'relative', // Position relative pour permettre le placement absolu des cercles décoratifs.
    overflow: 'hidden', // Masquage des parties des cercles décoratifs qui dépassent.
  }, // Fin du style topContainer.
  decorCircleLeft: { // Style du cercle décoratif flou en haut à gauche.
    position: 'absolute', // Positionnement absolu par rapport au conteneur parent.
    top: -50, // Décalage de 50 pixels vers le haut de l'écran.
    left: -50, // Décalage de 50 pixels vers la gauche de l'écran.
    width: 150, // Largeur du cercle décoratif.
    height: 150, // Hauteur du cercle décoratif.
    borderRadius: 75, // Rayon pour former un cercle parfait.
    backgroundColor: '#FFFFFF', // Couleur blanche pour le cercle.
    opacity: 0.08, // Très faible opacité de 8% pour un effet visuel discret.
  }, // Fin du style decorCircleLeft.
  decorCircleRight: { // Style du cercle décoratif flou en haut à droite.
    position: 'absolute', // Positionnement absolu par rapport au conteneur parent.
    top: 20, // Décalage de 20 pixels vers le bas depuis le haut.
    right: -40, // Décalage de 40 pixels vers la droite en dehors de l'écran.
    width: 100, // Largeur du cercle décoratif.
    height: 100, // Hauteur du cercle décoratif.
    borderRadius: 50, // Rayon pour former un cercle.
    backgroundColor: '#FFFFFF', // Couleur blanche pour le cercle.
    opacity: 0.08, // Faible opacité de 8%.
  }, // Fin du style decorCircleRight.
  haloOuter: { // Style de l'auréole blanche externe entourant le logo.
    width: 240, // Largeur de l'auréole externe (augmentée pour agrandir le logo).
    height: 240, // Hauteur de l'auréole externe (augmentée pour agrandir le logo).
    borderRadius: 120, // Rayon de 120 pour former un cercle parfait de 240px de diamètre.
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Fond blanc avec une opacité de 8%.
    alignItems: 'center', // Centrage horizontal de l'auréole interne.
    justifyContent: 'center', // Centrage vertical de l'auréole interne.
  }, // Fin du style haloOuter.
  haloInner: { // Style de l'auréole blanche interne entourant directement le logo.
    width: 180, // Largeur de l'auréole interne (augmentée pour conserver les proportions).
    height: 180, // Hauteur de l'auréole interne (augmentée pour conserver les proportions).
    borderRadius: 90, // Rayon de 90 pour former un cercle de 180px de diamètre.
    backgroundColor: 'rgba(255, 255, 255, 0.12)', // Fond blanc avec une opacité de 12%.
    alignItems: 'center', // Centrage horizontal du cercle de logo.
    justifyContent: 'center', // Centrage vertical du cercle de logo.
  }, // Fin du style haloInner.
  logoCircle: { // Style du cercle blanc opaque contenant l'image du logo.
    width: 130, // Largeur du conteneur du logo (agrandie pour un logo plus imposant).
    height: 130, // Hauteur du conteneur du logo (agrandie pour un logo plus imposant).
    borderRadius: 65, // Rayon de 65 pour faire un cercle parfait de 130px de diamètre.
    backgroundColor: '#FFFFFF', // Couleur blanche opaque.
    alignItems: 'center', // Centrage horizontal du logo.
    justifyContent: 'center', // Centrage vertical du logo.
    overflow: 'hidden', // Rognage de l'image pour qu'elle ne dépasse pas du cercle.
    ...Shadows.light, // Application de l'ombre légère définie dans le thème.
  }, // Fin du style logoCircle.
  logoImage: { // Style pour l'image du logo à l'intérieur du cercle.
    width: 110, // Largeur de l'image (agrandie tout en conservant son ratio).
    height: 110, // Hauteur de l'image (agrandie tout en conservant son ratio).
    resizeMode: 'contain', // Redimensionnement de l'image en conservant son ratio.
  }, // Fin du style logoImage.
  card: { // Style de la carte blanche contenant les textes et le bouton.
    flex: 1, // Utilisation de tout l'espace restant en hauteur.
    width: width, // Largeur complète de l'écran.
    backgroundColor: '#FFFFFF', // Fond blanc.
    borderTopLeftRadius: 40, // Arrondi prononcé du coin supérieur gauche.
    borderTopRightRadius: 40, // Arrondi prononcé du coin supérieur droite.
    paddingTop: 35, // Espace de rembourrage en haut de la carte.
    paddingHorizontal: 24, // Espace de rembourrage sur les côtés de la carte.
    alignItems: 'center', // Alignement des enfants au centre.
    marginTop: -35, // Décalage négatif pour chevaucher la section verte.
  }, // Fin du style card.
  brandContainer: { // Style du bloc contenant le nom de marque et le pays.
    alignItems: 'center', // Alignement des textes au centre.
    marginBottom: 20, // Marge en bas avant le titre de bienvenue.
  }, // Fin du style brandContainer.
  brandTitle: { // Style pour le texte du titre de la marque.
    fontSize: 26, // Taille de la police de caractère.
    fontWeight: '800', // Police très grasse.
    color: '#0D5C3A', // Couleur verte forêt foncée.
    textAlign: 'center', // Centrage du texte.
  }, // Fin du style brandTitle.
  brandCountry: { // Style du texte du pays sous la marque.
    fontSize: 14, // Taille de la police.
    fontWeight: '800', // Police grasse.
    color: '#C62828', // Couleur rouge.
    letterSpacing: 4, // Grand espacement entre les lettres pour l'esthétique.
    marginTop: 6, // Espace au-dessus par rapport à la marque.
    textAlign: 'center', // Centrage du texte.
  }, // Fin du style brandCountry.
  yellowBar: { // Style de la ligne jaune horizontale décorative.
    width: 35, // Largeur de la ligne jaune.
    height: 4, // Épaisseur de la ligne jaune.
    backgroundColor: '#FBC02D', // Couleur jaune-orange.
    borderRadius: 2, // Légers arrondis aux extrémités.
    marginTop: 12, // Espace au-dessus.
  }, // Fin du style yellowBar.
  title: { // Style pour le message de bienvenue principal.
    fontSize: 34, // Taille de police très grande (augmentée).
    fontWeight: '800', // Police très grasse.
    color: '#222222', // Couleur presque noire pour le texte.
    marginBottom: 15, // Marge inférieure avant la description.
    textAlign: 'center', // Centrage du texte de bienvenue.
  }, // Fin du style title.
  description: { // Style du texte de description de l'application.
    fontSize: 14, // Taille de police standard pour la lecture.
    color: '#757575', // Couleur grise intermédiaire.
    textAlign: 'center', // Alignement centré.
    lineHeight: 22, // Hauteur de ligne confortable pour la lecture.
    fontWeight: '600', // Police semi-grasse.
    marginBottom: 15, // Réduction de l'espace pour laisser la place aux icônes en dessous.
    paddingHorizontal: 15, // Marge de sécurité sur les côtés.
  }, // Fin du style description.
  componentsRow: { // Style pour la rangée horizontale contenant les trois images de composants.
    flexDirection: 'row', // Alignement des enfants horizontalement.
    justifyContent: 'space-around', // Répartition uniforme de l'espace libre entre les éléments.
    width: '100%', // Utilisation de toute la largeur de la carte.
    marginTop: 10, // Marge au-dessus pour espacer de la description.
    marginBottom: 20, // Marge en dessous pour séparer du bouton Commencer.
  }, // Fin du style componentsRow.
  componentItem: { // Style pour chaque élément de composant (image + texte).
    alignItems: 'center', // Centrage horizontal des enfants (image et texte).
    width: (width - 80) / 3, // Calcul de la largeur de chaque élément pour tenir sur 3 colonnes.
  }, // Fin du style componentItem.
  componentImageWrapper: { // Style du conteneur circulaire autour de chaque image de composant.
    width: 60, // Largeur du cercle de 60 pixels.
    height: 60, // Hauteur du cercle de 60 pixels.
    borderRadius: 30, // Rayon de 30 pour former un cercle parfait.
    backgroundColor: '#F5F5F5', // Couleur de fond gris très clair.
    alignItems: 'center', // Centrage horizontal de l'image.
    justifyContent: 'center', // Centrage vertical de l'image.
    borderWidth: 1.5, // Épaisseur de la bordure extérieure.
    borderColor: '#0D5C3A', // Couleur verte de la bordure.
    overflow: 'hidden', // Rognage pour maintenir la forme ronde.
    ...Shadows.light, // Ombre légère pour donner du relief.
  }, // Fin du style componentImageWrapper.
  componentImage: { // Style pour l'image du composant.
    width: 50, // Largeur de l'image de 50 pixels.
    height: 50, // Hauteur de l'image de 50 pixels.
    resizeMode: 'contain', // Redimensionnement pour s'adapter au cercle.
  }, // Fin du style componentImage.
  componentLabel: { // Style pour le libellé sous chaque composant.
    fontSize: 11, // Petite taille de police de caractère.
    fontWeight: '700', // Police grasse.
    color: '#555555', // Couleur gris foncé pour une bonne lisibilité.
    marginTop: 6, // Espace au-dessus pour séparer le texte du cercle.
    textAlign: 'center', // Centrage du texte.
  }, // Fin du style componentLabel.
  button: { // Style du bouton principal de démarrage.
    width: '100%', // Le bouton prend toute la largeur disponible de la carte.
    height: 52, // Hauteur confortable pour le clic tactile.
    backgroundColor: '#0D5C3A', // Couleur de fond vert forêt foncé.
    borderRadius: 26, // Bords complètement arrondis en forme de pilule.
    alignItems: 'center', // Centrage horizontal du texte du bouton.
    justifyContent: 'center', // Centrage vertical du texte du bouton.
    position: 'absolute', // Positionnement absolu pour le bloquer en bas de la carte.
    bottom: 40, // Marge par rapport au bas de l'écran.
    ...Shadows.light, // Application d'une ombre légère.
  }, // Fin du style button.
  buttonText: { // Style du texte à l'intérieur du bouton.
    color: '#FFFFFF', // Couleur de texte blanche pour contrasté.
    fontSize: 16, // Taille de police lisible.
    fontWeight: '700', // Police grasse.
  }, // Fin du style buttonText.
}); // Fin de la création de la feuille de style.
