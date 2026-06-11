import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { useTripContext } from '@/context/TripContext';

const { width } = Dimensions.get('window');

const FLIGHTS = [
  { id: '1', airline: 'IndiGo', code: '6E', depart: '6:10 AM', arrive: '7:25 AM', duration: '1h 15m', type: 'Non-stop', price: 1950, isBest: false },
  { id: '2', airline: 'Air India', code: 'AI', depart: '8:30 AM', arrive: '9:40 AM', duration: '1h 10m', type: 'Non-stop', price: 1650, isBest: true },
  { id: '3', airline: 'Vistara', code: 'UK', depart: '11:45 AM', arrive: '1:05 PM', duration: '1h 20m', type: 'Non-stop', price: 2200, isBest: false },
  { id: '4', airline: 'SpiceJet', code: 'SG', depart: '3:15 PM', arrive: '5:00 PM', duration: '1h 45m', type: '1 stop', price: 1820, isBest: false },
];

export default function FlightsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { destinations, passengers, departDate, setSelectedFlights } = useTripContext();
  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  // Generate dynamic legs from destinations
  const legs = [];
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

    legs.push({
      id: i,
      from: from.name,
      to: to.name,
      nights: to.isEnd ? 'End destination' : `${to.nights} nights in ${to.code}`,
      date: legDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      dateObj: legDate
    });
  }

  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [selectedFlightId, setSelectedFlightId] = useState('2');
  const [activeFilter, setActiveFilter] = useState('Cheapest');

  const filters = ['Cheapest', 'Fastest', 'Non-stop'];

  // Handle empty state gracefully (though it shouldn't happen)
  if (legs.length === 0) {
    return <SafeAreaView><Text>No route defined.</Text></SafeAreaView>;
  }

  // Ensure currentLegIndex doesn't go out of bounds if route is shortened
  const safeLegIndex = Math.min(currentLegIndex, Math.max(0, legs.length - 1));
  const leg = legs[safeLegIndex];
  const isLastLeg = safeLegIndex === legs.length - 1;

  // Simple pseudo-randomizer to scramble prices and times slightly based on the leg, making it feel real
  const dynamicFlights = FLIGHTS.map(f => {
    const randomMultiplier = 1 + (currentLegIndex * 0.2) + ((f.price % 3) * 0.1);
    const newPrice = Math.round((f.price * randomMultiplier) / 50) * 50;
    return { ...f, price: newPrice };
  });

  const handleSelectFlight = () => {
    const selectedFlightObj = dynamicFlights.find(f => f.id === selectedFlightId)!;
    // Save to context
    setSelectedFlights(prev => ({ ...prev, [safeLegIndex]: selectedFlightObj }));

    if (isLastLeg) {
      router.push('/review');
    } else {
      setCurrentLegIndex(safeLegIndex + 1);
      setSelectedFlightId('2'); // Reset selection
    }
  };

  const handleBack = () => {
    if (currentLegIndex > 0) {
      setCurrentLegIndex(prev => prev - 1);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' }, href: null }} />
      
      {/* Header Area */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{leg.from} ➔ {leg.to}</Text>
        <View style={styles.adultBadge}>
          <Ionicons name="person-outline" size={14} color="#0055FF" />
          <Text style={styles.adultBadgeText}>{totalPassengers} · {legs.length} legs</Text>
        </View>
      </View>

      {/* Stepper */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepperLineBackground} />
        <View style={[styles.stepperLineProgress, { width: '65%' }]} />
        
        <View style={styles.step}>
          <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
            <Ionicons name="checkmark" size={18} color="#FFF" />
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Route</Text>
        </View>

        <View style={styles.step}>
          <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
            <Ionicons name="checkmark" size={18} color="#FFF" />
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Nights</Text>
        </View>

        <View style={styles.step}>
          <View style={[styles.stepCircle, styles.stepCircleActive]}>
            <Text style={[styles.stepNumber, styles.stepNumberActive]}>3</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Flights</Text>
        </View>

        <View style={styles.step}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>4</Text>
          </View>
          <Text style={styles.stepLabel}>Review</Text>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Header Badges Centered */}
        <View style={styles.badgesContainerCentered}>
          <View style={styles.badge}>
            <Ionicons name="calendar-outline" size={12} color="#8E8E93" />
            <Text style={styles.badgeText}>{leg.date}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="moon-outline" size={12} color="#8E8E93" />
            <Text style={styles.badgeText}>{leg.nights}</Text>
          </View>
        </View>

        {/* Flight List */}
        <ScrollView contentContainerStyle={styles.flightsScroll} showsVerticalScrollIndicator={false}>
          {dynamicFlights.map((flight) => {
            const isSelected = selectedFlightId === flight.id;
            return (
              <TouchableOpacity 
                key={flight.id} 
                style={[styles.flightCard, isSelected && styles.flightCardSelected]}
                onPress={() => setSelectedFlightId(flight.id)}
                activeOpacity={0.9}
              >
                <View style={styles.flightMain}>
                  <View style={[styles.airlineLogo, isSelected && styles.airlineLogoSelected]}>
                    <Text style={[styles.airlineCode, isSelected && styles.airlineCodeSelected]}>{flight.code}</Text>
                  </View>
                  <View style={styles.flightDetails}>
                    <Text style={styles.flightTime}>{flight.depart} ➔ {flight.arrive}</Text>
                    <Text style={styles.flightSub}>{flight.airline} · {flight.duration} · {flight.type}</Text>
                  </View>
                  <View style={styles.priceContainer}>
                    {flight.isBest && (
                      <View style={styles.bestPill}>
                        <Text style={styles.bestPillText}>BEST</Text>
                      </View>
                    )}
                    <Text style={[styles.priceText, isSelected && styles.priceTextSelected]}>₹{flight.price.toLocaleString('en-IN')}</Text>
                    <Text style={[styles.perPersonText, isSelected && styles.perPersonTextSelected]}>per person</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.continueButton} onPress={handleSelectFlight}>
          <Text style={styles.continueButtonText}>
            {isLastLeg ? 'Select · Go to Review' : `Select · Go to leg ${currentLegIndex + 2}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
    marginRight: 8,
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
  badgesContainerCentered: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFF0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#4A4A4A',
    marginLeft: 6,
    fontWeight: '500',
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
  mainContent: {
    flex: 1,
    backgroundColor: '#F7F7F9',
  },
  filtersRow: {
    paddingVertical: 16,
  },
  filtersScroll: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  filterChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#0055FF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A4A4A',
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  filterIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flightsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  flightCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  flightCardSelected: {
    borderColor: '#0055FF',
    backgroundColor: '#FFF',
  },
  flightMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  airlineLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  airlineLogoSelected: {
    backgroundColor: '#E6F0FF',
  },
  airlineCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  airlineCodeSelected: {
    color: '#0055FF',
  },
  flightDetails: {
    flex: 1,
  },
  flightTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  flightSub: {
    fontSize: 12,
    color: '#A0A0A5',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  bestPill: {
    backgroundColor: '#0055FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  bestPillText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  priceTextSelected: {
    color: '#0055FF',
  },
  perPersonText: {
    fontSize: 11,
    color: '#A0A0A5',
    marginTop: 2,
  },
  perPersonTextSelected: {
    color: '#0055FF',
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
