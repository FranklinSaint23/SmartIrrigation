import React, { useEffect, useRef } from 'react'; // Importation de React et des hooks useEffect et useRef.
import { StyleSheet, View, Animated, Image } from 'react-native'; // Importation des composants graphiques et d'animation de React Native.
import { useRouter } from 'expo-router'; // Importation du routeur d'Expo pour la navigation de pages.
import { useSmartIrrigation } from '../context/SmartIrrigationContext'; // Importation de notre contexte personnalisé d'irrigation.
import { StatusBar } from 'expo-status-bar'; // Importation de la barre de statut Expo.

export default function SplashScreen() { // Déclaration du composant fonctionnel SplashScreen pour la page d'attente initiale.
  const router = useRouter(); // Récupération de l'instance du routeur pour gérer les navigations de pages.
  const { isLoggedIn, isLoading } = useSmartIrrigation(); // Récupération de l'état de connexion et de chargement depuis le contexte global.
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initialisation d'une référence d'animation pour l'effet de transition d'opacité (débute à 0).

  useEffect(() => { // Déclaration d'un hook d'effet secondaire exécuté au montage du composant.
    Animated.timing(fadeAnim, { // Lancement de l'animation linéaire temporelle sur l'opacité.
      toValue: 1, // La valeur finale de l'opacité sera de 1 (complètement visible).
      duration: 1500, // La durée de la transition d'animation est fixée à 1500 millisecondes (1,5 seconde).
      useNativeDriver: true, // Utilisation du pilote natif pour de meilleures performances d'animation fluide.
    }).start(() => { // Déclenchement de l'animation avec une fonction de rappel à sa fin.
      setTimeout(() => { // Ajout d'un délai d'attente d'une seconde avant de rediriger pour laisser le temps de voir le logo.
        if (!isLoading) { // Vérification si le chargement des informations d'authentification locales est terminé.
          if (isLoggedIn) { // Si l'utilisateur est déjà connecté à son compte.
            router.replace('/(tabs)/home' as any); // Redirection directe et remplacement de la pile par la page d'accueil.
          } else { // Si l'utilisateur n'est pas identifié ou s'il s'agit de sa première ouverture.
            router.replace('/welcome' as any); // Redirection vers l'écran de bienvenue de l'application.
          } // Fin de la condition d'état de connexion.
        } // Fin de la condition de chargement.
      }, 1000); // Durée du délai d'attente fixée à 1000 millisecondes (1 seconde).
    }); // Fin de la fonction de démarrage de l'animation.
  }, [fadeAnim, isLoggedIn, isLoading]); // Dépendances du hook provoquant son exécution en cas de changement.

  return ( // Début du rendu graphique du composant d'attente.
    <View style={styles.container}> {/* Conteneur principal plein écran avec fond vert forêt. */}
      <StatusBar style="light" /> {/* Barre de statut affichant des icônes claires sur fond sombre. */}
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}> {/* Vue animée appliquant l'effet d'opacité progressive. */}
        <View style={styles.haloOuter}> {/* Première auréole blanche semi-transparente externe. */}
          <View style={styles.haloInner}> {/* Deuxième auréole blanche semi-transparente interne. */}
            <View style={styles.logoCircle}> {/* Cercle blanc opaque contenant l'image du logo de l'application. */}
              <Image // Composant image pour afficher le logo.
                source={require('../assets/images/logo.png')} // Chargement du fichier image PNG local du logo de l'application.
                style={styles.logoImage} // Style de redimensionnement pour l'image du logo.
              /> {/* Fin du composant image. */}
            </View> {/* Fin du cercle blanc du logo. */}
          </View> {/* Fin de l'auréole interne. */}
        </View> {/* Fin de l'auréole externe. */}
      </Animated.View> {/* Fin de la vue animée. */}
    </View> // Fin du conteneur principal.
  ); // Fin du retour de rendu.
} // Fin de la déclaration du composant SplashScreen.

const styles = StyleSheet.create({ // Création des styles CSS-in-JS pour la page d'attente.
  container: { // Style pour le conteneur racine.
    flex: 1, // Utilisation de toute la hauteur et de la largeur de l'écran.
    backgroundColor: '#0D5C3A', // Couleur de fond vert forêt de l'écran d'attente.
    alignItems: 'center', // Centrage horizontal complet des enfants.
    justifyContent: 'center', // Centrage vertical complet des enfants.
  }, // Fin du style container.
  logoContainer: { // Style pour le conteneur de logo animé.
    alignItems: 'center', // Centrage horizontal du logo.
    justifyContent: 'center', // Centrage vertical du logo.
  }, // Fin du style logoContainer.
  haloOuter: { // Style de l'auréole blanche externe entourant le logo.
    width: 240, // Largeur de l'auréole externe.
    height: 240, // Hauteur de l'auréole externe.
    borderRadius: 120, // Rayon de 120 pour former un cercle parfait.
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Fond blanc avec une opacité de 8%.
    alignItems: 'center', // Centrage horizontal de l'auréole interne.
    justifyContent: 'center', // Centrage vertical de l'auréole interne.
  }, // Fin du style haloOuter.
  haloInner: { // Style de l'auréole blanche interne.
    width: 180, // Largeur de l'auréole interne.
    height: 180, // Hauteur de l'auréole interne.
    borderRadius: 90, // Rayon de 90 pour former le cercle.
    backgroundColor: 'rgba(255, 255, 255, 0.12)', // Fond blanc avec une opacité de 12%.
    alignItems: 'center', // Centrage horizontal.
    justifyContent: 'center', // Centrage vertical.
  }, // Fin du style haloInner.
  logoCircle: { // Style du cercle blanc opaque contenant l'image du logo.
    width: 130, // Largeur du conteneur du logo.
    height: 130, // Hauteur du conteneur du logo.
    borderRadius: 65, // Rayon de 65 pour faire un cercle parfait.
    backgroundColor: '#FFFFFF', // Couleur blanche opaque.
    alignItems: 'center', // Centrage horizontal du logo.
    justifyContent: 'center', // Centrage vertical du logo.
    overflow: 'hidden', // Rognage de l'image.
  }, // Fin du style logoCircle.
  logoImage: { // Style pour l'image du logo.
    width: 110, // Largeur de l'image.
    height: 110, // Hauteur de l'image.
    resizeMode: 'contain', // Redimensionnement.
  }, // Fin du style logoImage.
}); // Fin de la création de la feuille de style.
