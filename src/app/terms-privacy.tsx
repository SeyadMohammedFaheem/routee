import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type DocumentSection = {
  title: string;
  paragraphs: string[];
};

const TERMS_SECTIONS: DocumentSection[] = [
  {
    title: '1. Acceptance of Terms',
    paragraphs: [
      'By accessing or using the Routee application, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not download or use the application.',
      'We reserve the right to modify or replace these terms at any time. Your continued use of the app after changes indicates your acceptance of the updated terms.'
    ]
  },
  {
    title: '2. Travel Bookings & Flight Intermediary',
    paragraphs: [
      'Routee functions as a travel assistant and search intermediary. All flight bookings, tickets, and carrier reservations made through the app are processed and fulfilled by respective airline carriers.',
      'Routee is not responsible for airline schedule changes, cancellations, flight delays, or carrier policy updates. All disputes regarding flight tickets must be resolved directly with the airline.'
    ]
  },
  {
    title: '3. User Account Responsibility',
    paragraphs: [
      'You are responsible for maintaining the confidentiality of your account credentials, login details, and personal profile information.',
      'You agree to provide accurate, current, and complete details when editing your travel profile, setting preferences, or buying tickets.'
    ]
  },
  {
    title: '4. Limitation of Liability',
    paragraphs: [
      'To the maximum extent permitted by law, Routee shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or travel disruptions.',
      'Maps, itineraries, geocoding search suggestions, and transport time calculations are approximations powered by third-party APIs (such as OpenStreetMap) and are provided "as-is" without warranty of accuracy.'
    ]
  }
];

const PRIVACY_SECTIONS: DocumentSection[] = [
  {
    title: '1. Information We Collect',
    paragraphs: [
      'Personal Profile Data: When you set up or edit your profile settings, we collect details like your full name, email address, phone number, date of birth, and profile photo.',
      'Travel Logs: We collect and store your customized daily timelines, saved itineraries, passenger selections, and booked flights to synchronize plans across your devices.'
    ]
  },
  {
    title: '2. How We Use Your Information',
    paragraphs: [
      'We use the collected information to facilitate ticket purchases, compile itinerary timelines, suggest nearby recommendations, and provide customer assistance.',
      'We do not sell, rent, or trade your personal profile data to third-party marketing companies.'
    ]
  },
  {
    title: '3. Geolocational Data & OpenStreetMap Search',
    paragraphs: [
      'To provide real-time recommendations, Routee requests access to your location services. This data is used solely to query OpenStreetMap for nearby parks, landmarks, restaurants, and museums.',
      'You can disable location permissions in your device settings at any time, which may limit the geocoding features in the daily planner.'
    ]
  },
  {
    title: '4. Data Deletion & Security',
    paragraphs: [
      'We implement industry-standard encryption and security measures to protect your personal details and travel records.',
      'You have the right to request a copy of your personal data or ask for permanent account deletion by contacting us at support@routeeapp.example.com.'
    ]
  }
];

export default function TermsPrivacyScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Terms' | 'Privacy'>('Terms');

  const activeSections = activeTab === 'Terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Privacy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title & Date */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Legal Agreements</Text>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>Last Updated: June 10, 2026</Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity 
            style={[styles.segmentTab, activeTab === 'Terms' && styles.segmentTabActive]}
            onPress={() => setActiveTab('Terms')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentTabText, activeTab === 'Terms' && styles.segmentTabTextActive]}>
              Terms of Service
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.segmentTab, activeTab === 'Privacy' && styles.segmentTabActive]}
            onPress={() => setActiveTab('Privacy')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentTabText, activeTab === 'Privacy' && styles.segmentTabTextActive]}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>

        {/* Doc Reader */}
        <View style={styles.docCard}>
          {activeSections.map((sec, secIdx) => (
            <View key={sec.title} style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              {sec.paragraphs.map((para, paraIdx) => (
                <Text key={paraIdx} style={styles.paragraphText}>
                  {para}
                </Text>
              ))}
              {secIdx < activeSections.length - 1 && <View style={styles.sectionDivider} />}
            </View>
          ))}
        </View>

        {/* Support Callout */}
        <View style={styles.footerCallout}>
          <Text style={styles.footerCalloutText}>
            Questions about our terms or policies? Get in touch with our legal team at legal@routeeapp.example.com.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleContainer: {
    marginTop: 12,
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  titleText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  dateBadge: {
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateBadgeText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '700',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#EAEAEA',
    padding: 4,
    borderRadius: 14,
    marginBottom: 20,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentTabActive: {
    backgroundColor: '#FFF',
  },
  segmentTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  segmentTabTextActive: {
    color: '#1A1A1A',
    fontWeight: '800',
  },
  docCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 20,
    marginBottom: 20,
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  paragraphText: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 12,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginTop: 12,
    marginBottom: 20,
  },
  footerCallout: {
    backgroundColor: '#EEF4FF',
    borderWidth: 1,
    borderColor: '#D0E2FF',
    borderRadius: 16,
    padding: 16,
  },
  footerCalloutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0055FF',
    lineHeight: 18,
    textAlign: 'center',
  },
});
