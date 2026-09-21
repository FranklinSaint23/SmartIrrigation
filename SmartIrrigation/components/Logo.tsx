import React from 'react'; // Importation de la bibliothèque React.
import { View, Image, StyleSheet } from 'react-native'; // Importation des composants graphiques de React Native.

interface LogoProps { // Déclaration de l'interface décrivant les propriétés (props) acceptées par le composant Logo.
  size?: number; // Propriété optionnelle pour définir la taille du logo.
  showText?: boolean; // Propriété optionnelle pour choisir d'afficher ou non un texte.
  tagline?: boolean; // Propriété optionnelle pour choisir d'afficher ou non un slogan.
  theme?: 'light' | 'dark'; // Propriété optionnelle pour sélectionner le thème clair ou sombre.
} // Fin de la déclaration de l'interface LogoProps.

export default function Logo({ size = 120 }: LogoProps) { // Déclaration et exportation de la fonction du composant Logo avec une taille par défaut de 120.
  return ( // Retour de la structure visuelle du composant.
    <View style={styles.container}> {/* Conteneur principal englobant le logo. */}
      <Image // Composant image pour afficher le fichier de logo.
        source={require('../assets/images/logo.png')} // Chargement du fichier image PNG local du logo de l'application.
        style={[styles.logoImage, { width: size * 1.5, height: size * 1.5 }]} // Application du style de base et redimensionnement dynamique de la largeur et hauteur.
      /> {/* Fin du composant image. */}
    </View> // Fin du conteneur principal.
  ); // Fin du retour de structure.
} // Fin de la déclaration du composant Logo.

const styles = StyleSheet.create({ // Création de la feuille de style CSS-in-JS pour le composant Logo.
  container: { // Style pour le conteneur principal du logo.
    alignItems: 'center', // Centrage horizontal de l'image du logo.
    justifyContent: 'center', // Centrage vertical de l'image du logo.
  }, // Fin du style container.
  logoImage: { // Style pour l'image du logo.
    resizeMode: 'contain', // Ajustement de l'image pour qu'elle s'insère sans distorsion ni coupure.
  }, // Fin du style logoImage.
}); // Fin de la création de la feuille de style.
