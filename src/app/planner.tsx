import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, Alert, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTripContext } from '@/context/TripContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const TIME_OPTIONS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM'
];

const TIME_CATEGORIES = {
  Morning: ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  Afternoon: ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'],
  Evening: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM']
};

const DURATION_PRESETS = [
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '1.5h', value: '1.5h' },
  { label: '2h', value: '2h' },
  { label: '3h', value: '3h' },
  { label: '4h', value: '4h' }
];

const getEndTimeFromDuration = (startTimeStr: string, durationLabel: string) => {
  const startIndex = TIME_OPTIONS.indexOf(startTimeStr);
  if (startIndex === -1) return TIME_OPTIONS[Math.min(TIME_OPTIONS.length - 1, startIndex + 4)];
  
  let steps = 4; // default 2 hours (4 steps of 30 mins)
  if (durationLabel === '30m') steps = 1;
  else if (durationLabel === '1h') steps = 2;
  else if (durationLabel === '1.5h') steps = 3;
  else if (durationLabel === '2h') steps = 4;
  else if (durationLabel === '3h') steps = 6;
  else if (durationLabel === '4h') steps = 8;
  
  const targetIndex = Math.min(TIME_OPTIONS.length - 1, startIndex + steps);
  return TIME_OPTIONS[targetIndex];
};

const getDurationLabel = (start: string, end: string) => {
  const diffMin = parseTimeToMinutes(end) - parseTimeToMinutes(start);
  if (diffMin <= 0) return '';
  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
};



const CITY_RECOMMENDATIONS: Record<string, any[]> = {
  'BLR': [
    { id: 'rec-1', title: 'Lalbagh Gardens', category: 'Nature', transport: '15 min Cab', entryFee: '₹25', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80' },
    { id: 'rec-2', title: 'Nandi Hills Sunrise', category: 'Sightseeing', transport: '1.5 hr Cab', entryFee: '₹20', image: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=400&q=80' },
    { id: 'rec-3', title: 'Commercial Street', category: 'Shopping', transport: '10 min Auto', entryFee: 'Free', image: 'https://images.unsplash.com/photo-1519558260268-cde7e03aebf0?auto=format&fit=crop&w=400&q=80' },
  ],
  'GOI': [
    { id: 'rec-1', title: 'Dudhsagar Falls', category: 'Nature', transport: '1 hr Cab', entryFee: '₹400', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80' },
    { id: 'rec-2', title: 'Basilica of Bom Jesus', category: 'History', transport: '25 min Cab', entryFee: 'Free', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80' },
    { id: 'rec-3', title: 'Calangute Beach', category: 'Beach', transport: '10 min Walk', entryFee: 'Free', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80' },
  ],
  'BOM': [
    { id: 'rec-1', title: 'Colaba Causeway', category: 'Shopping', transport: '10 min Walk', entryFee: 'Free', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=400&q=80' },
    { id: 'rec-2', title: 'Elephanta Caves', category: 'History', transport: 'Ferry Ride', entryFee: '₹200', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80' },
    { id: 'rec-3', title: 'Haji Ali Dargah', category: 'Culture', transport: '15 min Cab', entryFee: 'Free', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=400&q=80' },
  ],
  'MAA': [
    { id: 'rec-1', title: 'Express Avenue Mall', category: 'Shopping', transport: '10 min Auto', entryFee: 'Free', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80' },
    { id: 'rec-2', title: 'Mahabalipuram Temples', category: 'Culture', transport: '1.5 hr Cab', entryFee: '₹40', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80' },
    { id: 'rec-3', title: 'Vandalur Zoo', category: 'Nature', transport: '40 min Metro', entryFee: '₹120', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80' },
  ],
  'DEFAULT': [
    { id: 'rec-1', title: 'Museum Visit', category: 'Culture', transport: '15 min Cab', entryFee: '₹100', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=400&q=80' },
    { id: 'rec-2', title: 'Botanic Garden walk', category: 'Nature', transport: 'Walk', entryFee: 'Free', image: 'https://images.unsplash.com/photo-1519558260268-cde7e03aebf0?auto=format&fit=crop&w=400&q=80' }
  ]
};

const parseTimeToMinutes = (timeStr: string) => {
  try {
    const [time, ampm] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (ampm.toUpperCase() === 'PM' && hours !== 12) {
      hours += 12;
    } else if (ampm.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }
    return hours * 60 + minutes;
  } catch (e) {
    return 0;
  }
};

const sortActivities = (list: any[]) => {
  return [...list].sort((a, b) => {
    const startTimeA = a.timeRange.split('-')[0].trim();
    const startTimeB = b.timeRange.split('-')[0].trim();
    return parseTimeToMinutes(startTimeA) - parseTimeToMinutes(startTimeB);
  });
};

export default function PlannerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { destinations: activeDestinations, departDate: activeDepartDate, savedTrips } = useTripContext();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Selector state
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // State for custom-added/edited itineraries
  const [customItineraries, setCustomItineraries] = useState<Record<string, any[]>>({});

  // Resolve active/selected trip data
  const resolvedTrip = useMemo(() => {
    if (selectedTripId === null) return null;
    
    if (selectedTripId === 'active') {
      const stops = activeDestinations.filter(d => !d.isStart).map(d => d.name).join(' → ');
      return {
        id: 'active',
        destinations: activeDestinations,
        departDate: activeDepartDate,
        name: stops ? `Trip to ${stops}` : 'Current Plan',
        status: 'Active'
      };
    }
    const found = savedTrips.find(t => t.id === selectedTripId);
    if (found) {
      const stops = found.destinations.filter(d => !d.isStart).map(d => d.name).join(' → ');
      return {
        id: found.id,
        destinations: found.destinations,
        departDate: found.departDate,
        name: stops ? `Trip to ${stops}` : 'Saved Trip',
        status: found.status
      };
    }
    return {
      id: 'active',
      destinations: activeDestinations,
      departDate: activeDepartDate,
      name: 'Current Plan',
      status: 'Active'
    };
  }, [selectedTripId, activeDestinations, activeDepartDate, savedTrips]);

  // Use the resolved trip's destinations and departDate
  const itineraryDays = useMemo(() => {
    if (!resolvedTrip) return [];
    
    const days: { date: Date; cityCode: string; cityName: string }[] = [];
    let currentDate = new Date(resolvedTrip.departDate);
    
    resolvedTrip.destinations.forEach((dest, index) => {
      let daysInCity = dest.nights;
      if (index === resolvedTrip.destinations.length - 1 && daysInCity === 0) daysInCity = 1;
      if (index === 0 && daysInCity === 0) daysInCity = 1;
      
      for (let i = 0; i < daysInCity; i++) {
        days.push({
          date: new Date(currentDate),
          cityCode: dest.code,
          cityName: dest.name,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return days;
  }, [resolvedTrip]);

  // Reset selectedDateIndex if it exceeds new days count
  React.useEffect(() => {
    if (selectedDateIndex >= itineraryDays.length) {
      setSelectedDateIndex(0);
    }
  }, [itineraryDays, selectedDateIndex]);

  const activeDay = itineraryDays[selectedDateIndex] || itineraryDays[0];

  // Modal UI State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);

  // Start & End Time picker selections
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');
  const [activeTimeTab, setActiveTimeTab] = useState<'start' | 'end'>('start');

  const filteredEndTimes = useMemo(() => {
    const startIndex = TIME_OPTIONS.indexOf(startTime);
    if (startIndex === -1) return TIME_OPTIONS;
    return TIME_OPTIONS.slice(startIndex + 1);
  }, [startTime]);

  const activeDurationLabel = useMemo(() => {
    const startMin = parseTimeToMinutes(startTime);
    const endMin = parseTimeToMinutes(endTime);
    const currentDurationMin = endMin - startMin;
    if (currentDurationMin === 30) return '30m';
    if (currentDurationMin === 60) return '1h';
    if (currentDurationMin === 90) return '1.5h';
    if (currentDurationMin === 120) return '2h';
    if (currentDurationMin === 180) return '3h';
    if (currentDurationMin === 240) return '4h';
    return 'custom';
  }, [startTime, endTime]);

  // Prefix the activeDateKey with resolvedTrip.id to isolate schedules per trip
  const activeDateKey = (activeDay && resolvedTrip) ? `${resolvedTrip.id}-${activeDay.date.toDateString()}` : '';

  const activities = useMemo(() => {
    if (!activeDateKey) return [];
    return customItineraries[activeDateKey] || [];
  }, [customItineraries, activeDateKey]);

  const recommendations = activeDay ? (CITY_RECOMMENDATIONS[activeDay.cityCode] || CITY_RECOMMENDATIONS['DEFAULT']) : [];

  const [apiRecommendations, setApiRecommendations] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Helper mappings for live search categories and images
  const getCategoryImage = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('garden') || t.includes('park') || t.includes('nature') || t.includes('forest') || t.includes('lake') || t.includes('beach')) {
      return 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80'; // Nature
    }
    if (t.includes('museum') || t.includes('gallery') || t.includes('monument') || t.includes('castle') || t.includes('fort') || t.includes('temple') || t.includes('church') || t.includes('mosque') || t.includes('historical')) {
      return 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80'; // History/Culture
    }
    if (t.includes('mall') || t.includes('shop') || t.includes('market') || t.includes('store') || t.includes('bazaar')) {
      return 'https://images.unsplash.com/photo-1519558260268-cde7e03aebf0?auto=format&fit=crop&w=400&q=80'; // Shopping
    }
    if (t.includes('restaurant') || t.includes('cafe') || t.includes('food') || t.includes('bar') || t.includes('pub') || t.includes('bakery')) {
      return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'; // Food
    }
    return 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80'; // Tourism/Default
  };

  const getCategoryLabel = (type: string, cls: string) => {
    if (!type && !cls) return 'Place';
    const val = type || cls;
    return val.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  React.useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2 || !activeDay) {
      setApiRecommendations([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const query = `${searchQuery.trim()} ${activeDay.cityName}`;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=6`;
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'RouteeTravelPlanner/1.0 (faheem@routeeapp.example.com)'
          }
        });
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const formatted = data.map((item: any) => {
            const title = item.display_name.split(',')[0].trim();
            const category = getCategoryLabel(item.type, item.class);
            const image = getCategoryImage(item.type || item.class || '');
            
            const transportOptions = ['10 min Walk', '15 min Cab', '20 min Metro', '10 min Auto', '5 min Walk'];
            const mockTransport = transportOptions[Math.floor(Math.random() * transportOptions.length)];
            
            const isFree = ['garden', 'park', 'church', 'mosque', 'temple', 'place_of_worship'].includes(item.type || item.class);
            const mockEntryFee = isFree ? 'Free' : '₹100';

            return {
              id: `osm-${item.place_id}`,
              title,
              category,
              transport: mockTransport,
              entryFee: mockEntryFee,
              image,
              isReal: true
            };
          });
          
          const filtered = formatted.filter(item => 
            !activities.some(act => act.title.toLowerCase() === item.title.toLowerCase())
          );
          setApiRecommendations(filtered);
        } else {
          setApiRecommendations([]);
        }
      } catch (error) {
        console.error('Error fetching places from OSM:', error);
        setApiRecommendations([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, activeDay, activities]);

  const filteredRecommendations = useMemo(() => {
    let list = recommendations.filter(rec => 
      !activities.some(act => act.title.toLowerCase() === rec.title.toLowerCase())
    );
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(rec => 
        rec.title.toLowerCase().includes(q) ||
        rec.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [recommendations, activities, searchQuery]);

  const allSearchResults = useMemo(() => {
    const localMatches = filteredRecommendations;
    const uniqueApiMatches = apiRecommendations.filter(apiRec => 
      !localMatches.some(locRec => locRec.title.toLowerCase() === apiRec.title.toLowerCase())
    );
    return [...localMatches, ...uniqueApiMatches];
  }, [filteredRecommendations, apiRecommendations]);

  const handleRecommendPress = (rec: any) => {
    setSelectedRecommendation(rec);
    setStartTime('09:00 AM');
    setEndTime('11:00 AM');
    setActiveTimeTab('start');
    setIsModalVisible(true);
  };

  const handleAddActivity = () => {
    if (!selectedRecommendation || !activeDateKey) return;

    const newStartMin = parseTimeToMinutes(startTime);
    const newEndMin = parseTimeToMinutes(endTime);

    // Validation 1: End time must be after start time
    if (newEndMin <= newStartMin) {
      Alert.alert(
        'Invalid Time Range',
        'The end time must be later than the start time.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Validation 2: Check if slot overlaps with existing activities
    const overlapActivity = activities.find(act => {
      const [existStartStr, existEndStr] = act.timeRange.split('-').map((s: string) => s.trim());
      const existStartMin = parseTimeToMinutes(existStartStr);
      const existEndMin = parseTimeToMinutes(existEndStr);

      return newStartMin < existEndMin && newEndMin > existStartMin;
    });

    if (overlapActivity) {
      Alert.alert(
        'Time Conflict',
        `This time slot overlaps with an existing activity:\n\n"${overlapActivity.title}" scheduled at ${overlapActivity.timeRange}.\n\nPlease choose a different timing.`,
        [{ text: 'OK' }]
      );
      return;
    }

    const timeRange = `${startTime} - ${endTime}`;

    const newActivity = {
      id: `custom-${Date.now()}`,
      timeRange,
      title: selectedRecommendation.title,
      category: selectedRecommendation.category,
      transport: selectedRecommendation.transport,
      entryFee: selectedRecommendation.entryFee,
      image: selectedRecommendation.image,
      isCustom: true
    };

    setCustomItineraries(prev => {
      const currentList = prev[activeDateKey] || [];
      const updatedList = [...currentList, newActivity];
      return {
        ...prev,
        [activeDateKey]: sortActivities(updatedList)
      };
    });

    setIsModalVisible(false);
    setSelectedRecommendation(null);
    setSearchQuery('');
  };

  const handleDeleteActivity = (id: string) => {
    if (!activeDateKey) return;
    setCustomItineraries(prev => {
      const currentList = prev[activeDateKey] || [];
      const updatedList = currentList.filter(act => act.id !== id);
      return {
        ...prev,
        [activeDateKey]: updatedList
      };
    });
  };

  if (selectedTripId === null) {
    const confirmedTrips = savedTrips.filter(t => t.status === 'Confirmed');
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Index Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <View style={styles.tripsBadge}>
              <Text style={styles.tripsBadgeText}>{confirmedTrips.length} Trips</Text>
            </View>
          </View>

          <Text style={styles.pageTitle}>Planner</Text>

          <View style={styles.contentArea}>
            {confirmedTrips.length === 0 ? (
              <View style={styles.emptyPlannerContainer}>
                <Ionicons name="calendar-outline" size={64} color="#D1D1D6" style={{ marginBottom: 16 }} />
                <Text style={styles.emptyPlannerTitle}>No trips to plan yet</Text>
                <Text style={styles.emptyPlannerSub}>Book a trip first to start planning your day-by-day itinerary.</Text>
                <TouchableOpacity style={styles.planNewBtnSolid} onPress={() => router.push('/build-route')}>
                  <Text style={styles.planNewBtnSolidText}>Plan a new trip</Text>
                </TouchableOpacity>
              </View>
            ) : (
              confirmedTrips.map(trip => {
                const routeString = trip.destinations.map(d => d.code).join(' · ');
                const totalNights = trip.destinations.reduce((sum: number, dest: any) => sum + (dest.nights || 0), 0);
                const totalPassengers = trip.passengers.adults + trip.passengers.children + trip.passengers.infants;
                const imgUrl = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'; 
                
                return (
                  <TouchableOpacity 
                    key={trip.id} 
                    activeOpacity={0.9}
                    onPress={() => setSelectedTripId(trip.id)}
                  >
                    <View style={styles.tripCard}>
                      <View style={styles.cardImageContainer}>
                        <Image source={{ uri: imgUrl }} style={StyleSheet.absoluteFill} />
                        <View style={styles.statusPill}>
                          <Text style={styles.statusTextConfirmed}>{trip.status}</Text>
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
                          <View style={styles.greenBadge}>
                            <Text style={styles.greenBadgeText}>
                              {trip.destinations.length - 1} legs · {totalNights} nights
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.footerRow}>
                          <View>
                            <Text style={styles.subText}>
                              {totalPassengers} traveler{totalPassengers > 1 ? 's' : ''}
                            </Text>
                          </View>
                          <View style={styles.buttonsRow}>
                            <View style={styles.solidBtn}>
                              <Text style={styles.solidBtnText}>Plan Itinerary</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedTripId(null)}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.tripsBadge}>
          <Text style={styles.tripsBadgeText}>Timeline</Text>
        </View>
      </View>

      <Text style={styles.pageTitle} numberOfLines={1}>
        {resolvedTrip?.name || 'Current Plan'}
      </Text>

      {/* Horizontal Date Selector */}
      <View style={styles.dateSelectorWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
          {itineraryDays.map((day, index) => {
            const isSelected = selectedDateIndex === index;
            const dayNum = day.date.getDate();
            const monthStr = day.date.toLocaleString('default', { month: 'short' });
            
            return (
              <TouchableOpacity 
                key={index}
                style={[styles.datePill, isSelected && styles.datePillActive]}
                onPress={() => setSelectedDateIndex(index)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dateText, isSelected && styles.dateTextActive]}>
                  {dayNum} {monthStr}
                </Text>
                <Text style={[styles.dateCity, isSelected && styles.dateCityActive]} numberOfLines={1}>
                  {day.cityName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Search Bar */}
        {activeDay && (
          <View style={styles.searchSection}>
            <View style={styles.searchBarContainer}>
              <Ionicons name="search-outline" size={18} color="#8E8E93" style={styles.searchIcon} />
              <TextInput 
                style={styles.searchInput}
                placeholder={`Search or add places in ${activeDay.cityName}...`}
                placeholderTextColor="#8E8E93"
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
              {searchQuery.trim().length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                  <Ionicons name="close-circle" size={16} color="#8E8E93" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Search Mode vs Timeline/Plan Mode */}
        {searchQuery.trim().length > 0 ? (
          <View style={styles.searchModeContainer}>
            {/* Search Results List */}
            {allSearchResults.length > 0 ? (
              <View style={styles.searchResultsList}>
                <Text style={styles.searchResultsTitle}>
                  {isSearching ? '🔍 Searching real places...' : `Places found in ${activeDay.cityName}`}
                </Text>
                {allSearchResults.map((rec) => (
                  <TouchableOpacity
                    key={rec.id}
                    style={styles.searchResultRow}
                    onPress={() => handleRecommendPress(rec)}
                    activeOpacity={0.7}
                  >
                    <Image source={{ uri: rec.image }} style={styles.searchResultImage} contentFit="cover" />
                    <View style={styles.searchResultInfo}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.searchResultCategory}>{rec.category}</Text>
                        {rec.isReal && (
                          <View style={styles.liveBadge}>
                            <Ionicons name="globe-outline" size={10} color="#0055FF" style={{ marginRight: 2 }} />
                            <Text style={styles.liveBadgeText}>Live Map</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.searchResultTitle} numberOfLines={1}>{rec.title}</Text>
                      <Text style={styles.searchResultDetails}>{rec.transport} · {rec.entryFee}</Text>
                    </View>
                    <Ionicons name="add-circle" size={24} color="#0055FF" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : isSearching ? (
              <View style={styles.noSearchResults}>
                <Ionicons name="search-outline" size={36} color="#C7C7CC" />
                <Text style={styles.noSearchResultsText}>Searching OpenStreetMap for real places...</Text>
              </View>
            ) : (
              <View style={styles.noSearchResults}>
                <Ionicons name="search-outline" size={36} color="#C7C7CC" />
                <Text style={styles.noSearchResultsText}>No matching recommended places</Text>
              </View>
            )}

            {/* Quick Add Custom Place Option */}
            <TouchableOpacity 
              style={styles.quickAddCustomRow}
              onPress={() => {
                handleRecommendPress({
                  title: searchQuery.trim(),
                  category: 'Custom',
                  transport: 'Walk',
                  entryFee: 'Free',
                  image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=400&q=80'
                });
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color="#0055FF" />
              <Text style={styles.quickAddCustomText}>Add "{searchQuery.trim()}" as custom place</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Vertical Timeline */}
            <View style={styles.timelineContainer}>
              {activities.length === 0 ? (
                <View style={styles.emptyTimeline}>
                  <Ionicons name="calendar-outline" size={48} color="#C7C7CC" />
                  <Text style={styles.emptyTimelineText}>No activities planned yet.</Text>
                  <Text style={styles.emptyTimelineSub}>Select a recommended place below to fill your day!</Text>
                </View>
              ) : (
                activities.map((act, index) => {
                  const isLast = index === activities.length - 1;
                  return (
                    <View key={act.id} style={styles.timelineRow}>
                      {/* Time Column */}
                      <View style={styles.timeColumn}>
                        <Text style={styles.timeTextPrimary}>{act.timeRange.split('-')[0].trim()}</Text>
                        <Text style={styles.timeTextSecondary}>{act.timeRange.split('-')[1]?.trim() || ''}</Text>
                      </View>

                      {/* Vertical Line & Dot */}
                      <View style={styles.lineColumn}>
                        <View style={styles.dot} />
                        {!isLast && <View style={styles.verticalLine} />}
                      </View>

                      {/* Activity Card */}
                      <View style={styles.activityCard}>
                        <Image source={{ uri: act.image }} style={styles.activityImage} contentFit="cover" />
                        <View style={styles.activityContent}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <Text style={styles.categoryText}>{act.category}</Text>
                            <TouchableOpacity onPress={() => handleDeleteActivity(act.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                              <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.activityTitle}>{act.title}</Text>
                          
                          <View style={styles.detailsRow}>
                            <View style={styles.detailBadge}>
                              <Ionicons name="car-outline" size={12} color="#0055FF" />
                              <Text style={styles.detailBadgeText}>{act.transport}</Text>
                            </View>
                            <View style={styles.detailBadge}>
                              <Ionicons name="ticket-outline" size={12} color="#00D65B" />
                              <Text style={[styles.detailBadgeText, { color: '#00D65B' }]}>{act.entryFee}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            {/* Recommended Places Section */}
            {activeDay && filteredRecommendations.length > 0 && (
              <View style={styles.recsContainer}>
                <Text style={styles.sectionTitle}>Recommendations for {activeDay.cityName}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recsScroll}>
                  {filteredRecommendations.map((rec) => (
                    <TouchableOpacity 
                      key={rec.id} 
                      style={styles.recCard}
                      activeOpacity={0.8}
                      onPress={() => handleRecommendPress(rec)}
                    >
                      <Image source={{ uri: rec.image }} style={styles.recImage} contentFit="cover" />
                      <View style={styles.recContent}>
                        <Text style={styles.recCategory}>{rec.category}</Text>
                        <Text style={styles.recTitle} numberOfLines={1}>{rec.title}</Text>
                        <View style={styles.recFooter}>
                          <Text style={styles.recDetailText}>{rec.transport} · {rec.entryFee}</Text>
                          <Ionicons name="add-circle" size={20} color="#0055FF" style={styles.addIcon} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        )}

      </ScrollView>

      {/* Time Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '92%', paddingBottom: Math.max(insets.bottom, 24) }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Visit Time</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            {selectedRecommendation && (() => {
              const startMinForVisual = parseTimeToMinutes(startTime);
              const endMinForVisual = parseTimeToMinutes(endTime);
              const totalTimelineMinutes = 15 * 60; // 8 AM to 11 PM (900 minutes)
              const timelineStartOffset = 8 * 60; // 480 minutes
              
              const leftPercent = Math.max(0, Math.min(100, ((startMinForVisual - timelineStartOffset) / totalTimelineMinutes) * 100));
              const widthPercent = Math.max(0, Math.min(100 - leftPercent, ((endMinForVisual - startMinForVisual) / totalTimelineMinutes) * 100));

              return (
                <View style={styles.modalBody}>
                  <View style={styles.placeInfoRow}>
                    <Image source={{ uri: selectedRecommendation.image }} style={styles.modalPlaceImage} contentFit="cover" />
                    <View style={styles.modalPlaceDetails}>
                      <Text style={styles.modalPlaceCategory}>{selectedRecommendation.category}</Text>
                      <Text style={styles.modalPlaceTitle}>{selectedRecommendation.title}</Text>
                      <Text style={styles.modalPlaceSub}>{selectedRecommendation.transport} · {selectedRecommendation.entryFee}</Text>
                    </View>
                  </View>

                  {/* Interactive Timeline Visualizer */}
                  <View style={styles.timelineVisualizerContainer}>
                    <View style={styles.timelineVisualizerLabels}>
                      <Text style={styles.timelineVisualizerLabelText}>8 AM</Text>
                      <Text style={styles.timelineVisualizerLabelText}>12 PM</Text>
                      <Text style={styles.timelineVisualizerLabelText}>4 PM</Text>
                      <Text style={styles.timelineVisualizerLabelText}>8 PM</Text>
                      <Text style={styles.timelineVisualizerLabelText}>11 PM</Text>
                    </View>
                    <View style={styles.timelineVisualizerTrack}>
                      <View style={[styles.timelineVisualizerTrackFill, { left: `${leftPercent}%`, width: `${widthPercent}%` }]} />
                      {/* Markers */}
                      <View style={[styles.timelineVisualizerMarker, { left: `${((12 * 60 - 8 * 60) / totalTimelineMinutes) * 100}%` }]} />
                      <View style={[styles.timelineVisualizerMarker, { left: `${((16 * 60 - 8 * 60) / totalTimelineMinutes) * 100}%` }]} />
                      <View style={[styles.timelineVisualizerMarker, { left: `${((20 * 60 - 8 * 60) / totalTimelineMinutes) * 100}%` }]} />
                    </View>
                  </View>

                  {/* Custom Segmented Tab Header */}
                  <View style={styles.tabHeaderContainer}>
                    <TouchableOpacity 
                      style={[styles.tabButton, activeTimeTab === 'start' && styles.tabButtonActive]}
                      onPress={() => setActiveTimeTab('start')}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="time-outline" size={18} color={activeTimeTab === 'start' ? '#0055FF' : '#8E8E93'} />
                      <View style={styles.tabButtonTextContainer}>
                        <Text style={styles.tabButtonLabel}>START TIME</Text>
                        <Text style={[styles.tabButtonValue, activeTimeTab === 'start' && styles.tabButtonValueActive]}>
                          {startTime.replace(/^0/, '')}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <View style={styles.tabSeparator}>
                      <Ionicons name="arrow-forward" size={16} color="#C7C7CC" />
                    </View>

                    <TouchableOpacity 
                      style={[styles.tabButton, activeTimeTab === 'end' && styles.tabButtonActive]}
                      onPress={() => setActiveTimeTab('end')}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="flag-outline" size={18} color={activeTimeTab === 'end' ? '#0055FF' : '#8E8E93'} />
                      <View style={styles.tabButtonTextContainer}>
                        <Text style={styles.tabButtonLabel}>END TIME</Text>
                        <Text style={[styles.tabButtonValue, activeTimeTab === 'end' && styles.tabButtonValueActive]}>
                          {endTime.replace(/^0/, '')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Picker Scroll Container */}
                  <ScrollView 
                    style={styles.pickerSelectorScroll} 
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                  >
                    {activeTimeTab === 'start' ? (
                      <View style={styles.gridContainer}>
                        {Object.entries(TIME_CATEGORIES).map(([category, times]) => (
                          <View key={category} style={styles.categorySection}>
                            <Text style={styles.gridSectionHeader}>
                              {category === 'Morning' ? '🌅 ' : category === 'Afternoon' ? '☀️ ' : '🌙 '}
                              {category}
                            </Text>
                            <View style={styles.gridRow}>
                              {times.map((t, idx) => {
                                const isSelected = startTime === t;
                                return (
                                  <TouchableOpacity
                                    key={t}
                                    style={[
                                      styles.gridCell,
                                      isSelected && styles.gridCellActive,
                                      { marginRight: (idx + 1) % 4 === 0 ? 0 : '2%' }
                                    ]}
                                    onPress={() => {
                                      setStartTime(t);
                                      const defaultEnd = getEndTimeFromDuration(t, '2h');
                                      setEndTime(defaultEnd);
                                      setActiveTimeTab('end');
                                    }}
                                    activeOpacity={0.7}
                                  >
                                    <Text style={[styles.gridCellText, isSelected && styles.gridCellTextActive]}>
                                      {t.replace(/^0/, '').replace(' AM', '').replace(' PM', '')}
                                    </Text>
                                    <Text style={[styles.gridCellPeriodText, isSelected && styles.gridCellPeriodTextActive]}>
                                      {t.includes('AM') ? 'AM' : 'PM'}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.endTimeContainer}>
                        {/* Duration presets row */}
                        <Text style={styles.durationPresetsLabel}>Choose Duration</Text>
                        <View style={styles.durationPresetsRow}>
                          {DURATION_PRESETS.map((preset) => {
                            const isActive = activeDurationLabel === preset.value;
                            return (
                              <TouchableOpacity
                                key={preset.value}
                                style={[styles.durationPill, isActive && styles.durationPillActive]}
                                onPress={() => {
                                  const newEnd = getEndTimeFromDuration(startTime, preset.value);
                                  setEndTime(newEnd);
                                }}
                                activeOpacity={0.7}
                              >
                                <Text style={[styles.durationPillText, isActive && styles.durationPillTextActive]}>
                                  {preset.label}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                        {/* Custom end time list */}
                        <Text style={styles.durationPresetsLabel}>Or select specific end time</Text>
                        <View style={styles.gridRow}>
                          {filteredEndTimes.map((t, idx) => {
                            const isSelected = endTime === t;
                            const durLabel = getDurationLabel(startTime, t);
                            return (
                              <TouchableOpacity
                                key={t}
                                style={[
                                  styles.gridCell,
                                  isSelected && styles.gridCellActive,
                                  { marginRight: (idx + 1) % 4 === 0 ? 0 : '2%', paddingVertical: 6 }
                                ]}
                                onPress={() => setEndTime(t)}
                                activeOpacity={0.7}
                              >
                                <Text style={[styles.gridCellText, isSelected && styles.gridCellTextActive]}>
                                  {t.replace(/^0/, '').replace(' AM', '').replace(' PM', '')}
                                </Text>
                                <Text style={[styles.gridCellPeriodText, isSelected && styles.gridCellPeriodTextActive]}>
                                  {t.includes('AM') ? 'AM' : 'PM'}
                                </Text>
                                {durLabel ? (
                                  <Text style={[styles.gridCellDurationText, isSelected && styles.gridCellDurationTextActive]}>
                                    {durLabel}
                                  </Text>
                                ) : null}
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    )}
                  </ScrollView>

                  {/* Action Button */}
                  <TouchableOpacity style={styles.confirmButton} onPress={handleAddActivity} activeOpacity={0.8}>
                    <Text style={styles.confirmButtonText}>Add to Timeline</Text>
                  </TouchableOpacity>
                </View>
              );
            })()}
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
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    paddingHorizontal: 20,
    marginBottom: 20,
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
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 1,
    marginBottom: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  dateSelectorWrapper: {
    backgroundColor: '#F9F9FB',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dateScroll: {
    paddingHorizontal: 20,
  },
  datePill: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#FFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    minWidth: 95,
  },
  datePillActive: {
    backgroundColor: '#0055FF',
    borderColor: '#0055FF',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  dateTextActive: {
    color: '#FFF',
  },
  dateCity: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 3,
  },
  dateCityActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    margin: 20,
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroImage: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  heroTextContainer: {
    padding: 20,
    zIndex: 10,
  },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
  },
  timelineContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timeColumn: {
    width: 60,
    alignItems: 'flex-end',
    paddingTop: 4,
  },
  timeTextPrimary: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  timeTextSecondary: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 2,
  },
  lineColumn: {
    width: 40,
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0055FF',
    borderWidth: 3,
    borderColor: '#EEF4FF',
    marginTop: 6,
    zIndex: 2,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#EAEAEA',
    marginTop: -8,
    marginBottom: -6,
  },
  activityCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    overflow: 'hidden',
  },
  activityImage: {
    width: '100%',
    height: 120,
  },
  activityContent: {
    padding: 16,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  detailBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0055FF',
    marginLeft: 4,
  },
  recsContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  searchSection: {
    marginTop: 20,
    marginBottom: 8,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 14,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
    paddingVertical: 8,
  },
  quickAddCustomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  quickAddCustomText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0055FF',
    marginLeft: 8,
  },
  noRecsContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRecsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  recsScroll: {
    paddingHorizontal: 20,
  },
  recCard: {
    width: 200,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    overflow: 'hidden',
  },
  recImage: {
    width: '100%',
    height: 110,
  },
  recContent: {
    padding: 12,
  },
  recCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  recFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recDetailText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
  },
  addIcon: {
    marginLeft: 4,
  },
  emptyTimeline: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginTop: 10,
  },
  emptyTimelineText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyTimelineSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    paddingVertical: 12,
    flexShrink: 1,
  },
  placeInfoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#F7F7F9',
    padding: 12,
    borderRadius: 16,
  },
  modalPlaceImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  modalPlaceDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  modalPlaceCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  modalPlaceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginVertical: 2,
  },
  modalPlaceSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  timelineVisualizerContainer: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  timelineVisualizerLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timelineVisualizerLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
  },
  timelineVisualizerTrack: {
    height: 6,
    backgroundColor: '#EAEAEA',
    borderRadius: 3,
    position: 'relative',
  },
  timelineVisualizerTrackFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#0055FF',
    borderRadius: 3,
  },
  timelineVisualizerMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#FFF',
  },
  tabHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  tabButtonTextContainer: {
    marginLeft: 8,
  },
  tabButtonLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  tabButtonValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 1,
  },
  tabButtonValueActive: {
    color: '#0055FF',
  },
  tabSeparator: {
    paddingHorizontal: 6,
  },
  pickerSelectorScroll: {
    maxHeight: 200,
    flexShrink: 1,
    marginBottom: 10,
  },
  gridContainer: {
    paddingBottom: 16,
  },
  categorySection: {
    marginBottom: 16,
  },
  gridSectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  gridCell: {
    width: '23.5%',
    marginBottom: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  gridCellActive: {
    backgroundColor: '#EEF4FF',
    borderColor: '#0055FF',
  },
  gridCellText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  gridCellTextActive: {
    color: '#0055FF',
    fontWeight: '800',
  },
  gridCellPeriodText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 1,
  },
  gridCellPeriodTextActive: {
    color: '#0055FF',
  },
  endTimeContainer: {
    paddingBottom: 16,
  },
  durationPresetsLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 0.5,
    marginTop: 6,
  },
  durationPresetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: -3,
  },
  durationPill: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  durationPillActive: {
    backgroundColor: '#0055FF',
    borderColor: '#0055FF',
  },
  durationPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  durationPillTextActive: {
    color: '#FFF',
  },
  gridCellDurationText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 2,
  },
  gridCellDurationTextActive: {
    color: '#0055FF',
  },
  confirmButton: {
    backgroundColor: '#0055FF',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },

  searchModeContainer: {
    paddingTop: 10,
  },
  searchResultsList: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  searchResultsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
  },
  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  searchResultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  searchResultCategory: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  searchResultTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginVertical: 1,
  },
  searchResultDetails: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
  },
  noSearchResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 16,
  },
  noSearchResultsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0055FF',
    textTransform: 'uppercase',
  },
  emptyPlannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  contentArea: {
    backgroundColor: '#F7F7F9',
    paddingTop: 20,
    paddingHorizontal: 20,
    minHeight: Dimensions.get('window').height,
  },
  emptyPlannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyPlannerSub: {
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  subText: {
    fontSize: 11,
    color: '#A0A0A5',
  },
  buttonsRow: {
    flexDirection: 'row',
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
});
