import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const passengerInfo = {
  count: '3 Passengers',
  details: '2 Adults, 1 Child · Baggage: 15kg/pax',
};

const itinerary = [
  {
    city: 'Bangalore',
    days: '3 Days',
    flight: {
      airlineLogo: 'AI',
      route: 'MAA ➔ BLR',
      flightName: 'Air India · AI-542',
      status: 'CONFIRMED',
      date: '12 Aug',
      departTime: '8:30',
      gate: 'A12',
      seat: '14A'
    },
    arrivalDate: '12 Aug, 07:05',
    departureDate: '15 Aug, 10:15',
    places: ['Lalbagh Botanical Garden', 'Cubbon Park', 'Nandi Hills']
  },
  {
    city: 'Goa',
    days: '4 Days',
    arrivalDate: '15 Aug, 11:30',
    departureDate: '19 Aug, 14:00',
    places: ['Baga Beach', 'Fort Aguada']
  },
  {
    city: 'Mumbai',
    days: '2 Days',
    arrivalDate: '19 Aug, 15:15',
    departureDate: '21 Aug, 20:00',
    places: ['Gateway of India', 'Marine Drive', 'Colaba Causeway']
  }
];

export default function TicketDetailsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.pageTitle}>Ticket Details</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.passengerSection}>
          <View style={styles.passengerCard}>
            <View style={styles.passengerHeader}>
              <Ionicons name="person-outline" size={18} color="#0055FF" />
              <Text style={styles.passengerTitle}>Passenger Info</Text>
            </View>
            <View style={styles.passengerContent}>
              <Text style={styles.passengerCount}>{passengerInfo.count}</Text>
              <Text style={styles.passengerDetails}>{passengerInfo.details}</Text>
            </View>
          </View>
        </View>

        <View style={styles.itinerarySection}>
          {itinerary.map((leg, index) => (
            <View key={index} style={styles.legContainer}>
              <View style={styles.legHeader}>
                <Text style={styles.cityName}>{leg.city}</Text>
                <View style={styles.daysBadge}>
                  <Text style={styles.daysText}>{leg.days}</Text>
                </View>
              </View>

              {leg.flight && (
                <View style={styles.ticketCard}>
                  {/* Top Half */}
                  <View style={styles.ticketTop}>
                    <View style={styles.ticketHeaderRow}>
                      <View style={styles.airlineLogoBox}>
                        <Text style={styles.airlineLogoText}>{leg.flight.airlineLogo}</Text>
                      </View>
                      <View style={styles.flightInfoBox}>
                        <Text style={styles.routeText}>{leg.flight.route}</Text>
                        <Text style={styles.flightNameText}>{leg.flight.flightName}</Text>
                      </View>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>{leg.flight.status}</Text>
                      </View>
                    </View>
                  </View>
                  
                  {/* Divider with Cutouts */}
                  <View style={styles.ticketDividerContainer}>
                    <View style={styles.cutoutLeft} />
                    <View style={styles.dashedLineWrapper}>
                      <View style={styles.dashedLine} />
                    </View>
                    <View style={styles.cutoutRight} />
                  </View>
                  
                  {/* Bottom Half */}
                  <View style={styles.ticketBottom}>
                    <View style={styles.ticketDetailBlock}>
                      <Text style={styles.ticketDetailLabel}>DATE</Text>
                      <Text style={styles.ticketDetailValue}>{leg.flight.date}</Text>
                    </View>
                    <View style={styles.ticketDetailBlock}>
                      <Text style={styles.ticketDetailLabel}>DEPART</Text>
                      <Text style={styles.ticketDetailValue}>{leg.flight.departTime}</Text>
                    </View>
                    <View style={styles.ticketDetailBlock}>
                      <Text style={styles.ticketDetailLabel}>GATE</Text>
                      <Text style={styles.ticketDetailValue}>{leg.flight.gate}</Text>
                    </View>
                    <View style={styles.ticketDetailBlock}>
                      <Text style={styles.ticketDetailLabel}>SEAT</Text>
                      <Text style={styles.ticketDetailValue}>{leg.flight.seat}</Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={styles.timesRow}>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>ARRIVAL</Text>
                  <Text style={styles.timeValue}>{leg.arrivalDate}</Text>
                </View>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>DEPARTURE</Text>
                  <Text style={styles.timeValue}>{leg.departureDate}</Text>
                </View>
              </View>

              <View style={styles.placesSection}>
                <View style={styles.placesHeader}>
                  <Ionicons name="location-outline" size={14} color="#0055FF" />
                  <Text style={styles.placesTitle}>Planned Places</Text>
                </View>
                <View style={styles.chipsContainer}>
                  {leg.places.map((place, pIdx) => (
                    <View key={pIdx} style={styles.chip}>
                      <Text style={styles.chipText}>{place}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {index < itinerary.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  passengerSection: {
    backgroundColor: '#F7F7F7',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  passengerCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
  },
  passengerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  passengerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  passengerContent: {
    paddingLeft: 26,
  },
  passengerCount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  passengerDetails: {
    fontSize: 13,
    color: '#8E8E93',
  },
  itinerarySection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  legContainer: {
    marginBottom: 24,
  },
  legHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cityName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginRight: 10,
  },
  daysBadge: {
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  daysText: {
    color: '#0055FF',
    fontSize: 13,
    fontWeight: '600',
  },
  timesRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeBlock: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  placesSection: {
    marginTop: 4,
  },
  placesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  placesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 6,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chipText: {
    color: '#4A4A4A',
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginTop: 24,
  },
  ticketCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  ticketTop: {
    padding: 16,
    paddingBottom: 12,
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  airlineLogoBox: {
    width: 44,
    height: 44,
    backgroundColor: '#FFEBEB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  airlineLogoText: {
    color: '#D32F2F',
    fontWeight: '800',
    fontSize: 16,
  },
  flightInfoBox: {
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  flightNameText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  statusBadge: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#00A962',
    fontSize: 11,
    fontWeight: '800',
  },
  ticketDividerContainer: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  cutoutLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    position: 'absolute',
    left: -10,
    zIndex: 1,
  },
  cutoutRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    position: 'absolute',
    right: -10,
    zIndex: 1,
  },
  dashedLineWrapper: {
    flex: 1,
    height: 1,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  dashedLine: {
    height: 2,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderStyle: 'dashed',
    marginTop: -1, // Hide top border to just show bottom dashes
  },
  ticketBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 12,
  },
  ticketDetailBlock: {
    flex: 1,
  },
  ticketDetailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  ticketDetailValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
});
