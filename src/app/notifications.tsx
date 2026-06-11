import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { useTripContext } from '@/context/TripContext';

const { width } = Dimensions.get('window');

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, setNotifications } = useTripContext();

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDelete = (id: number) => {
    const newNotifications = notifications
      .map(group => ({
        ...group,
        data: group.data.filter(item => item.id !== id)
      }))
      .filter(group => group.data.length > 0);
    setNotifications(newNotifications);
  };

  const renderRightActions = (id: number) => {
    return (
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleDelete(id)}
        activeOpacity={0.8}
      >
        <Ionicons name="trash-outline" size={24} color="#FFF" />
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.pageTitle}>Notifications</Text>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={48} color="#E0E0E0" />
              <Text style={styles.emptyText}>You have no new notifications.</Text>
            </View>
          ) : (
            notifications.map((group, groupIndex) => (
              <View key={group.section}>
                {/* Section Header */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{group.section}</Text>
                  {groupIndex === 0 && (
                    <TouchableOpacity onPress={handleClearAll}>
                      <Text style={styles.markReadText}>Mark all as read</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Notification Items */}
                {group.data.map((item, index) => (
                  <Swipeable 
                    key={item.id} 
                    renderRightActions={() => renderRightActions(item.id)}
                    overshootRight={false}
                    friction={2}
                  >
                    <View style={styles.swipeableInner}>
                      <TouchableOpacity style={styles.notificationItem} activeOpacity={0.7}>
                        <View style={[styles.iconContainer, { backgroundColor: item.bg }]}>
                          <Ionicons name={item.icon as any} size={22} color={item.color} />
                        </View>
                        <View style={styles.textContent}>
                          <Text style={styles.notificationTitle}>{item.type}</Text>
                          <Text style={styles.notificationDesc}>{item.text}</Text>
                        </View>
                        <View style={styles.timeContainer}>
                          <Text style={styles.timeText}>{item.time}</Text>
                        </View>
                      </TouchableOpacity>
                      {/* Separator */}
                      {(index < group.data.length - 1 || groupIndex < notifications.length - 1) && (
                        <View style={styles.separator} />
                      )}
                    </View>
                  </Swipeable>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    paddingHorizontal: 20,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  markReadText: {
    fontSize: 13,
    color: '#0055FF',
    fontWeight: '700',
  },
  swipeableInner: {
    backgroundColor: '#FFF',
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  notificationDesc: {
    fontSize: 14,
    color: '#A0A0A5',
    lineHeight: 20,
  },
  timeContainer: {
    marginLeft: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#A0A0A5',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 84, // Align with the text content (20 padding + 48 icon + 16 margin)
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
    fontWeight: '500',
  },
});
