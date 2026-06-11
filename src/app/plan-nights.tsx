import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Modal, FlatList, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { useTripContext } from '@/context/TripContext';

const { width, height } = Dimensions.get('window');

// Generate 14 upcoming dates for the mock date picker
const generateDates = () => {
  const dates = [];
  const baseDate = new Date(2025, 7, 12); // Aug 12, 2025
  for (let i = 0; i < 14; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
};
const UPCOMING_DATES = generateDates();

export default function PlanNightsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { destinations: route, setDestinations: setRoute, passengers, setPassengers, departDate, setDepartDate } = useTripContext();

  // Modals Visibility
  const [isPassengerModalVisible, setPassengerModalVisible] = useState(false);
  const [isDateModalVisible, setDateModalVisible] = useState(false);

  // Derived State
  const totalNights = route.reduce((sum, stop) => sum + stop.nights, 0);
  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  // Handlers
  const updateNights = (index: number, delta: number) => {
    const newRoute = [...route];
    const newNights = newRoute[index].nights + delta;
    if (newNights >= 1) { // Minimum 1 night per stop
      newRoute[index].nights = newNights;
      setRoute(newRoute);
    }
  };

  const updatePassenger = (type: 'adults' | 'children' | 'infants', delta: number) => {
    const newValue = passengers[type] + delta;
    if (newValue >= 0) {
      if (type === 'adults' && newValue < 1) return; // Minimum 1 adult
      setPassengers({ ...passengers, [type]: newValue });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' }, href: null }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan your trip</Text>
        <View style={styles.adultBadge}>
          <Ionicons name="person-outline" size={14} color="#0055FF" />
          <Text style={styles.adultBadgeText}>{totalPassengers} · {Math.max(0, route.length - 1)} legs</Text>
        </View>
      </View>

      {/* Stepper */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepperLineBackground} />
        <View style={[styles.stepperLineProgress, { width: '40%' }]} />
        
        <View style={styles.step}>
          <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
            <Ionicons name="checkmark" size={18} color="#FFF" />
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Route</Text>
        </View>

        <View style={styles.step}>
          <View style={[styles.stepCircle, styles.stepCircleActive]}>
            <Text style={[styles.stepNumber, styles.stepNumberActive]}>2</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Nights</Text>
        </View>

        <View style={styles.step}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <Text style={styles.stepLabel}>Flights</Text>
        </View>

        <View style={styles.step}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>4</Text>
          </View>
          <Text style={styles.stepLabel}>Review</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Sub Header Route Summary */}
        <View style={styles.routeSummaryPill}>
          <View style={styles.routeSummaryCodes}>
            {route.map((dest, index) => (
              <React.Fragment key={dest.id}>
                <Text style={dest.isStart || dest.isEnd ? styles.routeSummaryBlue : styles.routeSummaryBlack}>{dest.code}</Text>
                {index < route.length - 1 && (
                  <Ionicons name="chevron-forward" size={12} color="#D1D1D6" style={{ marginHorizontal: 6 }} />
                )}
              </React.Fragment>
            ))}
          </View>
          <Text style={styles.routeSummaryStops}>{route.length - 1} stops</Text>
        </View>

        {/* Top Options */}
        <View style={styles.optionsRow}>
          <TouchableOpacity style={styles.optionCard} onPress={() => setDateModalVisible(true)}>
            <Text style={styles.optionLabel}>Depart</Text>
            <View style={styles.optionValueRow}>
              <Ionicons name="calendar-outline" size={16} color="#1A1A1A" />
              <Text style={styles.optionValue}>{formatDate(departDate)}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionCard, { marginRight: 0 }]} onPress={() => setPassengerModalVisible(true)}>
            <Text style={styles.optionLabel}>Passengers</Text>
            <View style={styles.optionValueRow}>
              <Ionicons name="person-outline" size={16} color="#1A1A1A" />
              <Text style={styles.optionValue}>{totalPassengers} {totalPassengers === 1 ? 'adult' : 'travelers'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Timeline Form */}
        <View style={styles.timelineContainer}>
          <View style={styles.timelineLine} />
          
          {route.map((stop, index) => {
            const isFirst = index === 0;
            const isEnd = stop.isEnd;

            return (
              <View key={stop.id} style={styles.timelineRow}>
                <View style={isEnd ? styles.dotGrey : styles.dotBlue} />
                <View style={[styles.stopCard, isFirst && styles.stopCardActive]}>
                  <View style={styles.stopCardHeader}>
                    <Text style={styles.stopLabel}>STOP {index + 1}</Text>
                    {isFirst ? (
                      <View style={styles.activePill}>
                        <Ionicons name="pencil" size={12} color="#0055FF" style={{ marginRight: 4 }} />
                        <Text style={styles.activePillText}>Active</Text>
                      </View>
                    ) : isEnd ? (
                      <View style={styles.finalPill}><Text style={styles.finalPillText}>Final</Text></View>
                    ) : (
                      <View style={styles.setNightsPill}><Text style={styles.setNightsPillText}>Set nights</Text></View>
                    )}
                  </View>
                  <View style={styles.stopCardBody}>
                    <Text style={styles.cityName}>{stop.name}</Text>
                    <View style={styles.cityBadge}><Text style={styles.cityBadgeText}>{stop.code}</Text></View>
                  </View>
                  
                  {isEnd ? (
                    <Text style={styles.endDestinationText}>End destination</Text>
                  ) : (
                    <View style={styles.nightsRow}>
                      <Text style={styles.nightsLabel}>Nights here</Text>
                      <View style={styles.stepperControls}>
                        <TouchableOpacity style={styles.stepperBtn} onPress={() => updateNights(index, -1)}>
                          <Ionicons name="remove" size={18} color="#1A1A1A" />
                        </TouchableOpacity>
                        <Text style={styles.stepperValue}>{stop.nights}</Text>
                        <TouchableOpacity style={styles.stepperBtn} onPress={() => updateNights(index, 1)}>
                          <Ionicons name="add" size={18} color="#1A1A1A" />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.nightsPill}>
                        <Ionicons name="moon" size={12} color="#0055FF" style={{ marginRight: 4 }} />
                        <Text style={styles.nightsPillText}>{stop.nights} {stop.nights === 1 ? 'night' : 'nights'}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Add Another City */}
        <TouchableOpacity style={styles.addCityBtn} onPress={() => router.back()}>
          <Ionicons name="add" size={18} color="#8E8E93" />
          <Text style={styles.addCityText}>Add another city</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryRoute}>
            {route.map((stop, index) => (
              <React.Fragment key={stop.id}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryCity}>{stop.code}</Text>
                  {stop.isEnd ? (
                    <Text style={styles.summaryNightsBlue}>end</Text>
                  ) : (
                    <Text style={styles.summaryNights}>{stop.nights}n</Text>
                  )}
                </View>
                {index < route.length - 1 && (
                  <Ionicons name="chevron-forward" size={12} color="#D1D1D6" style={styles.summaryArrow} />
                )}
              </React.Fragment>
            ))}
          </View>
          <Text style={styles.summaryTotal}>{totalNights} nights</Text>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={() => router.push('/flights')}>
          <Text style={styles.continueButtonText}>Search Flights</Text>
        </TouchableOpacity>
      </View>

      {/* Passenger Modal */}
      <Modal visible={isPassengerModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setPassengerModalVisible(false)} />
          <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Passengers</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setPassengerModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.passengerRow}>
              <View>
                <Text style={styles.passengerLabel}>Adults</Text>
                <Text style={styles.passengerSubLabel}>Age 13+</Text>
              </View>
              <View style={styles.modalStepperControls}>
                <TouchableOpacity style={[styles.stepperBtn, passengers.adults <= 1 && styles.stepperBtnDisabled]} onPress={() => updatePassenger('adults', -1)}>
                  <Ionicons name="remove" size={20} color={passengers.adults <= 1 ? "#D1D1D6" : "#1A1A1A"} />
                </TouchableOpacity>
                <Text style={styles.modalStepperValue}>{passengers.adults}</Text>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => updatePassenger('adults', 1)}>
                  <Ionicons name="add" size={20} color="#1A1A1A" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.passengerRow}>
              <View>
                <Text style={styles.passengerLabel}>Children</Text>
                <Text style={styles.passengerSubLabel}>Ages 2-12</Text>
              </View>
              <View style={styles.modalStepperControls}>
                <TouchableOpacity style={[styles.stepperBtn, passengers.children <= 0 && styles.stepperBtnDisabled]} onPress={() => updatePassenger('children', -1)}>
                  <Ionicons name="remove" size={20} color={passengers.children <= 0 ? "#D1D1D6" : "#1A1A1A"} />
                </TouchableOpacity>
                <Text style={styles.modalStepperValue}>{passengers.children}</Text>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => updatePassenger('children', 1)}>
                  <Ionicons name="add" size={20} color="#1A1A1A" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.passengerRow}>
              <View>
                <Text style={styles.passengerLabel}>Infants</Text>
                <Text style={styles.passengerSubLabel}>Under 2</Text>
              </View>
              <View style={styles.modalStepperControls}>
                <TouchableOpacity style={[styles.stepperBtn, passengers.infants <= 0 && styles.stepperBtnDisabled]} onPress={() => updatePassenger('infants', -1)}>
                  <Ionicons name="remove" size={20} color={passengers.infants <= 0 ? "#D1D1D6" : "#1A1A1A"} />
                </TouchableOpacity>
                <Text style={styles.modalStepperValue}>{passengers.infants}</Text>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => updatePassenger('infants', 1)}>
                  <Ionicons name="add" size={20} color="#1A1A1A" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.modalApplyBtn} onPress={() => setPassengerModalVisible(false)}>
              <Text style={styles.modalApplyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date Selection Modal */}
      <Modal visible={isDateModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setDateModalVisible(false)} />
          <View style={[styles.modalContent, { height: height * 0.6, paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Depart Date</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setDateModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={UPCOMING_DATES}
              keyExtractor={(item) => item.toISOString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.dateListItem, departDate.getTime() === item.getTime() && styles.dateListItemActive]}
                  onPress={() => {
                    setDepartDate(item);
                    setDateModalVisible(false);
                  }}
                >
                  <Text style={[styles.dateListText, departDate.getTime() === item.getTime() && styles.dateListTextActive]}>
                    {formatDate(item)}
                  </Text>
                  {departDate.getTime() === item.getTime() && (
                    <Ionicons name="checkmark-circle" size={20} color="#0055FF" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

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
    paddingVertical: 6,
    borderRadius: 20,
  },
  adultBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0055FF',
    marginLeft: 6,
  },
  routeSummaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 0,
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  routeSummaryCodes: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  routeSummaryBlue: {
    color: '#0055FF',
    fontSize: 16,
    fontWeight: '800',
  },
  routeSummaryBlack: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '600',
  },
  routeSummaryStops: {
    fontSize: 12,
    color: '#A0A0A5',
    fontWeight: '500',
    marginLeft: 8,
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
    paddingTop: 10,
  },
  timelineContainer: {
    paddingLeft: 10,
    position: 'relative',
    marginTop: 20,
  },
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 20,
    bottom: 80,
    width: 2,
    backgroundColor: '#EAEAEA',
    zIndex: 1,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    zIndex: 2,
  },
  dotBlue: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0055FF',
    marginRight: 16,
    marginLeft: -1,
    marginTop: 20,
  },
  dotGrey: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D1D1D6',
    marginRight: 16,
    marginLeft: -1,
    marginTop: 20,
  },
  stopCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
  },
  stopCardActive: {
    borderWidth: 1,
    borderColor: '#0055FF',
  },
  stopCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stopLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A0A0A5',
    letterSpacing: 0.5,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activePillText: {
    color: '#0055FF',
    fontSize: 12,
    fontWeight: '600',
  },
  setNightsPill: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  setNightsPillText: {
    color: '#A0A0A5',
    fontSize: 12,
    fontWeight: '500',
  },
  finalPill: {
    backgroundColor: '#E4F8EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  finalPillText: {
    color: '#20C968',
    fontSize: 12,
    fontWeight: '600',
  },
  stopCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginRight: 8,
  },
  cityBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cityBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A0A0A5',
  },
  nightsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nightsLabel: {
    fontSize: 14,
    color: '#A0A0A5',
    flex: 1,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnDisabled: {
    opacity: 0.5,
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  nightsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
  },
  nightsPillText: {
    color: '#0055FF',
    fontSize: 12,
    fontWeight: '600',
  },
  endDestinationText: {
    fontSize: 14,
    color: '#0055FF',
    fontWeight: '500',
  },
  addCityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    marginBottom: 20,
    marginLeft: 38,
  },
  addCityText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginRight: 10,
  },
  optionLabel: {
    fontSize: 12,
    color: '#A0A0A5',
    marginBottom: 8,
  },
  optionValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 6,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryCity: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  summaryNights: {
    fontSize: 11,
    color: '#A0A0A5',
    marginTop: 2,
  },
  summaryNightsBlue: {
    fontSize: 11,
    color: '#0055FF',
    marginTop: 2,
  },
  summaryArrow: {
    marginHorizontal: 6,
    marginTop: -12,
  },
  summaryTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0055FF',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passengerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  passengerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  passengerSubLabel: {
    fontSize: 13,
    color: '#8E8E93',
  },
  modalStepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalStepperValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    width: 40,
    textAlign: 'center',
  },
  modalApplyBtn: {
    backgroundColor: '#0055FF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  modalApplyText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dateListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dateListItemActive: {
    backgroundColor: '#F5F8FF',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderBottomWidth: 0,
    marginVertical: 4,
  },
  dateListText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  dateListTextActive: {
    color: '#0055FF',
    fontWeight: '700',
  },
});
