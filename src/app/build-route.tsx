import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Modal, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { useTripContext } from '@/context/TripContext';
import { searchDestinations } from '@/services/api';

const { width } = Dimensions.get('window');

// Mock Database of available cities for the autocomplete feature
const CITIES_DB = [
  // India
  { id: 'bom', name: 'Mumbai', code: 'BOM', subtitle: 'Chhatrapati Shivaji Intl', icon: 'airplane-outline' },
  { id: 'del', name: 'New Delhi', code: 'DEL', subtitle: 'Indira Gandhi Intl', icon: 'airplane-outline' },
  { id: 'blr', name: 'Bangalore', code: 'BLR', subtitle: 'Kempegowda Intl', icon: 'airplane-outline' },
  { id: 'hyd', name: 'Hyderabad', code: 'HYD', subtitle: 'Rajiv Gandhi Intl', icon: 'airplane-outline' },
  { id: 'maa', name: 'Chennai', code: 'MAA', subtitle: 'Chennai Intl', icon: 'airplane-outline' },
  { id: 'ccu', name: 'Kolkata', code: 'CCU', subtitle: 'Netaji Subhas Chandra Bose Intl', icon: 'airplane-outline' },
  { id: 'goi', name: 'Goa', code: 'GOI', subtitle: 'Dabolim Airport', icon: 'airplane-outline' },
  { id: 'pnq', name: 'Pune', code: 'PNQ', subtitle: 'Pune Airport', icon: 'airplane-outline' },
  { id: 'amd', name: 'Ahmedabad', code: 'AMD', subtitle: 'Sardar Vallabhbhai Patel Intl', icon: 'airplane-outline' },
  { id: 'cok', name: 'Kochi', code: 'COK', subtitle: 'Cochin Intl', icon: 'airplane-outline' },
  { id: 'jkr', name: 'Jaipur', code: 'JAI', subtitle: 'Jaipur Intl', icon: 'airplane-outline' },
  { id: 'trv', name: 'Trivandrum', code: 'TRV', subtitle: 'Trivandrum Intl', icon: 'airplane-outline' },
  { id: 'srinagar', name: 'Srinagar', code: 'SXR', subtitle: 'Sheikh ul-Alam Intl', icon: 'airplane-outline' },
  { id: 'mumtazpur', name: 'Mumtazpur', code: 'City', subtitle: 'Uttar Pradesh, India', icon: 'location-outline' },

  // Asia
  { id: 'dxb', name: 'Dubai', code: 'DXB', subtitle: 'Dubai Intl, UAE', icon: 'airplane-outline' },
  { id: 'sin', name: 'Singapore', code: 'SIN', subtitle: 'Changi Airport', icon: 'airplane-outline' },
  { id: 'bkk', name: 'Bangkok', code: 'BKK', subtitle: 'Suvarnabhumi Airport, Thailand', icon: 'airplane-outline' },
  { id: 'kul', name: 'Kuala Lumpur', code: 'KUL', subtitle: 'Kuala Lumpur Intl, Malaysia', icon: 'airplane-outline' },
  { id: 'hnd', name: 'Tokyo', code: 'HND', subtitle: 'Haneda Airport, Japan', icon: 'airplane-outline' },
  { id: 'icn', name: 'Seoul', code: 'ICN', subtitle: 'Incheon Intl, South Korea', icon: 'airplane-outline' },
  { id: 'hkg', name: 'Hong Kong', code: 'HKG', subtitle: 'Hong Kong Intl', icon: 'airplane-outline' },
  { id: 'dps', name: 'Bali', code: 'DPS', subtitle: 'Ngurah Rai Intl, Indonesia', icon: 'airplane-outline' },
  { id: 'cmo', name: 'Colombo', code: 'CMB', subtitle: 'Bandaranaike Intl, Sri Lanka', icon: 'airplane-outline' },

  // Europe
  { id: 'lhr', name: 'London', code: 'LHR', subtitle: 'Heathrow Airport, UK', icon: 'airplane-outline' },
  { id: 'cdg', name: 'Paris', code: 'CDG', subtitle: 'Charles de Gaulle, France', icon: 'airplane-outline' },
  { id: 'ams', name: 'Amsterdam', code: 'AMS', subtitle: 'Schiphol Airport, Netherlands', icon: 'airplane-outline' },
  { id: 'fra', name: 'Frankfurt', code: 'FRA', subtitle: 'Frankfurt Airport, Germany', icon: 'airplane-outline' },
  { id: 'muc', name: 'Munich', code: 'MUC', subtitle: 'Munich Airport, Germany', icon: 'airplane-outline' },
  { id: 'fco', name: 'Rome', code: 'FCO', subtitle: 'Leonardo da Vinci Intl, Italy', icon: 'airplane-outline' },
  { id: 'zrh', name: 'Zurich', code: 'ZRH', subtitle: 'Zurich Airport, Switzerland', icon: 'airplane-outline' },
  { id: 'mad', name: 'Madrid', code: 'MAD', subtitle: 'Adolfo Suárez Madrid–Barajas, Spain', icon: 'airplane-outline' },
  { id: 'ist', name: 'Istanbul', code: 'IST', subtitle: 'Istanbul Airport, Turkey', icon: 'airplane-outline' },

  // North America
  { id: 'jfk', name: 'New York', code: 'JFK', subtitle: 'John F. Kennedy Intl, USA', icon: 'airplane-outline' },
  { id: 'lax', name: 'Los Angeles', code: 'LAX', subtitle: 'Los Angeles Intl, USA', icon: 'airplane-outline' },
  { id: 'sfo', name: 'San Francisco', code: 'SFO', subtitle: 'San Francisco Intl, USA', icon: 'airplane-outline' },
  { id: 'ord', name: 'Chicago', code: 'ORD', subtitle: 'O\'Hare Intl, USA', icon: 'airplane-outline' },
  { id: 'yyz', name: 'Toronto', code: 'YYZ', subtitle: 'Toronto Pearson Intl, Canada', icon: 'airplane-outline' },
  { id: 'yvr', name: 'Vancouver', code: 'YVR', subtitle: 'Vancouver Intl, Canada', icon: 'airplane-outline' },

  // Oceania
  { id: 'syd', name: 'Sydney', code: 'SYD', subtitle: 'Sydney Airport, Australia', icon: 'airplane-outline' },
  { id: 'mel', name: 'Melbourne', code: 'MEL', subtitle: 'Melbourne Airport, Australia', icon: 'airplane-outline' },
  { id: 'akl', name: 'Auckland', code: 'AKL', subtitle: 'Auckland Airport, New Zealand', icon: 'airplane-outline' },
];

export default function BuildRouteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State for selected destinations from Context
  const { destinations, setDestinations, saveTripAsDraft, passengers } = useTripContext();
  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  // State for the active search input
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);

  // Debounced API search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    
    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      const results = await searchDestinations(searchQuery);
      if (results) {
        setSuggestions(results.map((r: any) => ({
          ...r,
          subtitle: r.country,
          icon: 'airplane-outline' // Tequila locations mostly return airports/cities
        })));
      } else {
        // Fallback to mock data if API is not configured or failed
        const lowerQuery = searchQuery.toLowerCase();
        setSuggestions(CITIES_DB.filter(city => city.name.toLowerCase().includes(lowerQuery)));
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Add a selected suggestion to the route
  const handleAddDestination = (city: typeof CITIES_DB[0]) => {
    // Generate a unique ID in case the user adds the same city twice
    const uniqueId = `${city.id}-${Date.now()}`;
    
    // We add it right before the End destination if one exists
    const newDestinations = [...destinations];
    const isEndNode = false;
    newDestinations.push({ id: uniqueId, name: city.name, code: city.code, isStart: false, nights: 2, isEnd: isEndNode });
    setDestinations(newDestinations);
    
    setSearchQuery('');
    setIsFocused(false);
  };

  // Remove a destination from the route
  const handleRemoveDestination = (idToRemove: string) => {
    setDestinations(destinations.filter(d => d.id !== idToRemove));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' }, href: null }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setShowDraftModal(true)}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Build route</Text>
      </View>

      {/* Stepper */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepperLineBackground} />
        <View style={[styles.stepperLineProgress, { width: '15%' }]} />
        
        <View style={styles.step}>
          <View style={[styles.stepCircle, styles.stepCircleActive]}>
            <Text style={[styles.stepNumber, styles.stepNumberActive]}>1</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Route</Text>
        </View>

        <View style={styles.step}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <Text style={styles.stepLabel}>Nights</Text>
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

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Timeline Form */}
          <View style={styles.timelineContainer}>
            <View style={styles.timelineLine} />
            
            {/* Render Selected Destinations */}
            {destinations.filter(d => d && d.name).map((dest, index) => (
              <View key={`${dest.id}-${index}`} style={styles.timelineRow}>
                <View style={dest.isStart ? styles.dotGreen : styles.dotBlue} />
                <View style={styles.inputCard}>
                  <Text style={styles.inputText}>{dest.name} {dest.code ? `(${dest.code})` : ''}</Text>
                  <View style={styles.checkIcon}>
                    <Ionicons name="checkmark-circle" size={18} color="#20C968" />
                  </View>
                </View>
                {/* Only allow removing destinations that are not the start */}
                {!dest.isStart && (
                  <TouchableOpacity 
                    style={styles.removeBtn} 
                    onPress={() => handleRemoveDestination(dest.id)}
                  >
                    <Ionicons name="close" size={18} color="#8E8E93" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* Active Search Input Area */}
            <View style={styles.timelineRow}>
              <View style={isFocused || searchQuery ? styles.dotBlueHollow : styles.dotGreyHollow} />
              <View style={[styles.inputCardActive, (isFocused || searchQuery) && styles.inputCardFocused]}>
                <TextInput
                  style={styles.textInputField}
                  placeholder="Where to next?"
                  placeholderTextColor="#8E8E93"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <Ionicons name="search" size={20} color={isFocused || searchQuery ? "#0055FF" : "#8E8E93"} />
              </View>
            </View>
          </View>

          {/* Suggestions Dropdown (Only show if searching) */}
          {searchQuery.trim().length > 0 && (
            <View style={styles.suggestionsContainer}>
              <View style={[styles.suggestionsHeader, { flexDirection: 'row', alignItems: 'center' }]}>
                <Text style={styles.suggestionsTitle}>SUGGESTIONS</Text>
                {isLoading && <ActivityIndicator size="small" color="#0055FF" style={{marginLeft: 8}} />}
              </View>

              {(!isLoading && suggestions.length === 0) ? (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No destinations found.</Text>
                </View>
              ) : (
                suggestions.map((suggestion, index) => {
                  // Logic to highlight the matching part of the name
                  const matchIndex = suggestion.name.toLowerCase().indexOf(searchQuery.toLowerCase());
                  const beforeMatch = suggestion.name.substring(0, matchIndex);
                  const matchText = suggestion.name.substring(matchIndex, matchIndex + searchQuery.length);
                  const afterMatch = suggestion.name.substring(matchIndex + searchQuery.length);

                  return (
                    <TouchableOpacity 
                      key={suggestion.id} 
                      style={[styles.suggestionItem, index === 0 && styles.suggestionItemHighlighted]}
                      onPress={() => handleAddDestination(suggestion)}
                    >
                      <View style={styles.suggestionIconWrapper}>
                        <Ionicons 
                          name={suggestion.icon as any} 
                          size={20} 
                          color="#1A1A1A" 
                          style={suggestion.icon === 'airplane-outline' ? { transform: [{ rotate: '45deg' }] } : undefined} 
                        />
                      </View>
                      <View style={styles.suggestionTextContainer}>
                        <Text style={styles.suggestionMainText}>
                          {beforeMatch}
                          <Text style={styles.textHighlight}>{matchText}</Text>
                          {afterMatch}
                        </Text>
                        <Text style={styles.suggestionSubText}>{suggestion.subtitle}</Text>
                      </View>
                      <View style={styles.tagBadge}>
                        <Text style={styles.tagText}>{suggestion.code}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.continueButton} onPress={() => router.push('/plan-nights')}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Save Draft Modal */}
      <Modal
        visible={showDraftModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowDraftModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Icon */}
            <View style={styles.modalIconCircle}>
              <Ionicons name="bookmark-outline" size={28} color="#0055FF" />
            </View>

            {/* Text */}
            <Text style={styles.modalTitle}>Save as Draft?</Text>
            <Text style={styles.modalSubtitle}>
              You have an unsaved trip. Would you like to save it and continue later?
            </Text>

            {/* Buttons */}
            <TouchableOpacity
              style={styles.modalPrimaryButton}
              activeOpacity={0.85}
              onPress={() => {
                saveTripAsDraft();
                setShowDraftModal(false);
                router.back();
              }}
            >
              <Ionicons name="bookmark" size={18} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.modalPrimaryButtonText}>Save Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalDestructiveButton}
              activeOpacity={0.85}
              onPress={() => {
                setShowDraftModal(false);
                router.back();
              }}
            >
              <Text style={styles.modalDestructiveButtonText}>Discard & Leave</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              activeOpacity={0.85}
              onPress={() => setShowDraftModal(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  timelineContainer: {
    paddingLeft: 10,
    marginTop: 10,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 20,
    bottom: 30,
    width: 2,
    backgroundColor: '#EAEAEA',
    zIndex: 1,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 2,
  },
  dotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#20C968',
    marginRight: 16,
    marginLeft: -1,
  },
  dotBlue: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0055FF',
    marginRight: 16,
    marginLeft: -1,
  },
  dotBlueHollow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0055FF',
    backgroundColor: '#FFF',
    marginRight: 16,
    marginLeft: -1,
  },
  dotGreyHollow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#EAEAEA',
    backgroundColor: '#FFF',
    marginRight: 16,
    marginLeft: -1,
  },
  inputCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  inputCardActive: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  inputCardFocused: {
    borderColor: '#0055FF',
  },
  textInputField: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans-Medium',
    padding: 0,
    margin: 0,
  },
  inputText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 8,
  },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  suggestionsContainer: {
    marginTop: 10,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  suggestionsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A0A0A5',
    letterSpacing: 0.5,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  suggestionItemHighlighted: {
    backgroundColor: '#F5F8FF',
  },
  suggestionIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionMainText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
    marginBottom: 4,
  },
  textHighlight: {
    color: '#0055FF',
    fontWeight: '700',
  },
  suggestionSubText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  tagBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#4A4A4A',
    fontWeight: '500',
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

  // Save Draft Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  modalPrimaryButton: {
    flexDirection: 'row',
    backgroundColor: '#0055FF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 12,
  },
  modalPrimaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalDestructiveButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 12,
  },
  modalDestructiveButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
  },
  modalCancelButton: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalCancelButtonText: {
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: '500',
  },
});
