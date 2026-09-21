import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, Info, Droplet, Sprout, Thermometer, Droplets, Sun, CloudRain } from 'lucide-react-native';
import Svg, { Path, G, Polygon, Circle, Text as SvgText } from 'react-native-svg';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

export default function PredictionsScreen() {
  const router = useRouter();
  const { sensors } = useSmartIrrigation();

  // Simple TinyML calculation for need estimation
  const getNeedLevel = () => {
    if (sensors.soilHumidity < 25) return { text: 'Élevé', angle: 55, color: Colors.danger };
    if (sensors.soilHumidity < 40) return { text: 'Moyen', angle: 0, color: Colors.warning };
    return { text: 'Faible', angle: -55, color: Colors.primary };
  };

  const need = getNeedLevel();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prédictions (IA)</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main card */}
        <Card style={styles.mainCard}>
          <Card.Content style={styles.mainCardContent}>
            <Text style={styles.cardLabel}>Besoins en eau estimés</Text>
            
            <View style={styles.valueRow}>
              <View style={[styles.dropletCircle, { backgroundColor: Colors.successLight }]}>
                <Droplet size={24} color={Colors.primary} fill={Colors.primary} />
              </View>
              <View>
                <Text style={[styles.valueText, { color: need.color }]}>{need.text}</Text>
                <Text style={styles.confidenceText}>Confiance du modèle: 94%</Text>
              </View>
            </View>

            {/* Gauge */}
            <View style={styles.gaugeWrapper}>
              <Svg width="200" height="110" viewBox="0 0 200 100">
                <Path d="M 20 90 A 80 80 0 0 1 70 22" fill="none" stroke={Colors.primary} strokeWidth="14" />
                <Path d="M 73 20 A 80 80 0 0 1 127 20" fill="none" stroke={Colors.warning} strokeWidth="14" />
                <Path d="M 130 22 A 80 80 0 0 1 180 90" fill="none" stroke={Colors.danger} strokeWidth="14" />

                <SvgText x="25" y="98" fill={Colors.gray} fontSize="9" fontWeight="800" textAnchor="middle">Faible</SvgText>
                <SvgText x="100" y="14" fill={Colors.gray} fontSize="9" fontWeight="800" textAnchor="middle">Moyen</SvgText>
                <SvgText x="175" y="98" fill={Colors.gray} fontSize="9" fontWeight="800" textAnchor="middle">Élevé</SvgText>

                {/* Needle */}
                <G transform={`translate(100, 90) rotate(${need.angle})`}>
                  <Polygon points="-3,0 3,0 0,-65" fill={Colors.text} />
                  <Circle cx="0" cy="0" r="6" fill={Colors.text} />
                </G>
              </Svg>
            </View>
          </Card.Content>
        </Card>

        {/* Section: Recommendation */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommandation IA</Text>
        </View>

        <Card style={[styles.recommendationCard, { borderLeftColor: need.color, borderLeftWidth: 4 }]}>
          <Card.Content>
            <View style={styles.recHeader}>
              <Sprout size={18} color={need.color} style={{ marginRight: 8 }} />
              <Text style={[styles.recTitle, { color: need.color }]}>Action suggérée</Text>
            </View>
            <Text style={styles.recText}>
              {need.text === 'Élevé' 
                ? 'Arroser immédiatement la parcelle. Le sol manque cruellement d\'eau.'
                : need.text === 'Moyen'
                  ? 'Planifier un cycle d\'arrosage court ce soir pour maintenir une humidité optimale.'
                  : 'Aucun arrosage requis pour le moment. La plante dispose de réserves suffisantes.'}
            </Text>
          </Card.Content>
        </Card>

        {/* Section: Factors */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Facteurs d'analyse</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            
            {/* Soil Moisture */}
            <View style={styles.factorRow}>
              <View style={styles.factorLeft}>
                <Sprout size={18} color={Colors.gray} />
                <Text style={styles.factorLabel}>Humidité du sol actuelle</Text>
              </View>
              <Text style={styles.factorValue}>{sensors.soilHumidity} %</Text>
            </View>
            <View style={styles.divider} />

            {/* Temp */}
            <View style={styles.factorRow}>
              <View style={styles.factorLeft}>
                <Thermometer size={18} color={Colors.gray} />
                <Text style={styles.factorLabel}>Température</Text>
              </View>
              <Text style={styles.factorValue}>{sensors.temperature} °C</Text>
            </View>
            <View style={styles.divider} />

            {/* Air Hum */}
            <View style={styles.factorRow}>
              <View style={styles.factorLeft}>
                <Droplets size={18} color={Colors.gray} style={{ marginRight: 0 }} />
                <Text style={styles.factorLabel}>Humidité de l'air</Text>
              </View>
              <Text style={styles.factorValue}>{sensors.airHumidity} %</Text>
            </View>
            <View style={styles.divider} />

            {/* Light */}
            <View style={styles.factorRow}>
              <View style={styles.factorLeft}>
                <Sun size={18} color={Colors.gray} />
                <Text style={styles.factorLabel}>Luminosité</Text>
              </View>
              <Text style={styles.factorValue}>{sensors.light} lux</Text>
            </View>
          </Card.Content>
        </Card>

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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    marginBottom: 24,
    ...Shadows.light,
  },
  mainCardContent: {
    padding: 16,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  valueRow: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  dropletCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 22,
    fontWeight: '800',
  },
  confidenceText: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
    marginTop: 2,
  },
  gaugeWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    marginBottom: 24,
    ...Shadows.light,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  recText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    ...Shadows.light,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  factorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  factorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  factorLabel: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
  },
  factorValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grayLight,
  },
});
