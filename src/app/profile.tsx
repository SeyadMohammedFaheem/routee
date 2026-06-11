import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useTripContext } from '@/context/TripContext';
import { useAuth } from '@/context/AuthContext';

const LANGUAGE_LABELS: Record<string, string> = {
  'en-in': 'English (IN)',
  'en-us': 'English (US)',
  'fr': 'Français',
  'es': 'Español',
};

const CURRENCY_LABELS: Record<string, string> = {
  'inr': 'INR (₹)',
  'usd': 'USD ($)',
  'eur': 'EUR (€)',
  'gbp': 'GBP (£)',
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profileImageUri, setProfileImageUri, userProfile, userSettings, setUserSettings, savedTrips } = useTripContext();
  const { signOut } = useAuth();

  const currentLanguageLabel = LANGUAGE_LABELS[userSettings.language] || 'English (IN)';
  const currentCurrencyLabel = CURRENCY_LABELS[userSettings.currency] || 'INR (₹)';
  const langCurrencySubtitle = `${currentLanguageLabel}, ${currentCurrencyLabel}`;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  const renderSettingItem = (icon: any, title: string, subtitle?: string, hasSwitch?: boolean, value?: boolean, onValueChange?: (val: boolean) => void, isDestructive?: boolean, onPress?: () => void) => (
    <TouchableOpacity style={styles.settingItem} activeOpacity={0.7} disabled={hasSwitch} onPress={onPress}>
      <View style={[styles.iconContainer, isDestructive && { backgroundColor: '#FFEBEB' }]}>
        <Ionicons name={icon} size={20} color={isDestructive ? '#D32F2F' : '#0055FF'} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, isDestructive && { color: '#D32F2F' }]}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {hasSwitch ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange} 
          trackColor={{ false: '#E0E0E0', true: '#0055FF' }}
          thumbColor="#FFF"
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      )}
    </TouchableOpacity>
  );

  // Calculate unique destinations to show instead of countries, or just keep it as 1 for India.
  const uniqueDestinations = new Set();
  savedTrips.forEach(trip => {
    trip.destinations.forEach(d => uniqueDestinations.add(d.id));
  });

  return (
    <View style={styles.container}>
      {/* Background Header */}
      <View style={[styles.headerBackground, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage} activeOpacity={0.8}>
            <Image 
              source={{ uri: profileImageUri }} 
              style={styles.profileImage} 
            />
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
        </View>
        
        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>{savedTrips.length}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>{uniqueDestinations.size || 0}</Text>
            <Text style={styles.statLabel}>Places</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          {renderSettingItem('person-outline', 'Personal Information', 'Name, email, phone number', false, undefined, undefined, false, () => router.push('/personal-info'))}
          <View style={styles.divider} />
          {renderSettingItem('card-outline', 'Payment Methods', 'Visa, Mastercard, UPI', false, undefined, undefined, false, () => router.push('/payment-methods'))}
          <View style={styles.divider} />
          {renderSettingItem('shield-checkmark-outline', 'Login & Security', 'Password, 2FA', false, undefined, undefined, false, () => router.push('/login-security'))}
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          {renderSettingItem(
            'notifications-outline', 
            'Push Notifications', 
            'Stay updated on your trips', 
            true, 
            userSettings.notificationsEnabled, 
            (val) => setUserSettings(prev => ({ ...prev, notificationsEnabled: val }))
          )}
          <View style={styles.divider} />
          {renderSettingItem('globe-outline', 'Language & Currency', langCurrencySubtitle, false, undefined, undefined, false, () => router.push('/language-currency'))}
        </View>

        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.card}>
          {renderSettingItem('help-buoy-outline', 'Help Center', 'Get support for your bookings', false, undefined, undefined, false, () => router.push('/help-center'))}
          <View style={styles.divider} />
          {renderSettingItem('document-text-outline', 'Terms & Privacy Policy', undefined, false, undefined, undefined, false, () => router.push('/terms-privacy'))}
        </View>

        <View style={[styles.card, { marginTop: 20, marginBottom: 40 }]}>
          {renderSettingItem('log-out-outline', 'Log Out', undefined, false, undefined, undefined, true, () => {
            import('react-native').then(({ Alert }) => {
              Alert.alert('Log Out', 'Are you sure you want to log out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: async () => await signOut() }
              ]);
            });
          })}
        </View>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerBackground: {
    backgroundColor: '#0055FF',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1A1A1A',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 16,
  },
  statBlock: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
    marginTop: 16,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 72,
  },
});
