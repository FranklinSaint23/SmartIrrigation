import React from 'react'; // Importation de la bibliothèque React.
import WelcomeScreen from '../screens/WelcomeScreen'; // Importation du composant WelcomeScreen de bienvenue.

export default function IndexRoute() { // Déclaration de la route racine (index) de l'application.
  return <WelcomeScreen />; // Rendu direct de la page de bienvenue sans écran d'attente intermédiaire.
} // Fin de la déclaration de la route IndexRoute.
