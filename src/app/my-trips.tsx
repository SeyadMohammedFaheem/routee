import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { useTripContext } from '@/context/TripContext';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

export default function MyTripsScreen() {
  const router = useRouter();
  const { from } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { savedTrips } = useTripContext();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => {
            if (from === 'success') {
              router.push('/success');
            } else {
              router.back();
            }
          }}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.tripsBadge}>
            <Text style={styles.tripsBadgeText}>{savedTrips.length} Trips</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>My trips</Text>

        <View style={styles.contentArea}>
          {savedTrips.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="briefcase-outline" size={64} color="#D1D1D6" style={{ marginBottom: 16 }} />
              <Text style={styles.emptyTitle}>No trips yet</Text>
              <Text style={styles.emptySub}>Book a trip first to see your travel itineraries listed here.</Text>
              <TouchableOpacity style={styles.planNewBtnSolid} onPress={() => router.push('/build-route')}>
                <Text style={styles.planNewBtnSolidText}>Plan a new trip</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {savedTrips.map((trip: any) => {
                const isConfirmed = trip.status === 'Confirmed';
                const imgUri = isConfirmed 
                  ? 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80' 
                  : 'https://images.unsplash.com/photo-1564507592208-027f1cce86c9?auto=format&fit=crop&w=800&q=80';
                
                const routeString = trip.destinations.map((d: any) => d.code).join(' · ');
                
                const totalPassengers = trip.passengers.adults + trip.passengers.children + trip.passengers.infants;
                const totalNights = trip.destinations.reduce((sum: number, dest: any) => sum + (dest.nights || 0), 0);
                
                let flightsTotalPrice = 0;
                let selectedCount = 0;
                for (let i = 0; i < trip.destinations.length - 1; i++) {
                  if (trip.selectedFlights[i]) {
                    flightsTotalPrice += trip.selectedFlights[i].price * totalPassengers;
                    selectedCount++;
                  }
                }
                const taxesAndFees = Math.round(flightsTotalPrice * 0.12);
                const finalTotal = flightsTotalPrice + taxesAndFees;

                return (
                  <View key={trip.id}>
                    <View style={styles.tripCard}>
                      <View style={styles.cardImageContainer}>
                        <Image source={{ uri: imgUri }} style={StyleSheet.absoluteFill} />
                        <View style={styles.statusPill}>
                          <Text style={isConfirmed ? styles.statusTextConfirmed : styles.statusTextPlanning}>
                            {isConfirmed ? 'Confirmed' : 'Planning'}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.cardBody}>
                        <Text style={styles.cardTitle}>{routeString}</Text>
                        <View style={styles.badgesRow}>
                          <View style={styles.grayBadge}>
                            <Text style={styles.grayBadgeText}>
                              {trip.departDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </Text>
                          </View>
                          <View style={isConfirmed ? styles.greenBadge : styles.orangeBadge}>
                            <Text style={isConfirmed ? styles.greenBadgeText : styles.orangeBadgeText}>
                              {isConfirmed ? `${trip.destinations.length - 1} legs · ${totalNights} nights` : 'Draft'}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.footerRow}>
                          <View>
                            <Text style={isConfirmed ? styles.priceText : styles.priceTextGray}>
                              {finalTotal > 0 ? `₹${finalTotal.toLocaleString('en-IN')}` : '₹—'}
                            </Text>
                            <Text style={styles.subText}>
                              {isConfirmed 
                                ? `${totalPassengers} traveler${totalPassengers > 1 ? 's' : ''}`
                                : (selectedCount === 0 ? 'Flights not selected' : `${selectedCount} flights selected`)
                              }
                            </Text>
                          </View>
                          <View style={styles.buttonsRow}>
                            {isConfirmed ? (
                              <TouchableOpacity style={styles.outlineBtn} onPress={() => router.push('/ticket-details')}>
                                <Text style={styles.outlineBtnText}>Details</Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity style={styles.solidBtn} onPress={() => router.push('/build-route')}>
                                <Text style={styles.solidBtnText}>Continue</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* Plan a new trip */}
              <TouchableOpacity style={styles.planNewBtn} onPress={() => router.push('/build-route')}>
                <View style={styles.planNewIconWrapper}>
                  <Ionicons name="add" size={24} color="#0055FF" />
                </View>
                <View style={styles.planNewTextWrapper}>
                  <Text style={styles.planNewTitle}>Plan a new trip</Text>
                  <Text style={styles.planNewSubtitle}>Add cities, nights, search flights</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  tripsBadge: {
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tripsBadgeText: {
    color: '#0055FF',
    fontSize: 13,
    fontWeight: '700',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    padding: 4,
    borderRadius: 16,
    marginBottom: 20,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  segmentTabActive: {
    backgroundColor: '#FFF',
  },
  segmentTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  segmentTabTextActive: {
    color: '#1A1A1A',
  },
  contentArea: {
    backgroundColor: '#F7F7F9',
    paddingTop: 20,
    paddingHorizontal: 20,
    minHeight: Dimensions.get('window').height,
  },
  routeSummaryPill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 20,
  },
  routeCities: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeCityBlue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0055FF',
  },
  routeCityBlack: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  routeArrow: {
    marginHorizontal: 6,
  },
  routeNights: {
    fontSize: 12,
    color: '#A0A0A5',
  },
  tripCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardImageContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  statusPill: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusTextConfirmed: {
    color: '#00A859',
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextPlanning: {
    color: '#FF6B00',
    fontSize: 12,
    fontWeight: '700',
  },
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  badgesRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  grayBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  grayBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  greenBadge: {
    backgroundColor: '#E4F8EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  greenBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#20C968',
  },
  orangeBadge: {
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  orangeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B00',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  priceTextGray: {
    fontSize: 18,
    fontWeight: '800',
    color: '#A0A0A5',
    marginBottom: 4,
  },
  subText: {
    fontSize: 11,
    color: '#A0A0A5',
  },
  buttonsRow: {
    flexDirection: 'row',
  },
  outlineBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginRight: 10,
  },
  outlineBtnText: {
    color: '#4A4A4A',
    fontSize: 13,
    fontWeight: '700',
  },
  solidBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#0055FF',
  },
  solidBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  planNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F9',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 16,
    marginBottom: 0,
  },
  planNewIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  planNewTextWrapper: {
    flex: 1,
  },
  planNewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  planNewSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  planNewBtnSolid: {
    backgroundColor: '#0055FF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  planNewBtnSolidText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
