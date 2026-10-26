import React from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Dimensions, TextInput, Keyboard, StatusBar } from 'react-native';
import { Text } from '@/components/Text';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter, Redirect } from 'expo-router';
import { useTripContext } from '@/context/TripContext';
import StoryModal from '@/components/StoryModal';

const CITIES_DB = [
  { id: 'bom', name: 'Mumbai', code: 'BOM', subtitle: 'Chhatrapati Shivaji Intl' },
  { id: 'del', name: 'New Delhi', code: 'DEL', subtitle: 'Indira Gandhi Intl' },
  { id: 'blr', name: 'Bangalore', code: 'BLR', subtitle: 'Kempegowda Intl' },
  { id: 'hyd', name: 'Hyderabad', code: 'HYD', subtitle: 'Rajiv Gandhi Intl' },
  { id: 'maa', name: 'Chennai', code: 'MAA', subtitle: 'Chennai Intl' },
  { id: 'ccu', name: 'Kolkata', code: 'CCU', subtitle: 'Netaji Subhas Chandra Bose Intl' },
  { id: 'goi', name: 'Goa', code: 'GOI', subtitle: 'Dabolim Airport' },
  { id: 'pnq', name: 'Pune', code: 'PNQ', subtitle: 'Pune Airport' },
  { id: 'amd', name: 'Ahmedabad', code: 'AMD', subtitle: 'Sardar Vallabhbhai Patel Intl' },
  { id: 'cok', name: 'Kochi', code: 'COK', subtitle: 'Cochin Intl' },
  { id: 'dxb', name: 'Dubai', code: 'DXB', subtitle: 'Dubai Intl, UAE' },
  { id: 'sin', name: 'Singapore', code: 'SIN', subtitle: 'Changi Airport' },
  { id: 'bkk', name: 'Bangkok', code: 'BKK', subtitle: 'Suvarnabhumi, Thailand' },
  { id: 'hnd', name: 'Tokyo', code: 'HND', subtitle: 'Haneda Airport, Japan' },
  { id: 'icn', name: 'Seoul', code: 'ICN', subtitle: 'Incheon Intl, South Korea' },
  { id: 'lhr', name: 'London', code: 'LHR', subtitle: 'Heathrow, UK' },
  { id: 'jfk', name: 'New York', code: 'JFK', subtitle: 'JFK Intl, USA' },
  { id: 'syd', name: 'Sydney', code: 'SYD', subtitle: 'Sydney Airport, Australia' },
];

const { width, height: screenHeight } = Dimensions.get('window');

const destinations = [
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=200&q=80' },
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=200&q=80' },
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=200&q=80' },
  { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=200&q=80' },
  { name: 'Chennai', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=200&q=80' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { 
    hasSeenOnboarding, 
    notifications, 
    profileImageUri, 
    userProfile, 
    destinations: tripDestinations, 
    setDestinations 
  } = useTripContext();
  
  const [tripType, setTripType] = React.useState<'single' | 'multi'>('single');
  const [activeStory, setActiveStory] = React.useState<{ name: string; image: string } | null>(null);
  const [seenStories, setSeenStories] = React.useState<string[]>([]);

  // Inline search state for single trip
  const [editingField, setEditingField] = React.useState<'origin' | 'dest' | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<typeof CITIES_DB>([]);

  const fromCityName = tripDestinations?.[0]?.name || 'Mumbai';
  const fromCityCode = tripDestinations?.[0]?.code || 'BOM';
  const fromDisplayText = fromCityCode ? `${fromCityName} - ${fromCityCode}` : fromCityName;

  const toCityName = (tripDestinations && tripDestinations.length > 1 && tripDestinations[1]?.name) 
    ? tripDestinations[1].name 
    : 'Bangalore';
  const toCityCode = (tripDestinations && tripDestinations.length > 1 && tripDestinations[1]?.code) 
    ? tripDestinations[1].code 
    : 'BLR';
  const toDisplayText = toCityCode ? `${toCityName} - ${toCityCode}` : toCityName;

  const handleFieldPress = (field: 'origin' | 'dest') => {
    setEditingField(field);
    setSearchQuery('');
    setSuggestions(CITIES_DB.slice(0, 6));
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSuggestions(CITIES_DB.slice(0, 6));
      return;
    }
    const lower = text.toLowerCase();
    setSuggestions(CITIES_DB.filter(c => 
      c.name.toLowerCase().includes(lower) || c.code.toLowerCase().includes(lower)
    ).slice(0, 6));
  };

  const handleCitySelect = (city: { id: string; name: string; code: string; subtitle?: string }) => {
    const updated = tripDestinations ? [...tripDestinations] : [];
    const newDest = { id: city.id, name: city.name, code: city.code, isStart: false, nights: 2, isEnd: false };
    
    if (editingField === 'origin') {
      if (updated.length === 0) {
        updated.push({ ...newDest, isStart: true });
      } else {
        updated[0] = { ...updated[0], ...newDest, isStart: true };
      }
    } else {
      if (updated.length < 2) {
        while (updated.length < 1) updated.push({ id: 'placeholder', name: '', code: '', isStart: true, nights: 0, isEnd: false });
        updated.push({ ...newDest, isEnd: true });
      } else {
        updated[1] = { ...updated[1], ...newDest, isEnd: true };
      }
    }
    setDestinations(updated);
    setEditingField(null);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const handleCustomCitySubmit = () => {
    if (!searchQuery.trim()) return;
    const trimmed = searchQuery.trim();
    const match = CITIES_DB.find(c => c.name.toLowerCase() === trimmed.toLowerCase() || c.code.toLowerCase() === trimmed.toLowerCase())
      || suggestions[0];
    if (match) {
      handleCitySelect(match);
    } else {
      const customCity = {
        id: `custom_${Date.now()}`,
        name: trimmed,
        code: trimmed.slice(0, 3).toUpperCase(),
        subtitle: 'Custom Location',
      };
      handleCitySelect(customCity);
    }
  };

  const handleSwap = () => {
    if (tripDestinations && tripDestinations.length >= 2) {
      const updated = [...tripDestinations];
      const temp = updated[0];
      updated[0] = { ...updated[1], isStart: true, isEnd: false };
      updated[1] = { ...temp, isStart: false, isEnd: updated.length === 2 };
      setDestinations(updated);
    }
  };

  const handleStoryPress = (dest: { name: string; image: string }) => {
    setActiveStory(dest);
    if (!seenStories.includes(dest.name)) {
      setSeenStories(prev => [...prev, dest.name]);
    }
  };

  const handleNextStory = () => {
    if (!activeStory) return;
    const currentIndex = destinations.findIndex(d => d.name === activeStory.name);
    if (currentIndex !== -1 && currentIndex < destinations.length - 1) {
      const nextDest = destinations[currentIndex + 1];
      setActiveStory(nextDest);
      if (!seenStories.includes(nextDest.name)) {
        setSeenStories(prev => [...prev, nextDest.name]);
      }
    } else {
      setActiveStory(null);
    }
  };

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Sky Atmosphere Backdrop */}
        <View pointerEvents="none" style={styles.skyBackdrop}>
          <Image 
            source={require('@/../assets/images/sky-bg.jpg')} 
            style={StyleSheet.absoluteFill} 
            resizeMode="cover"
          />
        </View>

        {/* Header Row */}
        <View style={[styles.headerRow, { marginTop: Math.max(insets.top, 16) + 6 }]}>
          <View style={styles.profileInfo}>
            <Image 
              source={{ uri: profileImageUri }} 
              style={styles.profileAvatar} 
            />
            <View>
              <Text style={styles.greetingText}>Hello 👋</Text>
              <Text style={styles.userNameText}>{userProfile.name}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.bellButton} 
            onPress={() => router.push('/notifications')}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications-outline" size={20} color="#1A1A1A" />
            {notifications.length > 0 && <View style={styles.bellDot} />}
          </TouchableOpacity>
        </View>

        {/* Hero Headline */}
        <View style={styles.heroSection}>
          <Text style={styles.heroEyebrow}>Seamless Flight Booking</Text>
          <Text style={styles.heroHeadline}>Experience</Text>
        </View>

        {/* Segmented Toggle: Single Trip / Multi City */}
        <View style={styles.segmentedToggleRow}>
          <TouchableOpacity 
            style={[styles.togglePill, tripType === 'single' && styles.togglePillActive]}
            onPress={() => setTripType('single')}
            activeOpacity={0.8}
          >
            <Text style={[styles.togglePillText, tripType === 'single' && styles.togglePillTextActive]}>
              Single Trip
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.togglePill, tripType === 'multi' && styles.togglePillActive]}
            onPress={() => {
              setTripType('multi');
              router.push('/build-route');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.togglePillText, tripType === 'multi' && styles.togglePillTextActive]}>
              Multi City
            </Text>
          </TouchableOpacity>
        </View>

        {/* Origin & Destination Flight Card */}
        <View style={styles.flightSearchCard}>
          {/* Departure Row */}
          <TouchableOpacity 
            style={[styles.flightLocationRow, editingField === 'origin' && styles.flightLocationRowActive]}
            activeOpacity={0.8}
            onPress={() => handleFieldPress('origin')}
          >
            <Ionicons name="airplane-outline" size={20} color={editingField === 'origin' ? '#0055FF' : '#6B7280'} style={styles.planeIconDepart} />
            <View style={{ flex: 1 }}>
              <Text style={styles.flightFieldLabel}>From</Text>
              {editingField === 'origin' ? (
                <View style={styles.inlineInputRow}>
                  <TextInput
                    style={styles.flightInputInline}
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    placeholder="Type city or airport..."
                    placeholderTextColor="#9CA3AF"
                    autoFocus
                    returnKeyType="done"
                    autoCapitalize="words"
                    autoCorrect={false}
                    onSubmitEditing={handleCustomCitySubmit}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearchChange('')} style={{ padding: 4 }}>
                      <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <Text style={styles.flightCityText}>
                  {fromDisplayText}
                </Text>
              )}
            </View>
            <Ionicons 
              name={editingField === 'origin' ? 'chevron-up' : 'pencil'} 
              size={16} 
              color={editingField === 'origin' ? '#0055FF' : '#9CA3AF'} 
              style={{ marginRight: 4 }} 
            />
          </TouchableOpacity>

          {/* Divider & Floating Swap Button */}
          <View style={styles.flightDividerContainer}>
            <View style={styles.flightDividerLine} />
            <TouchableOpacity 
              style={styles.flightSwapButton}
              onPress={handleSwap}
              activeOpacity={0.8}
            >
              <Ionicons name="swap-vertical" size={18} color="#0F172A" />
            </TouchableOpacity>
          </View>

          {/* Arrival Row */}
          <TouchableOpacity 
            style={[styles.flightLocationRow, editingField === 'dest' && styles.flightLocationRowActive]}
            activeOpacity={0.8}
            onPress={() => handleFieldPress('dest')}
          >
            <Ionicons name="airplane-outline" size={20} color={editingField === 'dest' ? '#0055FF' : '#6B7280'} style={styles.planeIconArrive} />
            <View style={{ flex: 1 }}>
              <Text style={styles.flightFieldLabel}>To</Text>
              {editingField === 'dest' ? (
                <View style={styles.inlineInputRow}>
                  <TextInput
                    style={styles.flightInputInline}
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    placeholder="Type city or airport..."
                    placeholderTextColor="#9CA3AF"
                    autoFocus
                    returnKeyType="done"
                    autoCapitalize="words"
                    autoCorrect={false}
                    onSubmitEditing={handleCustomCitySubmit}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearchChange('')} style={{ padding: 4 }}>
                      <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <Text style={styles.flightCityText}>
                  {toDisplayText}
                </Text>
              )}
            </View>
            <Ionicons 
              name={editingField === 'dest' ? 'chevron-up' : 'pencil'} 
              size={16} 
              color={editingField === 'dest' ? '#0055FF' : '#9CA3AF'} 
              style={{ marginRight: 4 }} 
            />
          </TouchableOpacity>

          {/* Search Flights Button */}
          {tripDestinations && tripDestinations.length >= 2 && tripDestinations[0]?.name && tripDestinations[1]?.name && (
            <TouchableOpacity 
              style={styles.searchFlightsButton}
              activeOpacity={0.85}
              onPress={() => router.push('/flights')}
            >
              <Ionicons name="search" size={18} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.searchFlightsText}>Search Flights</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Inline City Suggestions Dropdown */}
        {editingField && (
          <View style={styles.searchDropdown}>
            <View style={styles.suggestionsHeader}>
              <Text style={styles.suggestionsTitle}>
                {editingField === 'origin' ? 'SELECT ORIGIN CITY' : 'SELECT DESTINATION CITY'}
              </Text>
              <TouchableOpacity onPress={() => { setEditingField(null); setSearchQuery(''); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.suggestionsScroll} keyboardShouldPersistTaps="handled">
              {suggestions.map(city => (
                <TouchableOpacity 
                  key={city.id}
                  style={styles.suggestionRow}
                  activeOpacity={0.7}
                  onPress={() => handleCitySelect(city)}
                >
                  <View style={styles.suggestionIconCircle}>
                    <Ionicons name="airplane" size={15} color="#0055FF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.suggestionName}>{city.name} - {city.code}</Text>
                    {city.subtitle ? <Text style={styles.suggestionSubtitle}>{city.subtitle}</Text> : null}
                  </View>
                </TouchableOpacity>
              ))}
              {suggestions.length === 0 && searchQuery.trim().length > 0 && (
                <TouchableOpacity 
                  style={styles.suggestionRow}
                  activeOpacity={0.7}
                  onPress={handleCustomCitySubmit}
                >
                  <View style={styles.suggestionIconCircle}>
                    <Ionicons name="location" size={15} color="#0055FF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.suggestionName}>{searchQuery.trim()}</Text>
                    <Text style={styles.suggestionSubtitle}>Tap to use this custom location</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={16} color="#0055FF" />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}

        {/* Destinations Carousel */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.carouselContainer}
        >
          {destinations.map((dest, index) => {
            const isSeen = seenStories.includes(dest.name);
            return (
              <TouchableOpacity 
                key={dest.name} 
                style={styles.destinationItem}
                activeOpacity={0.8}
                onPress={() => handleStoryPress(dest)}
              >
                <View style={[styles.destinationImageContainer, isSeen && { borderColor: '#E0E0E0' }]}>
                  <Image source={{ uri: dest.image }} style={styles.destinationImage} />
                </View>
                <Text style={styles.destinationName}>{dest.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Explore Destinations Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore destinations</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Explore Destinations Carousel */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
          snapToInterval={width * 0.85 + 16}
          decelerationRate="fast"
        >
          {[
            {
              id: 'goa',
              title: 'Goa, India',
              subtitle: 'Beach paradise • 1,240 km away',
              dates: 'Aug 31 - Sep 5',
              price: '₹2,850',
              rating: '4.96',
              image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
            },
            {
              id: 'delhi',
              title: 'Delhi, India',
              subtitle: '34 miles away',
              dates: 'Aug 31 - Sep 5',
              price: '₹2,850',
              rating: '4.96',
              image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
            }
          ].map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={StyleSheet.flatten([styles.exploreCard, { width: width * 0.85, marginRight: 16 }])} 
              activeOpacity={0.9}
              onPress={() => router.push(`/destination/${item.id}`)}
            >
              <View style={styles.exploreImageWrapper}>
                <Image source={{ uri: item.image }} style={styles.exploreImage} />
                <TouchableOpacity style={styles.heartButton}>
                  <Ionicons name="heart-outline" size={22} color="#FFF" />
                </TouchableOpacity>
                {/* Pagination Dots */}
                <View style={styles.paginationContainer}>
                  {[...Array(4)].map((_, i) => (
                    <View key={i} style={[styles.paginationDot, i === 0 && styles.paginationDotActive]} />
                  ))}
                </View>
              </View>
              <View style={styles.exploreDetailsRow}>
                <View style={styles.exploreDetailsText}>
                  <Text style={styles.exploreCardTitle}>{item.title}</Text>
                  <Text style={styles.exploreCardSubtitle}>{item.subtitle}</Text>
                  <Text style={styles.exploreCardDates}>{item.dates}</Text>
                  <Text style={styles.exploreCardPrice}>
                    <Text style={styles.priceBold}>{item.price}</Text> total
                  </Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Upcoming Trips Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming trips</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Trip Card */}
        <View style={styles.tripCard}>
          <View style={styles.tripLeft}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=200&q=80' }} 
              style={styles.tripImage} 
            />
            <View style={styles.tripDetails}>
              <Text style={styles.tripTitle}>BLR–GOI–BOM</Text>
              <View style={styles.tripBadges}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>12–16 Aug</Text>
                </View>
                <View style={[styles.badge, styles.badgeBlue]}>
                  <Text style={[styles.badgeText, styles.badgeTextBlue]}>3 legs</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.tripPriceContainer}>
            <Text style={styles.tripPrice}>₹8,350</Text>
            <Text style={styles.tripAdult}>1 adult</Text>
          </View>
        </View>

        {/* Limited Offer Card */}
        <View style={styles.offerCard}>
          <View style={styles.offerDetails}>
            <View style={styles.offerBadge}>
              <Text style={styles.offerBadgeText}>Limited offer</Text>
            </View>
            <Text style={styles.offerTitle}>Save ₹500 on multi-city trips</Text>
            <Text style={styles.offerSubtitle}>Use code TRIPWAY500 • Ends 31 Aug</Text>
          </View>
          <TouchableOpacity style={styles.offerButton} />
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      <StoryModal 
        visible={activeStory !== null}
        onClose={() => setActiveStory(null)}
        destination={activeStory}
        onNextDestination={handleNextStory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  skyBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Math.round(screenHeight * 0.5),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  greetingText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '400',
    marginBottom: 2,
  },
  userNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  heroSection: {
    paddingHorizontal: 22,
    marginTop: 10,
    marginBottom: 14,
  },
  heroEyebrow: {
    fontSize: 14,
    color: '#71717A',
    fontWeight: '500',
    marginBottom: 0,
  },
  heroHeadline: {
    fontSize: 42,
    fontWeight: '800',
    color: '#0D2314',
    letterSpacing: -1.2,
    lineHeight: 44,
  },
  segmentedToggleRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  togglePill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  togglePillActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  togglePillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  togglePillTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  flightSearchCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 26,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative',
  },
  flightLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  planeIconDepart: {
    transform: [{ rotate: '-45deg' }],
    marginRight: 14,
  },
  planeIconArrive: {
    transform: [{ rotate: '45deg' }],
    marginRight: 14,
  },
  flightCityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  flightDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    position: 'relative',
  },
  flightDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 34,
    marginRight: 50,
  },
  flightSwapButton: {
    position: 'absolute',
    right: 0,
    top: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  flightLocationRowActive: {
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  flightFieldLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  flightPlaceholder: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  flightCodeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
  },
  searchFlightsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0055FF',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 10,
    marginBottom: 6,
    shadowColor: '#0055FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  searchFlightsText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  inlineInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  flightInputInline: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0055FF',
    paddingVertical: 2,
    paddingHorizontal: 0,
    margin: 0,
  },
  searchDropdown: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -16,
    marginBottom: 24,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
  },
  suggestionsScroll: {
    maxHeight: 220,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  suggestionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  suggestionCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0055FF',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  carouselContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  destinationItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  destinationImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#007BFF',
    padding: 2,
    marginBottom: 8,
  },
  destinationImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  destinationName: {
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: '600',
  },
  exploreCard: {
    marginBottom: 30,
  },
  exploreImageWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  exploreImage: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  exploreDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exploreDetailsText: {
    flex: 1,
  },
  exploreCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  exploreCardSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  exploreCardDates: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 6,
  },
  exploreCardPrice: {
    fontSize: 14,
    color: '#8E8E93',
  },
  priceBold: {
    fontWeight: '700',
    color: '#1A1A1A',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  tripCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 16,
    marginBottom: 24,
  },
  tripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  tripDetails: {
    justifyContent: 'center',
  },
  tripTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  tripBadges: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  badgeBlue: {
    backgroundColor: '#E6F0FF',
  },
  badgeTextBlue: {
    color: '#007BFF',
  },
  tripPriceContainer: {
    alignItems: 'flex-end',
  },
  tripPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  tripAdult: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111315',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
  },
  offerDetails: {
    flex: 1,
    paddingRight: 20,
  },
  offerBadge: {
    backgroundColor: '#0055FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  offerBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  offerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  offerSubtitle: {
    color: '#A0A0A5',
    fontSize: 13,
  },
  offerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0055FF',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFF',
    width: 6,
    height: 6,
  },
});
