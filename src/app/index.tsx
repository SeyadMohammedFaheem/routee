import React from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@/components/Text';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter, Redirect } from 'expo-router';
import { useTripContext } from '@/context/TripContext';
import StoryModal from '@/components/StoryModal';

const { width } = Dimensions.get('window');

const destinations = [
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=200&q=80' },
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=200&q=80' },
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=200&q=80' },
  { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=200&q=80' },
  { name: 'Chennai', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=200&q=80' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { hasSeenOnboarding, notifications, profileImageUri, userProfile } = useTripContext();
  const [activeStory, setActiveStory] = React.useState<{ name: string; image: string } | null>(null);
  const [seenStories, setSeenStories] = React.useState<string[]>([]);

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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image 
              source={{ uri: profileImageUri }} 
              style={styles.profilePic} 
            />
            <View>
              <Text style={styles.greeting}>Good morning 👋</Text>
              <Text style={styles.userName}>{userProfile.name}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={22} color="#1A1A1A" />
            {notifications.length > 0 && <View style={styles.notificationDot} />}
          </TouchableOpacity>
        </View>

        {/* Combined Search and Promo Card */}
        <View style={styles.combinedCard}>
          <View style={styles.searchSection}>
            <Text style={styles.searchTitle}>Where to?</Text>
            <Text style={styles.searchSubtitle}>Anywhere • Any week • Add guests</Text>
          </View>

          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/build-route')}>
            <LinearGradient 
              colors={['#007BFF', '#0022AA']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }} 
              style={styles.promoBanner}
            >
              <View style={styles.promoContent}>
                <View style={styles.promoIconContainer}>
                  <Ionicons name="options-outline" size={20} color="#007BFF" />
                </View>
                <Text style={styles.promoText}>Plan multi-city — add{'\n'}cities + nights</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F9',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  greeting: {
    fontSize: 14,
    color: '#8E8E93',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
  },
  combinedCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden', // Ensures the inner elements clip to the rounded corners
  },
  searchSection: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  searchTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  searchSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  promoBanner: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  promoText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
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
