import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { useTripContext } from '@/context/TripContext';

export default function ReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { destinations, passengers, departDate, selectedFlights, confirmTrip } = useTripContext();
  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  const totalNights = destinations.reduce((sum, dest) => sum + (dest.nights || 0), 0);

  // Generate dynamic legs to display in the timeline
  const legs = [];
  let flightsTotalPrice = 0;

  for (let i = 0; i < destinations.length - 1; i++) {
    const from = destinations[i];
    const to = destinations[i + 1];
    
    // Calculate date for this leg
    const legDate = new Date(departDate);
    let nightsSoFar = 0;
    for (let j = 0; j <= i; j++) {
      nightsSoFar += destinations[j].nights;
    }
    legDate.setDate(legDate.getDate() + nightsSoFar);

    const flightForLeg = selectedFlights[i];
    if (flightForLeg) {
      flightsTotalPrice += flightForLeg.price * totalPassengers;
    }

    legs.push({
      id: i,
      from: from.name,
      to: to.name,
      fromCode: from.code,
      toCode: to.code,
      dateText: legDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      flight: flightForLeg
    });
  }

  // Calculate arrival date for the final stop
  const arrivalDate = new Date(departDate);
  arrivalDate.setDate(arrivalDate.getDate() + totalNights);
  const endDest = destinations[destinations.length - 1];

  const taxesAndFees = Math.round(flightsTotalPrice * 0.12); // 12% mock tax
  const finalTotal = flightsTotalPrice + taxesAndFees;

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' }, href: null }} />
      
      {/* Header Area */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review</Text>
        <View style={styles.adultBadge}>
          <Ionicons name="person-outline" size={14} color="#0055FF" />
          <Text style={styles.adultBadgeText}>{totalPassengers} · {legs.length} legs</Text>
        </View>
      </View>

      {/* Stepper */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepperLineBackground} />
        <View style={[styles.stepperLineProgress, { width: '100%' }]} />
        
        <View style={styles.step}>
          <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
            <Ionicons name="checkmark" size={14} color="#FFF" />
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Route</Text>
        </View>

        <View style={styles.step}>
          <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
            <Ionicons name="checkmark" size={14} color="#FFF" />
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Nights</Text>
        </View>

        <View style={styles.step}>
          <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
            <Ionicons name="checkmark" size={14} color="#FFF" />
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Flights</Text>
        </View>

        <View style={styles.step}>
          <View style={[styles.stepCircle, styles.stepCircleActive]}>
            <Text style={[styles.stepNumber, styles.stepNumberActive]}>4</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Review</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Route Summary Pill */}
        <View style={styles.routeSummaryPill}>
          <View style={styles.routeSummaryCodes}>
            {destinations.map((dest, index) => (
              <React.Fragment key={dest.id}>
                <Text style={dest.isStart || dest.isEnd ? styles.routeSummaryBlue : styles.routeSummaryBlack}>{dest.code}</Text>
                {index < destinations.length - 1 && (
                  <Ionicons name="chevron-forward" size={12} color="#D1D1D6" style={{ marginHorizontal: 6 }} />
                )}
              </React.Fragment>
            ))}
          </View>
          <Text style={styles.routeSummaryStops}>{totalNights} nights</Text>
        </View>

        {/* Timeline Card */}
        <View style={styles.timelineCard}>
          <View style={styles.timelineLine} />

          {legs.map((leg, index) => (
            <View key={leg.id} style={styles.timelineRow}>
              <View style={styles.dotBlue} />
              <View style={styles.timelineContent}>
                <Text style={styles.legLabel}>LEG {index + 1} · {leg.dateText.toUpperCase()}</Text>
                <Text style={styles.legTitle}>{leg.from} ➔ {leg.to}</Text>
                {leg.flight ? (
                  <Text style={styles.legDetails}>
                    {leg.flight.airline} · {leg.flight.depart}–{leg.flight.arrive} · ₹{leg.flight.price.toLocaleString('en-IN')}
                  </Text>
                ) : (
                  <Text style={styles.legDetails}>No flight selected</Text>
                )}
              </View>
            </View>
          ))}

          {/* Arrival */}
          <View style={[styles.timelineRow, { marginBottom: 0 }]}>
            <View style={styles.dotGrey} />
            <View style={styles.timelineContent}>
              <Text style={styles.legLabel}>ARRIVE · {endDest.code} · {formatDateShort(arrivalDate)}</Text>
            </View>
          </View>
        </View>

        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <Ionicons name="warning-outline" size={16} color="#B27B00" style={{ marginTop: 2, marginRight: 8 }} />
          <Text style={styles.warningText}>
            Different airlines selected — baggage allowances vary. Check policies before booking.
          </Text>
        </View>

        {/* Price Breakdown */}
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>PRICE BREAKDOWN</Text>
          
          {legs.map((leg, index) => (
            <View key={`price-${leg.id}`} style={styles.priceRow}>
              <Text style={styles.priceItemName}>Leg {index + 1} · {leg.fromCode} ➔ {leg.toCode}</Text>
              <Text style={styles.priceItemValue}>
                ₹{leg.flight ? (leg.flight.price * totalPassengers).toLocaleString('en-IN') : 0}
              </Text>
            </View>
          ))}
          
          <View style={[styles.priceRow, styles.priceRowBorder]}>
            <Text style={styles.priceItemName}>Taxes & fees</Text>
            <Text style={styles.priceItemValue}>₹{taxesAndFees.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total · {totalPassengers} adult{totalPassengers > 1 ? 's' : ''}</Text>
            <Text style={styles.totalValue}>₹{finalTotal.toLocaleString('en-IN')}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.continueButton} onPress={() => {
          confirmTrip();
          router.push('/success');
        }}>
          <Text style={styles.continueButtonText}>Confirm & Pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  adultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  adultBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0055FF',
    marginLeft: 6,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 20,
    position: 'relative',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  stepperLineBackground: {
    position: 'absolute',
    top: 35,
    left: 45,
    right: 45,
    height: 2,
    backgroundColor: '#EAEAEA',
    zIndex: 1,
  },
  stepperLineProgress: {
    position: 'absolute',
    top: 35,
    left: 45,
    height: 2,
    backgroundColor: '#0055FF',
    zIndex: 2,
  },
  step: {
    alignItems: 'center',
    zIndex: 3,
    width: 50,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    borderColor: '#0055FF',
  },
  stepCircleCompleted: {
    backgroundColor: '#0055FF',
    borderColor: '#0055FF',
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  stepNumberActive: {
    color: '#0055FF',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
  },
  stepLabelActive: {
    color: '#0055FF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 16,
  },
  routeSummaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  routeSummaryCodes: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  routeSummaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  routeSummaryBlue: {
    color: '#0055FF',
    fontSize: 16,
    fontWeight: '800',
  },
  routeSummaryBlack: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '800',
  },
  routeSummaryStops: {
    fontSize: 12,
    color: '#A0A0A5',
    fontWeight: '500',
  },
  timelineCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 25,
    top: 30,
    bottom: 30,
    width: 2,
    backgroundColor: '#EAEAEA',
    zIndex: 1,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    zIndex: 2,
  },
  dotBlue: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0055FF',
    marginRight: 16,
    marginTop: 4,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  dotGrey: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D1D1D6',
    marginRight: 16,
    marginTop: 4,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  timelineContent: {
    flex: 1,
  },
  legLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A0A0A5',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  legTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  legDetails: {
    fontSize: 13,
    color: '#8E8E93',
  },
  warningBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF4D9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#B27B00',
    fontWeight: '500',
    lineHeight: 18,
  },
  priceCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A0A0A5',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 16,
    marginBottom: 16,
  },
  priceItemName: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  priceItemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F7F7F9',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: '#0055FF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
