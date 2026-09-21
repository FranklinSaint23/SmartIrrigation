import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, BarChart2, TrendingUp, Droplet, Clock, AlertTriangle } from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function AdminStatisticsScreen() {
  const router = useRouter();
  const { statistics } = useSmartIrrigation();

  const numFarmers = statistics?.num_farmers ?? 25;
  const numTechs = statistics?.num_techs ?? 8;
  const numDevices = statistics?.num_devices ?? 22;
  const numPannesResolues = statistics?.num_pannes_resolues ?? 18;

  // Water consumption mock data for the weekly bar chart
  const waterConsumptionData = [
    { value: 180, label: 'Lun', frontColor: Colors.primary },
    { value: 240, label: 'Mar', frontColor: Colors.primary },
    { value: 310, label: 'Mer', frontColor: Colors.primary },
    { value: 150, label: 'Jeu', frontColor: Colors.primary },
    { value: 280, label: 'Ven', frontColor: Colors.primary },
    { value: 220, label: 'Sam', frontColor: Colors.primary },
    { value: 350, label: 'Dim', frontColor: Colors.primary },
  ];

  // Interventions resolved mock data
  const interventionsData = [
    { value: 4, label: 'Mai', frontColor: Colors.blue },
    { value: 7, label: 'Jui', frontColor: Colors.blue },
    { value: 5, label: 'Jul', frontColor: Colors.blue },
    { value: 9, label: 'Aoû', frontColor: Colors.blue },
  ];

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
        <Text style={styles.headerTitle}>Statistiques Plateforme</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* KPI Metrics */}
        <View style={styles.kpiRow}>
          <Card style={styles.kpiCard}>
            <Card.Content style={styles.kpiContent}>
              <Droplet size={18} color={Colors.primary} />
              <Text style={styles.kpiLabel}>Consommation</Text>
              <Text style={styles.kpiValue}>{statistics?.water_consumption ?? '1420 L'}</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.kpiCard}>
            <Card.Content style={styles.kpiContent}>
              <Clock size={18} color={Colors.blue} />
              <Text style={styles.kpiLabel}>Temps de Résolution</Text>
              <Text style={styles.kpiValue}>{statistics?.avg_resolution_time ?? '2.4 h'}</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Section 1: Water Consumption Chart */}
        <Text style={styles.sectionTitle}>Consommation d'eau (7 derniers jours)</Text>
        <Card style={styles.chartCard}>
          <Card.Content style={styles.chartCardContent}>
            <View style={styles.chartHeader}>
              <TrendingUp size={16} color={Colors.primary} />
              <Text style={styles.chartSubtitle}>Volume consommé par jour (Litres)</Text>
            </View>
            <View style={{ alignItems: 'center', marginTop: 12 }}>
              <BarChart
                data={waterConsumptionData}
                barWidth={22}
                noOfSections={4}
                height={160}
                yAxisLabelSuffix=" L"
                xAxisThickness={1}
                yAxisThickness={1}
                xAxisColor={Colors.grayLight}
                yAxisColor={Colors.grayLight}
                xAxisLabelTextStyle={{ fontSize: 10, color: Colors.gray, fontWeight: '600' }}
                yAxisTextStyle={{ fontSize: 9, color: Colors.gray, fontWeight: '600' }}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Section 2: Interventions Chart */}
        <Text style={styles.sectionTitle}>Interventions Résolues</Text>
        <Card style={styles.chartCard}>
          <Card.Content style={styles.chartCardContent}>
            <View style={styles.chartHeader}>
              <AlertTriangle size={16} color={Colors.blue} />
              <Text style={styles.chartSubtitle}>Nombre de pannes résolues par mois</Text>
            </View>
            <View style={{ alignItems: 'center', marginTop: 12 }}>
              <BarChart
                data={interventionsData}
                barWidth={26}
                noOfSections={3}
                height={150}
                xAxisThickness={1}
                yAxisThickness={1}
                xAxisColor={Colors.grayLight}
                yAxisColor={Colors.grayLight}
                xAxisLabelTextStyle={{ fontSize: 10, color: Colors.gray, fontWeight: '600' }}
                yAxisTextStyle={{ fontSize: 9, color: Colors.gray, fontWeight: '600' }}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Info Card */}
        <Card style={styles.summaryCard}>
          <Card.Content style={styles.summaryContent}>
            <BarChart2 size={24} color={Colors.primary} style={{ marginBottom: 8 }} />
            <Text style={styles.summaryText}>
              Le taux d'irrigation est optimal à <Text style={styles.bold}>92%</Text> à travers les {numFarmers} exploitations actives. La réactivité moyenne des techniciens est restée stable.
            </Text>
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
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    ...Shadows.light,
  },
  kpiContent: {
    padding: 14,
    gap: 4,
  },
  kpiLabel: {
    fontSize: 10,
    color: Colors.gray,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    marginBottom: 20,
    ...Shadows.light,
  },
  chartCardContent: {
    padding: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chartSubtitle: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: Colors.successLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    marginTop: 8,
  },
  summaryContent: {
    padding: 16,
  },
  summaryText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
    fontWeight: '600',
  },
  bold: {
    fontWeight: '800',
    color: Colors.primary,
  },
});
