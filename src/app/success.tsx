import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { useTripContext } from '@/context/TripContext';
import ShareTripModal from '@/components/ShareTripModal';

const { width } = Dimensions.get('window');

export default function SuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { destinations, selectedFlights, departDate, userProfile } = useTripContext();
  const [isShareModalVisible, setShareModalVisible] = React.useState(false);

  const totalNights = destinations.reduce((sum, dest) => sum + (dest.nights || 0), 0);
  const routeCodes = destinations.map(d => d.code);
  
  const startDateStr = departDate.toLocaleDateString('en-GB', { day: 'numeric' });
  const endDate = new Date(departDate);
  endDate.setDate(endDate.getDate() + totalNights);
  const endDateStr = endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  
  const dateRangeStr = `${startDateStr}–${endDateStr}`;
  const durationStr = `${totalNights} Nights`;
  const shareLink = `tripway.app/t/${routeCodes.join('-').toLowerCase()}-${Math.floor(Math.random() * 100)}x`;

  const legs = [];
  for (let i = 0; i < destinations.length - 1; i++) {
    const from = destinations[i];
    const to = destinations[i + 1];
    
    const legDate = new Date(departDate);
    let nightsSoFar = 0;
    for (let j = 0; j <= i; j++) {
      nightsSoFar += destinations[j].nights;
    }
    legDate.setDate(legDate.getDate() + nightsSoFar);

    legs.push({
      id: i,
      fromCode: from.code,
      toCode: to.code,
      dateText: legDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      flight: selectedFlights[i]
    });
  }

  const generateGate = (index: number) => {
    const gates = ['A12', 'B7', 'C3', 'D21', 'E5'];
    return gates[index % gates.length];
  };

  const generateSeat = (index: number) => {
    const seats = ['14A', '22C', '8F', '12B', '3A'];
    return seats[index % seats.length];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Tabs.Screen options={{ href: null, headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={32} color="#FFF" />
          </View>
          <Text style={styles.titleText}>You're all set,{'\n'}{userProfile.name}!</Text>
          <Text style={styles.subtitleText}>Your {legs.length}-leg trip has been booked.{'\n'}Check your email for e-tickets.</Text>
        </View>

        {/* Booking Reference Card */}
        <View style={styles.referenceCard}>
          <View>
            <Text style={styles.referenceLabel}>BOOKING REFERENCE</Text>
            <Text style={styles.referenceCode}>TW-2408-XK7</Text>
          </View>
          <TouchableOpacity style={styles.copyBtn}>
            <Ionicons name="copy-outline" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        {/* Tickets Section */}
        <View style={styles.ticketsSection}>
          {legs.map((leg, index) => (
            <View key={leg.id} style={styles.ticketCard}>
              <View style={styles.ticketTop}>
                <View style={styles.airlineLogo}>
                  <Text style={styles.airlineCode}>{leg.flight?.code || 'XX'}</Text>
                </View>
                <View style={styles.ticketMainInfo}>
                  <Text style={styles.routeText}>{leg.fromCode} <Ionicons name="arrow-forward" size={14} /> {leg.toCode}</Text>
                  <Text style={styles.flightSubText}>{leg.flight?.airline || 'Unknown Airline'} · {leg.flight?.code || 'XX'}-{500 + index * 100}</Text>
                </View>
                <View style={styles.confirmedPill}>
                  <Text style={styles.confirmedText}>CONFIRMED</Text>
                </View>
              </View>

              {/* Dashed Line separator */}
              <View style={styles.dashedDividerWrapper}>
                <View style={styles.cutoutLeft} />
                <View style={styles.dashedLine} />
                <View style={styles.cutoutRight} />
              </View>

              <View style={styles.ticketBottom}>
                <View style={styles.ticketDetailCol}>
                  <Text style={styles.ticketDetailLabel}>DATE</Text>
                  <Text style={styles.ticketDetailValue}>{leg.dateText}</Text>
                </View>
                <View style={styles.ticketDetailCol}>
                  <Text style={styles.ticketDetailLabel}>DEPART</Text>
                  <Text style={styles.ticketDetailValue}>{leg.flight?.depart || 'TBD'}</Text>
                </View>
                <View style={styles.ticketDetailCol}>
                  <Text style={styles.ticketDetailLabel}>GATE</Text>
                  <Text style={styles.ticketDetailValue}>{generateGate(index)}</Text>
                </View>
                <View style={styles.ticketDetailCol}>
                  <Text style={styles.ticketDetailLabel}>SEAT</Text>
                  <Text style={styles.ticketDetailValue}>{generateSeat(index)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Floating Action Bar */}
      <View style={styles.floatingActionBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setShareModalVisible(true)}>
          <Ionicons name="share-social-outline" size={18} color="#8E8E93" />
          <Text style={styles.actionBtnText}>Share trip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { marginLeft: 12 }]} onPress={() => router.push({ pathname: '/my-trips', params: { from: 'success' } })}>
          <Ionicons name="briefcase-outline" size={18} color="#8E8E93" />
          <Text style={styles.actionBtnText}>My trips</Text>
        </TouchableOpacity>
      </View>

      <ShareTripModal 
        visible={isShareModalVisible}
        onClose={() => setShareModalVisible(false)}
        routeCodes={routeCodes}
        dates={dateRangeStr}
        duration={durationStr}
        link={shareLink}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  successHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#00D65B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitleText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  referenceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#0055FF',
    backgroundColor: '#F5F8FF',
    marginBottom: 30,
  },
  referenceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A0A0A5',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  referenceCode: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0055FF',
    letterSpacing: 1,
  },
  copyBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  ticketsSection: {
    backgroundColor: '#F7F7F9',
    paddingHorizontal: 20,
    paddingTop: 24,
    flexGrow: 1,
  },
  ticketCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  ticketTop: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  airlineLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  airlineCode: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E02020',
  },
  ticketMainInfo: {
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  flightSubText: {
    fontSize: 12,
    color: '#A0A0A5',
  },
  confirmedPill: {
    backgroundColor: '#E4F8EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  confirmedText: {
    color: '#20C968',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dashedDividerWrapper: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  cutoutLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F7F7F9',
    position: 'absolute',
    left: -10,
    zIndex: 2,
  },
  cutoutRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F7F7F9',
    position: 'absolute',
    right: -10,
    zIndex: 2,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderStyle: 'dashed',
    marginHorizontal: 16,
  },
  ticketBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  ticketDetailCol: {
    flex: 1,
  },
  ticketDetailLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A0A0A5',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  ticketDetailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  floatingActionBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 100,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A4A4A',
    marginLeft: 8,
  },
});
