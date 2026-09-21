import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartIrrigation } from '../context/SmartIrrigationContext';
import { Colors, Shadows } from '../styles/Theme';
import { ArrowLeft, AlertTriangle, Droplet, CheckCircle, Info, RefreshCw, Trash2 } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, refreshData, deleteNotification, clearAllNotifications } = useSmartIrrigation();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} color={Colors.warning} />;
      case 'success':
        return <CheckCircle size={20} color={Colors.primary} />;
      case 'info':
      default:
        return <Info size={20} color={Colors.blue} />;
    }
  };

  const getAlertColors = (type: string) => {
    switch (type) {
      case 'warning':
        return { bg: Colors.warningLight, border: Colors.warning };
      case 'success':
        return { bg: Colors.successLight, border: Colors.primary };
      case 'info':
      default:
        return { bg: Colors.infoLight, border: Colors.blue };
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={refreshData}
            activeOpacity={0.7}
          >
            <RefreshCw size={18} color={Colors.text} />
          </TouchableOpacity>
          {notifications.length > 0 && (
            <TouchableOpacity 
              style={[styles.headerActionButton, { marginLeft: 8 }]}
              onPress={clearAllNotifications}
              activeOpacity={0.7}
            >
              <Trash2 size={18} color={Colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Info size={48} color={Colors.grayLight} />
            <Text style={styles.emptyText}>Aucune notification pour le moment.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {notifications.map((item) => {
              const alertStyle = getAlertColors(item.type);
              return (
                <View 
                  key={item.id} 
                  style={[
                    styles.notificationCard, 
                    { backgroundColor: alertStyle.bg, borderLeftColor: alertStyle.border, borderLeftWidth: 4 }
                  ]}
                >
                  <View style={styles.iconWrapper}>
                    {getAlertIcon(item.type)}
                  </View>
                  <View style={styles.details}>
                    <View style={styles.titleRow}>
                      <Text style={styles.alertTitle}>{item.title}</Text>
                      <View style={styles.rightInfo}>
                        <Text style={styles.alertTime}>{item.time}</Text>
                        <TouchableOpacity 
                          style={styles.deleteButton}
                          onPress={() => deleteNotification(item.id)}
                          activeOpacity={0.7}
                        >
                          <Trash2 size={14} color={Colors.danger} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.alertMessage}>{item.message}</Text>
                    <Text style={styles.alertDate}>{item.date}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  list: {
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...Shadows.light,
    borderWidth: 1,
    borderColor: '#E8ECE9',
  },
  iconWrapper: {
    marginRight: 14,
    justifyContent: 'center',
  },
  details: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  alertTime: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '600',
  },
  alertMessage: {
    fontSize: 13,
    color: '#444444',
    lineHeight: 18,
    fontWeight: '500',
  },
  alertDate: {
    fontSize: 10,
    color: Colors.gray,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },
});
