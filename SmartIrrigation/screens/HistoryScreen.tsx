import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, Calendar, TrendingUp } from 'lucide-react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { Card } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const chartWidth = width - 70;

export default function HistoryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('week');

  // Simulated data sets based on filter
  const getHumidityData = () => {
    switch (filter) {
      case 'day':
        return [
          { value: 32, label: '00h' },
          { value: 30, label: '04h' },
          { value: 28, label: '08h' },
          { value: 45, label: '12h' },
          { value: 42, label: '16h' },
          { value: 38, label: '20h' },
        ];
      case 'month':
        return [
          { value: 35, label: 'S1' },
          { value: 42, label: 'S2' },
          { value: 38, label: 'S3' },
          { value: 48, label: 'S4' },
        ];
      case 'week':
      default:
        return [
          { value: 35, label: 'Lun' },
          { value: 32, label: 'Mar' },
          { value: 30, label: 'Mer' },
          { value: 48, label: 'Jeu' },
          { value: 45, label: 'Ven' },
          { value: 40, label: 'Sam' },
          { value: 38, label: 'Dim' },
        ];
    }
  };

  const getTemperatureData = () => {
    switch (filter) {
      case 'day':
        return [
          { value: 22, label: '00h' },
          { value: 20, label: '04h' },
          { value: 24, label: '08h' },
          { value: 29, label: '12h' },
          { value: 28, label: '16h' },
          { value: 25, label: '20h' },
        ];
      case 'month':
        return [
          { value: 26, label: 'S1' },
          { value: 28, label: 'S2' },
          { value: 27, label: 'S3' },
          { value: 29, label: 'S4' },
        ];
      case 'week':
      default:
        return [
          { value: 26, label: 'Lun' },
          { value: 28, label: 'Mar' },
          { value: 29, label: 'Mer' },
          { value: 27, label: 'Jeu' },
          { value: 28, label: 'Ven' },
          { value: 26, label: 'Sam' },
          { value: 25, label: 'Dim' },
        ];
    }
  };

  const getWaterConsumptionData = () => {
    switch (filter) {
      case 'day':
        return [
          { value: 4, label: '00h', frontColor: Colors.blue },
          { value: 0, label: '04h', frontColor: Colors.blue },
          { value: 8, label: '08h', frontColor: Colors.blue },
          { value: 12, label: '12h', frontColor: Colors.blue },
          { value: 5, label: '16h', frontColor: Colors.blue },
          { value: 0, label: '20h', frontColor: Colors.blue },
        ];
      case 'month':
        return [
          { value: 120, label: 'S1', frontColor: Colors.blue },
          { value: 140, label: 'S2', frontColor: Colors.blue },
          { value: 110, label: 'S3', frontColor: Colors.blue },
          { value: 160, label: 'S4', frontColor: Colors.blue },
        ];
      case 'week':
      default:
        return [
          { value: 12, label: 'Lun', frontColor: Colors.blue },
          { value: 15, label: 'Mar', frontColor: Colors.blue },
          { value: 10, label: 'Mer', frontColor: Colors.blue },
          { value: 18, label: 'Jeu', frontColor: Colors.blue },
          { value: 14, label: 'Ven', frontColor: Colors.blue },
          { value: 8, label: 'Sam', frontColor: Colors.blue },
          { value: 6, label: 'Dim', frontColor: Colors.blue },
        ];
    }
  };

  const getWateringCountData = () => {
    switch (filter) {
      case 'day':
        return [
          { value: 1, label: '00h', frontColor: Colors.primary },
          { value: 0, label: '04h', frontColor: Colors.primary },
          { value: 2, label: '08h', frontColor: Colors.primary },
          { value: 2, label: '12h', frontColor: Colors.primary },
          { value: 1, label: '16h', frontColor: Colors.primary },
          { value: 0, label: '20h', frontColor: Colors.primary },
        ];
      case 'month':
        return [
          { value: 14, label: 'S1', frontColor: Colors.primary },
          { value: 18, label: 'S2', frontColor: Colors.primary },
          { value: 12, label: 'S3', frontColor: Colors.primary },
          { value: 20, label: 'S4', frontColor: Colors.primary },
        ];
      case 'week':
      default:
        return [
          { value: 2, label: 'Lun', frontColor: Colors.primary },
          { value: 3, label: 'Mar', frontColor: Colors.primary },
          { value: 1, label: 'Mer', frontColor: Colors.primary },
          { value: 4, label: 'Jeu', frontColor: Colors.primary },
          { value: 2, label: 'Ven', frontColor: Colors.primary },
          { value: 1, label: 'Sam', frontColor: Colors.primary },
          { value: 1, label: 'Dim', frontColor: Colors.primary },
        ];
    }
  };

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
        <Text style={styles.headerTitle}>Historique</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Segment tabs */}
      <View style={styles.filterBar}>
        <TouchableOpacity 
          style={[styles.filterTab, filter === 'day' && styles.filterTabActive]}
          onPress={() => setFilter('day')}
        >
          <Text style={[styles.filterTabText, filter === 'day' && styles.filterTabActiveText]}>Jour</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, filter === 'week' && styles.filterTabActive]}
          onPress={() => setFilter('week')}
        >
          <Text style={[styles.filterTabText, filter === 'week' && styles.filterTabActiveText]}>Semaine</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, filter === 'month' && styles.filterTabActive]}
          onPress={() => setFilter('month')}
        >
          <Text style={[styles.filterTabText, filter === 'month' && styles.filterTabActiveText]}>Mois</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Chart 1: Humidity */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <TrendingUp size={16} color={Colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.chartTitle}>Historique d'humidité du sol (%)</Text>
            </View>
            <View style={styles.chartWrapper}>
              <LineChart
                data={getHumidityData()}
                width={chartWidth}
                height={160}
                color={Colors.primary}
                thickness={3}
                noOfSections={4}
                maxValue={100}
                dataPointsColor={Colors.primary}
                yAxisTextStyle={{ color: Colors.gray, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: Colors.gray, fontSize: 10 }}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Chart 2: Temp */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <TrendingUp size={16} color="#E57373" style={{ marginRight: 6 }} />
              <Text style={styles.chartTitle}>Historique de température (°C)</Text>
            </View>
            <View style={styles.chartWrapper}>
              <LineChart
                data={getTemperatureData()}
                width={chartWidth}
                height={160}
                color="#E57373"
                thickness={3}
                noOfSections={4}
                maxValue={50}
                dataPointsColor="#E57373"
                yAxisTextStyle={{ color: Colors.gray, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: Colors.gray, fontSize: 10 }}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Chart 3: Water consumption */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <Calendar size={16} color={Colors.blue} style={{ marginRight: 6 }} />
              <Text style={styles.chartTitle}>Consommation d'eau (L)</Text>
            </View>
            <View style={styles.chartWrapper}>
              <BarChart
                data={getWaterConsumptionData()}
                barWidth={filter === 'day' ? 20 : filter === 'month' ? 40 : 22}
                width={chartWidth}
                height={160}
                noOfSections={4}
                yAxisTextStyle={{ color: Colors.gray, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: Colors.gray, fontSize: 10 }}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Chart 4: Watering occurrences */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <Calendar size={16} color={Colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.chartTitle}>Fréquence d'arrosage (cycles)</Text>
            </View>
            <View style={styles.chartWrapper}>
              <BarChart
                data={getWateringCountData()}
                barWidth={filter === 'day' ? 20 : filter === 'month' ? 40 : 22}
                width={chartWidth}
                height={160}
                noOfSections={4}
                yAxisTextStyle={{ color: Colors.gray, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: Colors.gray, fontSize: 10 }}
              />
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
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  filterTab: {
    flex: 1,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: Colors.background,
    marginHorizontal: 4,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: '700',
  },
  filterTabActiveText: {
    color: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    marginBottom: 20,
    paddingVertical: 4,
    ...Shadows.light,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
});
