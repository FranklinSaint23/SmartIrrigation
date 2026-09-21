import React from 'react'; // Importation de la bibliothèque React.
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'; // Importation des composants natifs de React Native.
import { useRouter } from 'expo-router'; // Importation du routeur Expo pour la navigation.
import { useSmartIrrigation } from '../context/SmartIrrigationContext'; // Importation du contexte personnalisé de l'application.
import { Colors, Shadows } from '../styles/Theme'; // Importation du thème de couleurs et des ombres.
import { // Importation des icônes de la bibliothèque lucide-react-native.
  ArrowLeft, // Icône de flèche de retour.
  ChevronRight, // Icône de chevron droit pour les lignes cliquables.
  Droplet, // Icône de goutte d'eau pour l'humidité.
  Timer, // Icône de chronomètre pour la durée d'arrosage.
  Clock, // Icône d'horloge pour l'intervalle de lecture.
  Layers, // Icône de couches pour le réservoir d'eau.
  History, // Icône d'historique.
  HelpCircle, // Icône de point d'interrogation pour l'aide.
  Info // Icône d'information pour le "À propos".
} from 'lucide-react-native'; // Provenance de la bibliothèque d'icônes.
import { Card } from 'react-native-paper'; // Importation du composant Card de React Native Paper.
import { StatusBar } from 'expo-status-bar'; // Importation de la barre de statut Expo.

export default function SettingsScreen() { // Déclaration du composant principal SettingsScreen.
  const router = useRouter(); // Initialisation du hook de navigation pour rediriger l'utilisateur.
  const { settings, updateSettings } = useSmartIrrigation(); // Récupération des paramètres de l'application et de la fonction de mise à jour depuis le contexte.

  const handleCycleHumidity = async () => { // Fonction pour incrémenter cycliquement le seuil d'humidité du sol.
    let nextVal = settings.soilHumidityThreshold + 5; // Ajout de 5% au seuil d'humidité actuel.
    if (nextVal > 60) nextVal = 20; // Réinitialisation à 20% si la valeur dépasse 60%.
    await updateSettings({ soilHumidityThreshold: nextVal }); // Enregistrement de la nouvelle valeur dans les paramètres.
  }; // Fin de la fonction handleCycleHumidity.

  const handleCycleDuration = async () => { // Fonction pour incrémenter cycliquement la durée d'arrosage.
    let nextVal = settings.maxWateringDuration + 5; // Ajout de 5 minutes à la durée d'arrosage actuelle.
    if (nextVal > 60) nextVal = 5; // Réinitialisation à 5 minutes si elle dépasse 60 minutes.
    await updateSettings({ maxWateringDuration: nextVal }); // Enregistrement de la nouvelle durée.
  }; // Fin de la fonction handleCycleDuration.

  const handleCycleInterval = async () => { // Fonction pour incrémenter cycliquement l'intervalle de lecture des capteurs.
    let nextVal = settings.sensorReadInterval + 1; // Ajout d'une minute à l'intervalle actuel.
    if (nextVal > 15) nextVal = 1; // Réinitialisation à 1 minute si elle dépasse 15 minutes.
    await updateSettings({ sensorReadInterval: nextVal }); // Enregistrement du nouvel intervalle.
  }; // Fin de la fonction handleCycleInterval.

  const handleCycleCapacity = async () => { // Fonction pour incrémenter cycliquement la capacité du réservoir d'eau.
    let nextVal = settings.tankCapacity + 250; // Ajout de 250 litres à la capacité actuelle.
    if (nextVal > 2500) nextVal = 500; // Réinitialisation à 500 litres si elle dépasse 2500 litres.
    await updateSettings({ tankCapacity: nextVal }); // Enregistrement de la nouvelle capacité de réservoir.
  }; // Fin de la fonction handleCycleCapacity.

  return ( // Début du rendu visuel de la page des paramètres.
    <View style={styles.container}> {/* Conteneur principal de l'écran. */}
      <StatusBar style="dark" /> {/* Icônes sombres pour la barre de statut sur fond clair. */}
      
      {/* Barre d'en-tête supérieure */}
      <View style={styles.header}> {/* Conteneur de l'en-tête de la page. */}
        <TouchableOpacity // Bouton tactile de retour.
          style={styles.backButton} // Style du bouton de retour.
          onPress={() => router.back()} // Retour à l'écran précédent lors du clic.
        > {/* Début du contenu du bouton. */}
          <ArrowLeft size={22} color={Colors.text} /> {/* Icône de flèche vers la gauche. */}
        </TouchableOpacity> {/* Fin du bouton retour. */}
        <Text style={styles.headerTitle}>Paramètres</Text> {/* Titre principal de la page. */}
        <View style={{ width: 40 }} /> {/* Bloc invisible pour équilibrer le titre au centre. */}
      </View> {/* Fin de la barre d'en-tête. */}

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}> {/* Zone de défilement pour les options de paramètres. */}
        
        {/* Section: Seuils et configurations */}
        <View style={styles.sectionHeader}> {/* Conteneur du titre de section. */}
          <Text style={styles.sectionTitle}>Seuils et configurations</Text> {/* Titre de la section de configuration. */}
        </View> {/* Fin de la section de titre. */}

        <Card style={styles.card}> {/* Carte regroupant les configurations physiques. */}
          <Card.Content style={styles.cardContent}> {/* Contenu interne de la carte. */}
            
            {/* Paramètre Humidité */}
            <TouchableOpacity style={styles.row} onPress={handleCycleHumidity} activeOpacity={0.7}> {/* Option cliquable pour l'humidité. */}
              <View style={styles.rowLeft}> {/* Groupe d'icône et label à gauche. */}
                <Droplet size={20} color={Colors.gray} /> {/* Icône Droplet grise. */}
                <Text style={styles.rowLabel}>Seuil d'humidité du sol</Text> {/* Label de configuration. */}
              </View> {/* Fin du groupe gauche. */}
              <View style={styles.rowRight}> {/* Groupe de valeur et chevron à droite. */}
                <Text style={styles.rowValue}>{settings.soilHumidityThreshold} %</Text> {/* Valeur actuelle en pourcentage. */}
                <ChevronRight size={18} color={Colors.gray} /> {/* Chevron indicateur de cliquabilité. */}
              </View> {/* Fin du groupe droit. */}
            </TouchableOpacity> {/* Fin de l'option humidité. */}
            <View style={styles.divider} /> {/* Ligne de séparation fine entre les options. */}

            {/* Paramètre Durée d'arrosage */}
            <TouchableOpacity style={styles.row} onPress={handleCycleDuration} activeOpacity={0.7}> {/* Option pour la durée maximale d'arrosage. */}
              <View style={styles.rowLeft}> {/* Groupe d'icône et label à gauche. */}
                <Timer size={20} color={Colors.gray} /> {/* Icône Timer grise. */}
                <Text style={styles.rowLabel}>Durée maximale d'arrosage</Text> {/* Label de la configuration. */}
              </View> {/* Fin du groupe gauche. */}
              <View style={styles.rowRight}> {/* Groupe à droite. */}
                <Text style={styles.rowValue}>{settings.maxWateringDuration} min</Text> {/* Valeur de la durée en minutes. */}
                <ChevronRight size={18} color={Colors.gray} /> {/* Chevron. */}
              </View> {/* Fin du groupe droit. */}
            </TouchableOpacity> {/* Fin de l'option. */}
            <View style={styles.divider} /> {/* Ligne de séparation. */}

            {/* Paramètre Intervalle de lecture */}
            <TouchableOpacity style={styles.row} onPress={handleCycleInterval} activeOpacity={0.7}> {/* Option pour l'intervalle de lecture. */}
              <View style={styles.rowLeft}> {/* Groupe gauche. */}
                <Clock size={20} color={Colors.gray} /> {/* Icône d'horloge. */}
                <Text style={styles.rowLabel}>Intervalle de lecture</Text> {/* Label de l'intervalle. */}
              </View> {/* Fin du groupe gauche. */}
              <View style={styles.rowRight}> {/* Groupe droit. */}
                <Text style={styles.rowValue}>{settings.sensorReadInterval} min</Text> {/* Valeur de l'intervalle en minutes. */}
                <ChevronRight size={18} color={Colors.gray} /> {/* Chevron. */}
              </View> {/* Fin du groupe droit. */}
            </TouchableOpacity> {/* Fin de l'option. */}
            <View style={styles.divider} /> {/* Ligne de séparation. */}

            {/* Paramètre Capacité du réservoir */}
            <TouchableOpacity style={styles.row} onPress={handleCycleCapacity} activeOpacity={0.7}> {/* Option pour la capacité du réservoir. */}
              <View style={styles.rowLeft}> {/* Groupe gauche. */}
                <Layers size={20} color={Colors.gray} /> {/* Icône de couches. */}
                <Text style={styles.rowLabel}>Capacité du réservoir</Text> {/* Label de la capacité. */}
              </View> {/* Fin du groupe gauche. */}
              <View style={styles.rowRight}> {/* Groupe droit. */}
                <Text style={styles.rowValue}>{settings.tankCapacity} L</Text> {/* Valeur de capacité en litres. */}
                <ChevronRight size={18} color={Colors.gray} /> {/* Chevron. */}
              </View> {/* Fin du groupe droit. */}
            </TouchableOpacity> {/* Fin de l'option. */}
          </Card.Content> {/* Fin du contenu interne de la carte. */}
        </Card> {/* Fin de la carte configurations. */}

        {/* Section: Assistance & Pannes */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
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
                <HelpCircle size={20} color={Colors.gray} />
                <Text style={styles.rowLabel}>Signaler une panne</Text>
              </View>
              <ChevronRight size={18} color={Colors.gray} />
            </TouchableOpacity>
            
            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.row}
              onPress={() => router.push('/my-reports' as any)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <History size={20} color={Colors.gray} />
                <Text style={styles.rowLabel}>Mes signalements</Text>
              </View>
              <ChevronRight size={18} color={Colors.gray} />
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Section: Général */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}> {/* Conteneur du titre de section avec marge supérieure. */}
          <Text style={styles.sectionTitle}>Général</Text> {/* Titre de la section générale. */}
        </View> {/* Fin de la section de titre. */}

        <Card style={styles.card}> {/* Carte contenant les menus secondaires d'information. */}
          <Card.Content style={styles.cardContent}> {/* Contenu interne. */}
            
            {/* Option Historique des données */}
            <TouchableOpacity // Option cliquable de redirection historique.
              style={styles.row} // Style de ligne de paramètre.
              onPress={() => router.push('/history' as any)} // Redirection vers l'historique lors du clic.
              activeOpacity={0.7} // Rétroaction d'opacité.
            > {/* Début du contenu. */}
              <View style={styles.rowLeft}> {/* Groupe gauche. */}
                <History size={20} color={Colors.gray} /> {/* Icône Lucide History. */}
                <Text style={styles.rowLabel}>Historique des données</Text> {/* Label historique. */}
              </View> {/* Fin du groupe gauche. */}
              <ChevronRight size={18} color={Colors.gray} /> {/* Chevron. */}
            </TouchableOpacity> {/* Fin de l'option historique. */}
            <View style={styles.divider} /> {/* Séparateur. */}

            {/* Option Aide & Assistance */}
            <TouchableOpacity // Option cliquable pour l'aide.
              style={styles.row} // Style de ligne.
              onPress={() => Alert.alert('Aide', 'Pour toute assistance, contactez support@smartirrigation.com')} // Affichage d'une alerte informative au clic.
              activeOpacity={0.7} // Rétroaction d'opacité.
            > {/* Début du contenu. */}
              <View style={styles.rowLeft}> {/* Groupe gauche. */}
                <HelpCircle size={20} color={Colors.gray} /> {/* Icône Lucide HelpCircle. */}
                <Text style={styles.rowLabel}>Aide & Assistance</Text> {/* Label d'aide. */}
              </View> {/* Fin du groupe gauche. */}
              <ChevronRight size={18} color={Colors.gray} /> {/* Chevron. */}
            </TouchableOpacity> {/* Fin de l'option aide. */}
            <View style={styles.divider} /> {/* Séparateur. */}

            {/* Option À propos */}
            <TouchableOpacity // Option cliquable sur les informations de l'application.
              style={styles.row} // Style de ligne.
              onPress={() => Alert.alert('À propos', 'SmartIrrigation IoT App\nVersion: 1.0.0\nDéveloppé en React Native et Django REST Framework.')} // Affichage de l'alerte à propos de l'application au clic.
              activeOpacity={0.7} // Rétroaction d'opacité.
            > {/* Début du contenu. */}
              <View style={styles.rowLeft}> {/* Groupe gauche. */}
                <Info size={20} color={Colors.gray} /> {/* Icône Lucide Info. */}
                <Text style={styles.rowLabel}>À propos</Text> {/* Label à propos. */}
              </View> {/* Fin du groupe gauche. */}
              <ChevronRight size={18} color={Colors.gray} /> {/* Chevron. */}
            </TouchableOpacity> {/* Fin de l'option à propos. */}
          </Card.Content> {/* Fin du contenu interne de la carte générale. */}
        </Card> {/* Fin de la carte générale. */}

      </ScrollView> {/* Fin de la zone de défilement. */}
    </View> // Fin de la vue principale.
  ); // Fin du retour de la vue.
} // Fin de la déclaration du composant SettingsScreen.

const styles = StyleSheet.create({ // Déclaration de la feuille de style pour l'écran des paramètres.
  container: { // Style pour le conteneur racine de la page.
    flex: 1, // Utilise tout l'espace d'écran disponible.
    backgroundColor: Colors.background, // Couleur de fond gris clair du thème.
  }, // Fin du style container.
  header: { // Style pour l'en-tête supérieur blanc.
    flexDirection: 'row', // Alignement horizontal des éléments (retour, titre).
    justifyContent: 'space-between', // Espace égal entre le bouton retour et le bloc invisible.
    alignItems: 'center', // Alignement vertical au centre.
    paddingHorizontal: 20, // Remplissage sur les côtés de l'en-tête.
    paddingTop: 60, // Décalage en hauteur sous la barre de statut.
    paddingBottom: 20, // Remplissage en bas de l'en-tête.
    backgroundColor: '#FFFFFF', // Couleur de fond blanche.
    borderBottomWidth: 1, // Ligne fine de démarcation inférieure.
    borderBottomColor: Colors.grayLight, // Couleur gris clair pour la ligne de démarcation.
  }, // Fin du style header.
  backButton: { // Style pour le bouton tactile de retour.
    width: 40, // Largeur fixe.
    height: 40, // Hauteur fixe.
    borderRadius: 20, // Forme circulaire parfaite.
    backgroundColor: Colors.background, // Arrière-plan gris clair.
    alignItems: 'center', // Centrage horizontal de la flèche.
    justifyContent: 'center', // Centrage vertical de la flèche.
  }, // Fin du style backButton.
  headerTitle: { // Style du titre "Paramètres" dans l'en-tête.
    fontSize: 20, // Taille de police pour le titre.
    fontWeight: '800', // Police très grasse.
    color: Colors.text, // Couleur du texte sombre du thème.
  }, // Fin du style headerTitle.
  scrollContainer: { // Style du conteneur interne de ScrollView.
    paddingHorizontal: 20, // Remplissage sur les côtés.
    paddingTop: 20, // Remplissage en haut pour espacer du header.
    paddingBottom: 40, // Remplissage en bas pour laisser de l'espace.
  }, // Fin du style scrollContainer.
  sectionHeader: { // Style pour le titre de chaque section de paramètres.
    marginBottom: 10, // Espacement sous le titre de section avant les cartes.
  }, // Fin du style sectionHeader.
  sectionTitle: { // Style du texte de titre de section.
    fontSize: 15, // Taille de police moyenne.
    fontWeight: '800', // Police grasse pour ressortir.
    color: Colors.text, // Couleur sombre.
  }, // Fin du style sectionTitle.
  card: { // Style des cartes regroupant les lignes de paramètres.
    backgroundColor: '#FFFFFF', // Fond blanc opaque.
    borderRadius: 16, // Coins des cartes arrondis.
    borderWidth: 1, // Bordure fine.
    borderColor: '#E8ECE9', // Couleur de bordure grise claire.
    marginBottom: 20, // Marge en bas de chaque carte.
    ...Shadows.light, // Application d'une ombre légère.
  }, // Fin du style card.
  cardContent: { // Style pour le conteneur interne de la carte.
    paddingHorizontal: 16, // Marge interne sur les côtés de la carte.
    paddingVertical: 4, // Petite marge interne verticale.
  }, // Fin du style cardContent.
  row: { // Style pour chaque ligne de paramètre à l'intérieur de la carte.
    flexDirection: 'row', // Alignement en ligne (icône + label à gauche, valeur + chevron à droite).
    justifyContent: 'space-between', // Alignement horizontal espacé.
    alignItems: 'center', // Alignement vertical au centre.
    paddingVertical: 14, // Rembourrage vertical pour le tactile.
  }, // Fin du style row.
  rowLeft: { // Style du groupe gauche (icône + label).
    flexDirection: 'row', // En ligne.
    alignItems: 'center', // Centrage vertical.
    gap: 12, // Espace.
    flex: 1, // Remplissage.
  }, // Fin du style rowLeft.
  rowLabel: { // Style du texte.
    fontSize: 14, // Taille standard.
    color: Colors.text, // Couleur sombre.
    fontWeight: '600', // Poids.
  }, // Fin du style rowLabel.
  rowRight: { // Style du groupe droit.
    flexDirection: 'row', // En ligne.
    alignItems: 'center', // Centrage.
    gap: 8, // Espace.
  }, // Fin du style rowRight.
  rowValue: { // Style de la valeur de paramètre.
    fontSize: 14, // Taille standard.
    color: Colors.primary, // Vert principal.
    fontWeight: '700', // Gras.
  }, // Fin du style rowValue.
  divider: { // Style du séparateur.
    height: 1, // Épaisseur.
    backgroundColor: Colors.grayLight, // Couleur grise claire.
  }, // Fin du style divider.
}); // Fin de la création de la feuille de style.
