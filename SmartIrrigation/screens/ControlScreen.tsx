import React from 'react'; // Importation de la bibliothèque React.
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native'; // Importation des composants graphiques de React Native.
import { useSmartIrrigation } from '../context/SmartIrrigationContext'; // Importation de notre contexte personnalisé d'irrigation.
import { Colors, Shadows } from '../styles/Theme'; // Importation des couleurs et ombres globales du thème.
import { Bot, Shield, Play, Square, CalendarClock } from 'lucide-react-native'; // Importation des icônes Lucide nécessaires à l'interface.
import { Card } from 'react-native-paper'; // Importation du composant Card de React Native Paper.
import { StatusBar } from 'expo-status-bar'; // Importation de la barre de statut Expo.

export default function ControlScreen() { // Déclaration du composant principal pour l'écran de contrôle.
  const { // Récupération des données et fonctions du contexte d'irrigation.
    wateringMode, // Mode d'arrosage en cours (Automatique ou Manuel).
    setWateringMode, // Fonction de modification du mode d'arrosage.
    pumpActive, // État d'activité actuel de la pompe (allumée ou éteinte).
    setPumpActive, // Fonction de démarrage ou d'arrêt de la pompe.
    sensors // Données mesurées par les capteurs d'irrigation.
  } = useSmartIrrigation(); // Récupération des valeurs du hook personnalisé.

  const handleToggleMode = async (mode: 'Auto' | 'Manual') => { // Fonction pour changer le mode de fonctionnement (Automatique ou Manuel).
    await setWateringMode(mode); // Appel asynchrone de mise à jour du mode dans le contexte.
  }; // Fin de la fonction de changement de mode.

  const getNextWateringForecast = () => { // Fonction pour estimer dynamiquement la prévision du prochain arrosage.
    if (sensors.rainDetected) { // Condition si de la pluie est en train d'être détectée par les capteurs.
      return 'Suspendu (Pluie détectée)'; // Message indiquant la suspension en raison des conditions météo.
    } // Fin de la condition de pluie.
    if (sensors.soilHumidity >= 40) { // Condition si l'humidité du sol is suffisante (supérieure ou égale à 40%).
      return 'Prévu ce soir à 19:00'; // Message de prévision planifié à l'heure par défaut.
    } // Fin de la condition d'humidité suffisante.
    return 'Immédiat (Humidité critique)'; // Message indiquant un arrosage nécessaire en urgence si trop sec.
  }; // Fin de la fonction d'estimation.

  return ( // Retour de la structure visuelle de l'écran de contrôle.
    <View style={styles.container}> {/* Conteneur principal de l'écran. */}
      <StatusBar style="dark" /> {/* Barre de statut affichant des icônes sombres. */}
      
      {/* En-tête de la page */}
      <View style={styles.header}> {/* Conteneur de l'en-tête. */}
        <Text style={styles.headerTitle}>Contrôle</Text> {/* Titre textuel de la page de contrôle. */}
      </View> {/* Fin de l'en-tête. */}

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}> {/* Zone de défilement vertical pour les commandes. */}
        
        {/* Affichage du statut du mode actuel */}
        <Card style={styles.modeCard}> {/* Carte d'information du mode en cours. */}
          <Card.Content style={styles.modeCardContent}> {/* Conteneur interne de la carte. */}
            <View style={[styles.modeIndicator, wateringMode === 'Auto' ? styles.bgAuto : styles.bgManual]}> {/* Indicateur circulaire dynamique de couleur verte ou bleue. */}
              <Bot size={22} color={wateringMode === 'Auto' ? Colors.primary : Colors.blue} /> {/* Icône dynamique du robot (Auto) ou bouclier (Manuel). */}
            </View> {/* Fin de l'indicateur. */}
            <View style={styles.modeDetails}> {/* Bloc pour les textes de détails. */}
              <Text style={styles.modeLabel}>Mode actuel</Text> {/* Label textuel supérieur. */}
              <Text style={[styles.modeValue, { color: wateringMode === 'Auto' ? Colors.primary : Colors.blue }]}> {/* Affichage textuel du mode avec couleur dynamique. */}
                {wateringMode === 'Auto' ? 'Automatique (IA)' : 'Manuel'} {/* Texte selon la valeur active du mode. */}
              </Text> {/* Fin de l'affichage du mode. */}
            </View> {/* Fin du bloc de textes. */}
          </Card.Content> {/* Fin du contenu de la carte. */}
        </Card> {/* Fin de la carte. */}

        {/* Section: Mode de fonctionnement */}
        <View style={styles.sectionHeader}> {/* Conteneur pour le titre de section. */}
          <Text style={styles.sectionTitle}>Mode de fonctionnement</Text> {/* Titre de la section. */}
        </View> {/* Fin du titre de section. */}

        <View style={styles.modesRow}> {/* Conteneur en ligne regroupant les deux boutons de sélection de mode. */}
          {/* Bouton de sélection Mode Automatique (IA) */}
          <TouchableOpacity // Bouton pour passer en mode IA.
            style={[ // Styles appliqués au bouton.
              styles.modeButton, // Style général du bouton.
              wateringMode === 'Auto' && { borderColor: Colors.primary, borderWidth: 2 } // Ajout d'une bordure verte si sélectionné.
            ]} // Fin de la liste de styles.
            onPress={() => handleToggleMode('Auto')} // Action de changement de mode au clic.
            activeOpacity={0.8} // Rétroaction visuelle d'opacité.
          > {/* Début du contenu du bouton Auto. */}
            <Bot size={24} color={wateringMode === 'Auto' ? Colors.primary : Colors.gray} /> {/* Icône robot verte ou grise selon l'activation. */}
            <Text style={[styles.modeButtonText, wateringMode === 'Auto' && { color: Colors.primary }]}> {/* Texte du bouton avec couleur verte dynamique. */}
              Automatique (IA) {/* Intitulé du bouton. */}
            </Text> {/* Fin du texte du bouton. */}
            <Text style={styles.modeDesc}>L'IA gère l'arrosage selon les capteurs</Text> {/* Explication succincte du mode automatique. */}
          </TouchableOpacity> {/* Fin du bouton Auto. */}

          {/* Bouton de sélection Mode Manuel */}
          <TouchableOpacity // Bouton pour passer en mode manuel.
            style={[ // Styles appliqués.
              styles.modeButton, // Style de base.
              wateringMode === 'Manual' && { borderColor: Colors.blue, borderWidth: 2 } // Bordure bleue si sélectionné.
            ]} // Fin des styles.
            onPress={() => handleToggleMode('Manual')} // Action de basculement vers le mode manuel.
            activeOpacity={0.8} // Rétroaction visuelle.
          > {/* Début du contenu du bouton Manuel. */}
            <Shield size={24} color={wateringMode === 'Manual' ? Colors.blue : Colors.gray} /> {/* Icône bouclier bleue ou grise. */}
            <Text style={[styles.modeButtonText, wateringMode === 'Manual' && { color: Colors.blue }]}> {/* Texte avec couleur bleue dynamique. */}
              Manuel {/* Intitulé. */}
            </Text> {/* Fin du texte. */}
            <Text style={styles.modeDesc}>Vous contrôlez la pompe vous-même</Text> {/* Explication du mode manuel. */}
          </TouchableOpacity> {/* Fin du bouton Manuel. */}
        </View> {/* Fin de la ligne des modes. */}

        {/* Section: Commandes manuelles */}
        <View style={styles.sectionHeader}> {/* Titre de la section de commande manuelle. */}
          <Text style={styles.sectionTitle}>Commande manuelle</Text> {/* Titre textuel. */}
        </View> {/* Fin du conteneur de titre. */}

        <View style={styles.commandsCard}> {/* Boîtier regroupant les boutons d'action de la pompe. */}
          {/* Bouton de démarrage manuel de l'arrosage */}
          <TouchableOpacity // Bouton pour allumer la pompe.
            style={[ // Styles.
              styles.cmdBtn, // Style général de bouton de commande.
              styles.btnStart, // Style de couleur de fond de démarrage (vert).
              (wateringMode === 'Auto' || pumpActive) && styles.btnDisabled // Désactivation (fond gris) si en mode Auto ou si déjà allumée.
            ]} // Fin des styles.
            onPress={() => setPumpActive(true)} // Allume la pompe lors du clic.
            disabled={wateringMode === 'Auto' || pumpActive} // Blocage du bouton si inactif.
            activeOpacity={0.8} // Opacité tactile.
          > {/* Début du contenu. */}
            <Play size={20} color="#FFFFFF" fill="#FFFFFF" /> {/* Icône Play blanche. */}
            <Text style={styles.cmdBtnText}>Démarrer arrosage</Text> {/* Texte d'action. */}
          </TouchableOpacity> {/* Fin du bouton de démarrage. */}

          {/* Bouton d'arrêt manuel de l'arrosage */}
          <TouchableOpacity // Bouton pour éteindre la pompe.
            style={[ // Styles.
              styles.cmdBtn, // Style de bouton.
              styles.btnStop, // Couleur de fond d'arrêt (rouge).
              (wateringMode === 'Auto' || !pumpActive) && styles.btnDisabled // Désactivation si mode Auto ou si déjà arrêtée.
            ]} // Fin des styles.
            onPress={() => setPumpActive(false)} // Éteint la pompe au clic.
            disabled={wateringMode === 'Auto' || !pumpActive} // Désactive le bouton si inapplicable.
            activeOpacity={0.8} // Opacité.
          > {/* Début du contenu. */}
            <Square size={20} color="#FFFFFF" fill="#FFFFFF" /> {/* Icône Stop carrée blanche. */}
            <Text style={styles.cmdBtnText}>Arrêter arrosage</Text> {/* Texte d'action d'arrêt. */}
          </TouchableOpacity> {/* Fin du bouton d'arrêt. */}
        </View> {/* Fin du boîtier des boutons de commande. */}

        {/* Panneau d'information météo et prévision */}
        <Card style={styles.infoCard}> {/* Carte d'affichage des prévisions. */}
          <Card.Content style={styles.infoContent}> {/* Conteneur interne. */}
            <View style={styles.infoHeader}> {/* Ligne d'en-tête de l'information. */}
              <CalendarClock size={20} color={Colors.primary} style={{ marginRight: 8 }} /> {/* Icône d'horloge calendrier. */}
              <Text style={styles.infoTitle}>Prochain arrosage prévu</Text> {/* Titre du panneau. */}
            </View> {/* Fin de la ligne d'en-tête. */}
            <Text style={styles.infoValueText}>{getNextWateringForecast()}</Text> {/* Valeur dynamique de la prévision calculée. */}
          </Card.Content> {/* Fin du contenu. */}
        </Card> {/* Fin de la carte d'information. */}

      </ScrollView> {/* Fin de la vue de défilement. */}
    </View> // Fin du conteneur principal.
  ); // Fin du retour de la vue principale.
} // Fin de la déclaration du composant ControlScreen.

const styles = StyleSheet.create({ // Déclaration de la feuille de style pour l'écran de contrôle.
  container: { // Style du conteneur racine.
    flex: 1, // Utilisation de tout l'espace disponible de l'écran.
    backgroundColor: Colors.background, // Couleur de fond gris clair du thème.
  }, // Fin du style container.
  header: { // Style pour l'en-tête blanc supérieur.
    paddingHorizontal: 20, // Rembourrage latéral.
    paddingTop: 60, // Décalage en hauteur sous la barre de statut de l'écran.
    paddingBottom: 20, // Remplissage en bas de l'en-tête.
    backgroundColor: '#FFFFFF', // Couleur de fond blanche de l'en-tête.
    borderBottomWidth: 1, // Ligne fine de démarcation inférieure.
    borderBottomColor: Colors.grayLight, // Couleur grise claire de démarcation.
  }, // Fin du style header.
  headerTitle: { // Style du titre "Contrôle".
    fontSize: 22, // Taille du titre.
    fontWeight: '800', // Police très grasse.
    color: Colors.text, // Couleur de texte sombre du thème.
  }, // Fin du style headerTitle.
  scrollContainer: { // Style pour le conteneur interne de défilement.
    paddingHorizontal: 20, // Remplissage latéral.
    paddingTop: 20, // Remplissage en haut.
    paddingBottom: 80, // Réduction du rembourrage bas pour rapprocher les boutons de la barre d'onglets.
  }, // Fin du style scrollContainer.
  modeCard: { // Style pour la carte d'état du mode de fonctionnement.
    backgroundColor: '#FFFFFF', // Fond blanc.
    borderRadius: 16, // Coins arrondis.
    borderWidth: 1, // Bordure fine.
    borderColor: '#E8ECE9', // Couleur de la bordure grise claire.
    marginBottom: 24, // Marge sous la carte d'état.
    ...Shadows.light, // Application de l'ombre légère du thème.
  }, // Fin du style modeCard.
  modeCardContent: { // Style pour l'alignement interne de la carte.
    flexDirection: 'row', // Alignement en ligne de l'indicateur et des textes.
    alignItems: 'center', // Centrage vertical des éléments.
    padding: 16, // Marge interne de 16 pixels.
  }, // Fin du style modeCardContent.
  modeIndicator: { // Style de l'indicateur circulaire de mode.
    width: 44, // Largeur fixe.
    height: 44, // Hauteur fixe.
    borderRadius: 12, // Coins du boîtier modérément arrondis.
    alignItems: 'center', // Centrage horizontal de l'icône interne.
    justifyContent: 'center', // Centrage vertical de l'icône interne.
    marginRight: 16, // Marge à droite pour espacer des textes explicatifs.
  }, // Fin du style modeIndicator.
  bgAuto: { // Couleur de fond de l'indicateur en mode automatique (vert clair).
    backgroundColor: Colors.successLight, // Fond vert clair du thème.
  }, // Fin du style bgAuto.
  bgManual: { // Couleur de fond en mode manuel (bleu clair).
    backgroundColor: Colors.infoLight, // Fond bleu clair.
  }, // Fin du style bgManual.
  modeDetails: { // Style du conteneur des textes du mode de fonctionnement.
    flex: 1, // Prend toute la largeur restante dans la ligne.
  }, // Fin du style modeDetails.
  modeLabel: { // Style du texte de label supérieur ("Mode actuel").
    fontSize: 12, // Petite taille.
    color: Colors.gray, // Couleur grise du thème.
    fontWeight: '600', // Police semi-grasse.
  }, // Fin du style modeLabel.
  modeValue: { // Style de la valeur textuelle du mode.
    fontSize: 16, // Taille de police intermédiaire visible.
    fontWeight: '800', // Police très grasse.
    marginTop: 2, // Espacement au-dessus.
  }, // Fin du style modeValue.
  sectionHeader: { // Style pour les en-têtes de sections.
    marginBottom: 12, // Marge sous le titre de section.
  }, // Fin du style sectionHeader.
  sectionTitle: { // Style du titre de section.
    fontSize: 16, // Taille intermédiaire.
    fontWeight: '800', // Police très grasse.
    color: Colors.text, // Couleur sombre.
  }, // Fin du style sectionTitle.
  modesRow: { // Style pour la ligne contenant les deux boutons de mode.
    flexDirection: 'row', // Alignement horizontal des deux boutons.
    justifyContent: 'space-between', // Espace équitable entre les deux boutons.
    gap: 12, // Espace fixe de 12 pixels.
    marginBottom: 24, // Marge sous la rangée de boutons.
  }, // Fin du style modesRow.
  modeButton: { // Style individuel de chaque bouton de mode.
    flex: 1, // Chaque bouton occupe la moitié de la largeur disponible.
    backgroundColor: '#FFFFFF', // Fond blanc.
    borderRadius: 16, // Coins arrondis de 16 pixels.
    borderWidth: 1, // Bordure fine.
    borderColor: '#E8ECE9', // Couleur de bordure grise.
    padding: 16, // Marge interne.
    alignItems: 'center', // Centrage de tous les éléments à l'intérieur.
    ...Shadows.light, // Ombre légère.
  }, // Fin du style modeButton.
  modeButtonText: { // Style du texte principal dans le bouton de mode.
    fontSize: 14, // Taille moyenne.
    fontWeight: '700', // Police grasse.
    color: Colors.text, // Couleur sombre du texte.
    marginTop: 10, // Espacement sous l'icône.
    marginBottom: 4, // Espacement au-dessus de la description du mode.
  }, // Fin du style modeButtonText.
  modeDesc: { // Style du sous-texte explicatif dans le bouton de mode.
    fontSize: 10, // Petite taille de police.
    color: Colors.gray, // Couleur grise.
    textAlign: 'center', // Centrage du texte.
    lineHeight: 14, // Hauteur de ligne resserrée.
    fontWeight: '500', // Police moyenne.
  }, // Fin du style modeDesc.
  commandsCard: { // Style de la carte regroupant les commandes de la pompe.
    backgroundColor: '#FFFFFF', // Fond blanc.
    borderRadius: 20, // Coins arrondis.
    borderWidth: 1, // Bordure fine.
    borderColor: '#E8ECE9', // Couleur grise de bordure.
    padding: 20, // Rembourrage interne de 20 pixels.
    gap: 16, // Espace vertical de 16 pixels entre les boutons Démarrer et Arrêter.
    marginBottom: 24, // Marge sous le boîtier de commande.
    ...Shadows.light, // Ombre légère.
  }, // Fin du style commandsCard.
  cmdBtn: { // Style général de chaque bouton de commande.
    height: 52, // Hauteur confortable de 52 pixels.
    borderRadius: 26, // Coins arrondis en pilule complète.
    flexDirection: 'row', // Alignement horizontal de l'icône et du texte.
    alignItems: 'center', // Centrage vertical.
    justifyContent: 'center', // Centrage horizontal complet.
    gap: 10, // Espace entre l'icône et le texte.
    ...Shadows.light, // Ombre légère.
  }, // Fin du style cmdBtn.
  btnStart: { // Couleur verte du bouton de démarrage.
    backgroundColor: Colors.primary, // Vert principal.
  }, // Fin du style btnStart.
  btnStop: { // Couleur rouge du bouton d'arrêt.
    backgroundColor: Colors.danger, // Rouge du danger.
  }, // Fin du style btnStop.
  btnDisabled: { // Style pour l'état désactivé du bouton de commande.
    backgroundColor: '#BDBDBD', // Couleur grise neutre de désactivation.
    opacity: 0.5, // Opacité de 50% pour un aspect grisé.
  }, // Fin du style btnDisabled.
  cmdBtnText: { // Style du texte à l'intérieur du bouton de commande.
    color: '#FFFFFF', // Couleur blanche pour le contraste.
    fontSize: 15, // Taille moyenne.
    fontWeight: '700', // Police grasse.
  }, // Fin du style cmdBtnText.
  infoCard: { // Style de la carte d'informations météo au bas de l'écran.
    backgroundColor: '#FFFFFF', // Fond blanc.
    borderRadius: 16, // Coins arrondis.
    borderWidth: 1, // Bordure fine.
    borderColor: '#E8ECE9', // Couleur grise.
    ...Shadows.light, // Ombre légère.
  }, // Fin du style infoCard.
  infoContent: { // Remplissage interne de la carte info.
    padding: 16, // Rembourrage de 16 pixels.
  }, // Fin du style infoContent.
  infoHeader: { // Ligne supérieure contenant l'icône et le titre.
    flexDirection: 'row', // En ligne.
    alignItems: 'center', // Centrage vertical.
    marginBottom: 8, // Espace sous l'en-tête de carte.
  }, // Fin du style infoHeader.
  infoTitle: { // Titre du panneau.
    fontSize: 13, // Petite taille.
    color: Colors.primary, // Couleur verte.
    fontWeight: '700', // Gras.
  }, // Fin du style infoTitle.
  infoValueText: { // Contenu textuel de la prévision.
    fontSize: 16, // Taille moyenne.
    fontWeight: '800', // Police très grasse.
    color: Colors.text, // Couleur sombre.
    paddingLeft: 28, // Décalage vers la droite pour s'aligner sous le titre.
  }, // Fin du style infoValueText.
}); // Fin de la création de la feuille de style.
