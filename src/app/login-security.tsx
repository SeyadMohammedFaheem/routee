import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTripContext } from '@/context/TripContext';

export default function LoginSecurityScreen() {
  const router = useRouter();
  const { userSettings, setUserSettings } = useTripContext();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7} onPress={() => router.push('/change-password')}>
            <View style={styles.iconContainer}>
              <Ionicons name="key-outline" size={20} color="#0055FF" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Change Password</Text>
              <Text style={styles.settingSubtitle}>Last changed 3 months ago</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Extra Security</Text>
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#0055FF" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
              <Text style={styles.settingSubtitle}>Secure your account with 2FA</Text>
            </View>
            <Switch 
              value={userSettings.twoFactor} 
              onValueChange={(val) => setUserSettings(prev => ({ ...prev, twoFactor: val }))} 
              trackColor={{ false: '#E0E0E0', true: '#0055FF' }} 
              thumbColor="#FFF" 
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="finger-print-outline" size={20} color="#0055FF" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Face ID / Biometrics</Text>
              <Text style={styles.settingSubtitle}>Log in faster with biometrics</Text>
            </View>
            <Switch 
              value={userSettings.biometrics} 
              onValueChange={(val) => setUserSettings(prev => ({ ...prev, biometrics: val }))} 
              trackColor={{ false: '#E0E0E0', true: '#0055FF' }} 
              thumbColor="#FFF" 
            />
          </View>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, marginBottom: 24,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#8E8E93', marginBottom: 12, marginTop: 24, textTransform: 'uppercase', marginLeft: 4 },
  card: {
    backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden',
  },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF4FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  settingTextContainer: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  settingSubtitle: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 72 },
});
