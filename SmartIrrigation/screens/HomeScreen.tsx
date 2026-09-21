import React from 'react'; // Importation de la bibliothèque React.
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native'; // Importation des composants React Native.
import { useRouter } from 'expo-router'; // Importation du routeur Expo pour la navigation.
import { useSmartIrrigation } from '../context/SmartIrrigationContext'; // Importation du contexte global de l'application.
import { Colors, Shadows } from '../styles/Theme'; // Importation du thème de couleurs et des ombres.
import { // Importation des icônes de la bibliothèque lucide-react-native.
  Bell, // Icône de cloche pour les notifications.
  Settings, // Icône d'engrenage pour les paramètres.
  Thermometer, // Icône de thermomètre pour la température.
  Droplet, // Icône de goutte pour l'humidité de l'air.
  Sprout, // Icône de pousse pour l'humidité du sol.
  Sun, // Icône de soleil pour la luminosité.
  Layers, // Icône de couches pour le niveau du réservoir.
  CloudRain, // Icône de nuage de pluie.
  Power, // Icône de bouton d'alimentation pour la pompe.
  User // Icône d'utilisateur pour le profil.
} from 'lucide-react-native'; // Provenance de la bibliothèque d'icônes.
import { Card } from 'react-native-paper'; // Importation du composant Card de React Native Paper.
import { StatusBar } from 'expo-status-bar'; // Importation de la barre de statut Expo.

const { width } = Dimensions.get('window'); // Obtention de la largeur de la fenêtre de l'appareil.
const cardWidth = (width - 60) / 2; // Calcul de la largeur de chaque carte pour l'affichage en grille (2 colonnes).

export default function HomeScreen() { // Déclaration du composant fonctionnel HomeScreen.
  const router = useRouter(); // Récupération du routeur pour gérer les navigations.
  const { sensors, pumpActive, setPumpActive, profile } = useSmartIrrigation(); // Récupération des données du capteur, de l'état de la pompe et du profil utilisateur.

  const handleTogglePump = async () => { // Fonction asynchrone pour activer ou désactiver la pompe.
    await setPumpActive(!pumpActive); // Appel de la fonction de changement d'état de la pompe dans le contexte.
  }; // Fin de la fonction handleTogglePump.

  return ( // Début du rendu de la vue de l'écran d'accueil.
    <View style={styles.container}> {/* Conteneur principal de l'écran. */}
      <StatusBar style="dark" /> {/* Configuration de la barre de statut avec des icônes sombres. */}
      
      {/* En-tête supérieur */}
      <View style={styles.header}> {/* Conteneur de l'en-tête de la page d'accueil. */}
        <View> {/* Bloc contenant le texte de salutation et le titre. */}
          <Text style={styles.greeting}>Bonjour {profile?.name || 'Jean'} !</Text> {/* Salutation personnalisée affichant le nom de l'utilisateur. */}
          <Text style={styles.headerTitle}>Tableau de bord</Text> {/* Titre principal de la page d'accueil. */}
        </View> {/* Fin du bloc de titre. */}
        <View style={styles.headerButtons}> {/* Bloc contenant les boutons d'action de l'en-tête. */}
          <TouchableOpacity // Bouton pour ouvrir l'écran de notifications.
            style={styles.iconButton} // Style du bouton avec fond arrondi.
            onPress={() => router.push('/notifications' as any)} // Redirection vers la page des notifications.
            activeOpacity={0.7} // Rétroaction d'opacité au clic.
          > {/* Début du bouton notifications. */}
            <Bell size={20} color="#0D5C3A" /> {/* Icône Lucide Bell verte. */}
            <View style={styles.dot} /> {/* Petit point rouge indicateur de nouvelles notifications. */}
          </TouchableOpacity> {/* Fin du bouton notifications. */}
          <TouchableOpacity // Bouton pour ouvrir l'écran du profil utilisateur.
            style={styles.iconButton} // Style du bouton avec fond arrondi.
            onPress={() => router.push('/profile' as any)} // Redirection vers la page du profil.
            activeOpacity={0.7} // Rétroaction d'opacité au clic.
          > {/* Début du bouton profil. */}
            <User size={20} color="#0D5C3A" /> {/* Icône Lucide User verte. */}
          </TouchableOpacity> {/* Fin du bouton profil. */}
          <TouchableOpacity // Bouton pour ouvrir l'écran des paramètres.
            style={styles.iconButton} // Style du bouton avec fond arrondi.
            onPress={() => router.push('/settings' as any)} // Redirection vers la page des paramètres.
            activeOpacity={0.7} // Rétroaction d'opacité au clic.
          > {/* Début du bouton paramètres. */}
            <Settings size={20} color="#0D5C3A" /> {/* Icône Lucide Settings verte. */}
          </TouchableOpacity> {/* Fin du bouton paramètres. */}
        </View> {/* Fin du bloc des boutons. */}
      </View> {/* Fin de l'en-tête. */}

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}> {/* Vue défilante contenant la grille de cartes et le widget. */}
        <View style={styles.grid}> {/* Conteneur en grille pour organiser les cartes d'information des capteurs. */}
          {/* Carte Température */}
          <Card style={[styles.card, { borderLeftColor: '#E57373', borderLeftWidth: 4 }]}> {/* Carte avec bordure gauche rouge. */}
            <Card.Content style={styles.cardContent}> {/* Contenu interne de la carte. */}
              <View style={[styles.iconCircle, { backgroundColor: '#FFEBEE' }]}> {/* Cercle rouge clair contenant l'icône. */}
                <Thermometer size={22} color="#E57373" /> {/* Icône Lucide de thermomètre rouge. */}
              </View> {/* Fin du conteneur d'icône. */}
              <Text style={styles.cardLabel}>Température</Text> {/* Label de la carte. */}
              <Text style={styles.cardValue}>{sensors.temperature} °C</Text> {/* Valeur mesurée de la température. */}
            </Card.Content> {/* Fin du contenu interne. */}
          </Card> {/* Fin de la carte température. */}

          {/* Carte Humidité de l'air */}
          <Card style={[styles.card, { borderLeftColor: Colors.blue, borderLeftWidth: 4 }]}> {/* Carte avec bordure gauche bleue. */}
            <Card.Content style={styles.cardContent}> {/* Contenu de la carte d'humidité de l'air. */}
              <View style={[styles.iconCircle, { backgroundColor: Colors.infoLight }]}> {/* Cercle bleu clair contenant l'icône. */}
                <Droplet size={22} color={Colors.blue} /> {/* Icône Lucide Droplet bleue. */}
              </View> {/* Fin du conteneur d'icône. */}
              <Text style={styles.cardLabel}>Humidité de l'air</Text> {/* Label d'humidité de l'air. */}
              <Text style={styles.cardValue}>{sensors.airHumidity} %</Text> {/* Valeur d'humidité de l'air mesurée. */}
            </Card.Content> {/* Fin du contenu. */}
          </Card> {/* Fin de la carte. */}

          {/* Carte Humidité du sol avec redirection vers les prédictions par IA */}
          <TouchableOpacity // Zone cliquable pour naviguer vers l'écran des prédictions.
            style={{ width: cardWidth }} // Largeur identique aux autres cartes de la grille.
            onPress={() => router.push('/predictions' as any)} // Redirection vers l'écran des prédictions d'humidité du sol.
            activeOpacity={0.9} // Légère opacité au clic.
          > {/* Début du conteneur tactile. */}
            <Card style={[styles.card, { width: '100%', borderLeftColor: Colors.primary, borderLeftWidth: 4 }]}> {/* Carte avec bordure gauche verte. */}
              <Card.Content style={styles.cardContent}> {/* Contenu de la carte d'humidité du sol. */}
                <View style={[styles.iconCircle, { backgroundColor: Colors.successLight }]}> {/* Cercle vert clair contenant la pousse. */}
                  <Sprout size={22} color={Colors.primary} /> {/* Icône Sprout en vert forêt. */}
                </View> {/* Fin du conteneur d'icône. */}
                <Text style={styles.cardLabel}>Humidité du sol</Text> {/* Label d'humidité du sol. */}
                <Text style={styles.cardValue}>{sensors.soilHumidity} %</Text> {/* Valeur d'humidité du sol mesurée. */}
                <Text style={styles.aiHint}>Voir IA predictions &gt;</Text> {/* Texte d'invitation vers les prédictions d'IA. */}
              </Card.Content> {/* Fin du contenu de la carte. */}
            </Card> {/* Fin de la carte. */}
          </TouchableOpacity> {/* Fin du conteneur tactile. */}

          {/* Carte Luminosité */}
          <Card style={[styles.card, { borderLeftColor: '#FBC02D', borderLeftWidth: 4 }]}> {/* Carte avec bordure gauche jaune. */}
            <Card.Content style={styles.cardContent}> {/* Contenu de la carte de luminosité. */}
              <View style={[styles.iconCircle, { backgroundColor: '#FFF9C4' }]}> {/* Cercle jaune clair pour l'icône de soleil. */}
                <Sun size={22} color="#FBC02D" /> {/* Icône Lucide Sun jaune. */}
              </View> {/* Fin de l'icône. */}
              <Text style={styles.cardLabel}>Luminosité</Text> {/* Label de luminosité. */}
              <Text style={styles.cardValue}>{sensors.light} lux</Text> {/* Valeur de luminosité en lux. */}
            </Card.Content> {/* Fin du contenu. */}
          </Card> {/* Fin de la carte. */}

          {/* Carte Niveau du réservoir d'eau */}
          <Card style={[styles.card, { borderLeftColor: '#00ACC1', borderLeftWidth: 4 }]}> {/* Carte avec bordure gauche cyan. */}
            <Card.Content style={styles.cardContent}> {/* Contenu de la carte du réservoir. */}
              <View style={[styles.iconCircle, { backgroundColor: '#E0F7FA' }]}> {/* Cercle cyan clair pour l'icône de niveau. */}
                <Layers size={22} color="#00ACC1" /> {/* Icône Layers cyan. */}
              </View> {/* Fin de l'icône. */}
              <Text style={styles.cardLabel}>Réservoir</Text> {/* Label du réservoir. */}
              <Text style={styles.cardValue}>{sensors.tankLevel} %</Text> {/* Valeur du niveau du réservoir en pourcentage. */}
            </Card.Content> {/* Fin du contenu. */}
          </Card> {/* Fin de la carte. */}

          {/* Carte Détection de pluie */}
          <Card style={[styles.card, { borderLeftColor: '#3949AB', borderLeftWidth: 4 }]}> {/* Carte avec bordure gauche indigo. */}
            <Card.Content style={styles.cardContent}> {/* Contenu de la carte de pluie. */}
              <View style={[styles.iconCircle, { backgroundColor: '#E8EAF6' }]}> {/* Cercle indigo clair pour l'icône de pluie. */}
                <CloudRain size={22} color="#3949AB" /> {/* Icône CloudRain indigo. */}
              </View> {/* Fin de l'icône. */}
              <Text style={styles.cardLabel}>Pluie</Text> {/* Label de pluie. */}
              <Text style={styles.cardValue}>{sensors.rainDetected ? 'Oui' : 'Non'}</Text> {/* Rendu texte indiquant si la pluie est détectée. */}
            </Card.Content> {/* Fin du contenu. */}
          </Card> {/* Fin de la carte. */}
        </View> {/* Fin de la grille des cartes. */}

        {/* Section Widget de contrôle de la pompe */}
        <Card style={[styles.pumpCard, pumpActive ? styles.pumpActiveBg : styles.pumpInactiveBg]}> {/* Carte pompe avec arrière-plan dynamique vert ou blanc. */}
          <Card.Content style={styles.pumpContent}> {/* Contenu interne du widget pompe. */}
            <View style={styles.pumpDetails}> {/* Bloc d'information textuelle sur l'état de la pompe. */}
              <Text style={[styles.pumpLabel, pumpActive ? styles.pumpTextActive : styles.pumpTextInactive]}> {/* Label pompe avec couleur dynamique. */}
                État de la pompe {/* Texte indicatif de l'état. */}
              </Text> {/* Fin du label. */}
              <Text style={[styles.pumpStatus, pumpActive ? styles.pumpTextActive : styles.pumpTextInactive]}> {/* Statut textuel activé/désactivé dynamique. */}
                {pumpActive ? 'Activée' : 'Désactivée'} {/* Valeur textuelle selon l'état actuel de la pompe. */}
              </Text> {/* Fin du statut. */}
            </View> {/* Fin des détails de la pompe. */}
            <TouchableOpacity // Bouton d'alimentation pour basculer l'état de la pompe.
              style={[styles.powerButton, pumpActive ? styles.powerActive : styles.powerInactive]} // Style de bouton dynamique vert/rouge.
              onPress={handleTogglePump} // Bascule l'état de la pompe lors du clic.
              activeOpacity={0.8} // Opacité lors du clic.
            > {/* Début du contenu du bouton d'alimentation. */}
              <Power size={26} color="#FFFFFF" strokeWidth={2.5} /> {/* Icône Power blanche grasse. */}
            </TouchableOpacity> {/* Fin du bouton d'alimentation. */}
          </Card.Content> {/* Fin du contenu du widget. */}
        </Card> {/* Fin de la carte pompe. */}
      </ScrollView> {/* Fin de la zone défilante. */}
    </View> // Fin de la vue principale.
  ); // Fin du retour de la vue.
} // Fin de la déclaration du composant HomeScreen.

const styles = StyleSheet.create({ // Déclaration de la feuille de style pour l'écran d'accueil.
  container: { // Style pour le conteneur racine.
    flex: 1, // Utilise toute la hauteur et largeur de l'écran.
    backgroundColor: Colors.background, // Fond gris clair du thème.
  }, // Fin du style container.
  header: { // Style pour l'en-tête blanc supérieur.
    flexDirection: 'row', // Alignement horizontal des éléments de l'en-tête.
    justifyContent: 'space-between', // Espacement égal entre la salutation et les boutons.
    alignItems: 'center', // Alignement vertical au centre.
    paddingHorizontal: 20, // Remplissage sur les côtés.
    paddingTop: 60, // Remplissage en haut pour laisser de la place sous l'encoche de l'écran.
    paddingBottom: 20, // Marge interne en bas.
    backgroundColor: '#FFFFFF', // Couleur de fond blanche de l'en-tête.
    borderBottomWidth: 1, // Ligne fine sous l'en-tête.
    borderBottomColor: Colors.grayLight, // Couleur grise claire pour la ligne de démarcation.
  }, // Fin du style header.
  greeting: { // Style pour la salutation de l'utilisateur.
    fontSize: 14, // Petite taille de police.
    color: Colors.gray, // Couleur grise du thème.
    fontWeight: '600', // Police semi-grasse.
  }, // Fin du style greeting.
  headerTitle: { // Style pour le titre principal "Tableau de bord".
    fontSize: 22, // Taille de police intermédiaire visible.
    fontWeight: '800', // Police très grasse.
    color: Colors.text, // Couleur de texte sombre du thème.
    marginTop: 2, // Marge supérieure pour espacer du message de salutation.
  }, // Fin du style headerTitle.
  headerButtons: { // Style pour le conteneur de boutons de l'en-tête.
    flexDirection: 'row', // Alignement des boutons côte à côte.
    gap: 12, // Espacement de 12 pixels entre les boutons.
  }, // Fin du style headerButtons.
  iconButton: { // Style pour chaque bouton d'icône arrondi.
    width: 44, // Largeur fixe.
    height: 44, // Hauteur fixe.
    borderRadius: 22, // Forme circulaire parfaite.
    backgroundColor: '#E8F5E9', // Arrière-plan vert clair pour correspondre au thème d'irrigation.
    alignItems: 'center', // Centrage horizontal des icônes.
    justifyContent: 'center', // Centrage vertical des icônes.
    position: 'relative', // Positionnement relatif pour placer le point d'alerte rouge.
  }, // Fin du style iconButton.
  dot: { // Style pour le point indicateur rouge des notifications.
    position: 'absolute', // Positionnement absolu par rapport au bouton parent.
    top: 10, // Décalage depuis le haut.
    right: 12, // Décalage depuis la droite.
    width: 8, // Largeur du point.
    height: 8, // Hauteur du point.
    borderRadius: 4, // Cercle parfait.
    backgroundColor: Colors.danger, // Couleur rouge d'alerte.
    borderWidth: 1.5, // Bordure blanche fine.
    borderColor: '#FFFFFF', // Couleur blanche de la bordure.
  }, // Fin du style dot.
  scrollContainer: { // Style pour le conteneur interne de ScrollView.
    paddingHorizontal: 20, // Rembourrage sur les côtés pour la grille.
    paddingTop: 20, // Rembourrage en haut pour espacer de l'en-tête.
    paddingBottom: 80, // Réduction du rembourrage bas pour rapprocher le widget de pompe de la barre d'onglets.
  }, // Fin du style scrollContainer.
  grid: { // Style pour la grille contenant les cartes de capteurs.
    flexDirection: 'row', // Organisation horizontale des enfants.
    flexWrap: 'wrap', // Permet aux cartes de passer à la ligne suivante.
    justifyContent: 'space-between', // Distribution uniforme de l'espace.
    rowGap: 16, // Espacement de 16 pixels entre les lignes de cartes.
    marginBottom: 24, // Marge inférieure avant le widget de pompe.
  }, // Fin du style grid.
  card: { // Style pour chaque carte de mesure.
    width: cardWidth, // Largeur précalculée pour s'adapter à la grille.
    backgroundColor: '#FFFFFF', // Fond blanc pour ressortir du fond gris.
    borderRadius: 16, // Coins de la carte arrondis.
    borderWidth: 1, // Bordure fine.
    borderColor: '#E8ECE9', // Couleur grise claire de la bordure.
    ...Shadows.light, // Application d'une ombre légère.
  }, // Fin du style card.
  cardContent: { // Style du conteneur interne de la carte.
    padding: 14, // Marge interne de 14 pixels.
    alignItems: 'flex-start', // Alignement des éléments vers la gauche.
  }, // Fin du style cardContent.
  iconCircle: { // Style pour le cercle de couleur entourant les icônes de carte.
    width: 42, // Largeur fixe.
    height: 42, // Hauteur fixe.
    borderRadius: 12, // Coins arrondis modérés.
    alignItems: 'center', // Centrage de l'icône.
    justifyContent: 'center', // Centrage de l'icône.
    marginBottom: 10, // Espacement sous l'icône avant le label de mesure.
  }, // Fin du style iconCircle.
  cardLabel: { // Style du label de mesure (température, humidité, etc.).
    fontSize: 12, // Petite taille de police.
    color: Colors.gray, // Couleur grise du thème.
    fontWeight: '600', // Police semi-grasse.
    marginBottom: 4, // Espacement sous le label avant la valeur.
  }, // Fin du style cardLabel.
  cardValue: { // Style de la valeur numérique de la mesure.
    fontSize: 18, // Taille de police moyenne visible.
    fontWeight: '800', // Police très grasse.
    color: Colors.text, // Couleur sombre.
  }, // Fin du style cardValue.
  aiHint: { // Style de l'indicateur textuel pour les prédictions IA.
    fontSize: 10, // Petite taille de police.
    color: Colors.primary, // Couleur verte principale.
    fontWeight: '700', // Police grasse.
    marginTop: 8, // Décalage vers le bas par rapport à la valeur.
  }, // Fin du style aiHint.
  pumpCard: { // Style de la carte contenant le contrôle de pompe.
    borderRadius: 20, // Coins bien arrondis.
    borderWidth: 1, // Bordure fine.
    ...Shadows.medium, // Application d'une ombre moyenne.
  }, // Fin du style pumpCard.
  pumpActiveBg: { // Couleur de fond si la pompe est activée.
    backgroundColor: Colors.success, // Fond vert du succès.
    borderColor: Colors.success, // Bordure verte.
  }, // Fin du style pumpActiveBg.
  pumpInactiveBg: { // Couleur de fond si la pompe est éteinte.
    backgroundColor: '#FFFFFF', // Fond blanc standard.
    borderColor: '#E8ECE9', // Bordure gris clair.
  }, // Fin du style pumpInactiveBg.
  pumpContent: { // Style pour le contenu interne de la carte pompe.
    flexDirection: 'row', // Alignement du texte à gauche et du bouton à droite.
    justifyContent: 'space-between', // Espace maximal entre le texte et le bouton.
    alignItems: 'center', // Alignement vertical au centre.
    padding: 20, // Marge interne généreuse de 20 pixels.
  }, // Fin du style pumpContent.
  pumpDetails: { // Style pour le groupe de texte de détails.
    flexDirection: 'column', // Alignement vertical des textes d'information.
    gap: 4, // Espacement de 4 pixels entre le titre et le statut.
  }, // Fin du style pumpDetails.
  pumpLabel: { // Style du label "État de la pompe".
    fontSize: 14, // Taille moyenne.
    fontWeight: '700', // Police grasse.
  }, // Fin du style pumpLabel.
  pumpStatus: { // Style pour le statut "Activée" ou "Désactivée".
    fontSize: 22, // Taille de police grande.
    fontWeight: '800', // Police très grasse pour ressortir.
  }, // Fin du style pumpStatus.
  pumpTextActive: { // Style pour la couleur du texte lorsque la pompe est en marche (blanc).
    color: '#FFFFFF', // Couleur blanche pour contraste.
  }, // Fin du style pumpTextActive.
  pumpTextInactive: { // Style pour la couleur du texte lorsque la pompe est éteinte (sombre).
    color: Colors.text, // Couleur de texte sombre du thème.
  }, // Fin du style pumpTextInactive.
  powerButton: { // Style pour le bouton d'alimentation rond de la pompe.
    width: 60, // Largeur fixe.
    height: 60, // Hauteur fixe.
    borderRadius: 30, // Cercle parfait.
    alignItems: 'center', // Centrage horizontal de l'icône Power.
    justifyContent: 'center', // Centrage vertical de l'icône Power.
    ...Shadows.light, // Ombre légère.
  }, // Fin du style powerButton.
  powerActive: { // Style du bouton d'alimentation si pompe active.
    backgroundColor: '#388E3C', // Vert un peu plus clair.
  }, // Fin du style powerActive.
  powerInactive: { // Style du bouton d'alimentation si pompe inactive.
    backgroundColor: Colors.danger, // Couleur rouge d'extinction.
  }, // Fin du style powerInactive.
}); // Fin de la création de la feuille de style.
