import React from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';

const { width, height } = Dimensions.get('window');

const highlights = [
  { id: '1', name: 'Beaches', icon: 'umbrella-outline' as const },
  { id: '2', name: 'Nightlife', icon: 'wine-outline' as const },
  { id: '3', name: 'Heritage', icon: 'library-outline' as const },
  { id: '4', name: 'Food', icon: 'restaurant-outline' as const },
  { id: '5', name: 'Adventure', icon: 'compass-outline' as const },
];

const destinationPhotos: Array<{ type: string; uri?: string; color?: string; emoji?: string }> = [
  { type: 'image', uri: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80' },
  { type: 'image', uri: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80' },
  { type: 'image', uri: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=400&q=80' },
  { type: 'image', uri: 'https://images.unsplash.com/photo-1504280540660-8f96e57582b7?auto=format&fit=crop&w=400&q=80' },
];

export default function DestinationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' }, href: null }} />
      
      {/* Fixed Background Image */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80' }} 
        style={styles.fixedHeroImage} 
      />

      {/* Fixed Header Actions */}
      <View style={[styles.headerActions, { top: insets.top + 10, zIndex: 10 }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerRightActions}>
          <TouchableOpacity style={[styles.iconButton, { marginRight: 12 }]}>
            <Ionicons name="share-social-outline" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={[StyleSheet.absoluteFill, { top: insets.top + 60 }]}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]}
      >
        
        {/* Transparent Spacer to push the card down to its initial position */}
        <View style={{ height: Math.max(0, 350 - (insets.top + 60)) }} />

        {/* Sticky Header: Forms the top of the "bottom sheet" */}
        <View style={styles.sheetHeader}>
          <View style={styles.dragHandle} />
        </View>

        {/* Content Card */}
        <View style={styles.sheetContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Goa, India</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingScore}>4.96</Text>
              <Text style={styles.ratingCount}>(1,240)</Text>
            </View>
          </View>
          
          <Text style={styles.subtitle}>South Goa · Beach · Nightlife</Text>

          <Text style={styles.description}>
            Goa is India's smallest state by area and the fourth-smallest by population. Famous for its pristine beaches, vibrant nightlife, and Portuguese heritage architecture.
          </Text>

          {/* Highlights */}
          <Text style={styles.sectionTitle}>Highlights</Text>
          <View style={styles.highlightsGrid}>
            {highlights.map(h => (
              <View key={h.id} style={styles.highlightPill}>
                <Ionicons name={h.icon} size={14} color="#555" style={{ marginRight: 6 }} />
                <Text style={styles.highlightText}>{h.name}</Text>
              </View>
            ))}
          </View>

          {/* Photos */}
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={styles.photosGrid}>
            {destinationPhotos.map((item, i) => {
              if (item.type === 'image') {
                return (
                  <Image key={i} source={{ uri: item.uri }} style={styles.photoGridItem} />
                );
              }
              return (
                <View key={i} style={[styles.photoGridItem, { backgroundColor: item.color, justifyContent: 'center', alignItems: 'center' }]}>
                  <View style={styles.emojiWrapper}>
                    <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>

      {/* Bottom Sticky Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceAmount}>₹2,850</Text>
            <Text style={styles.priceSuffix}> /person</Text>
          </View>
          <Text style={styles.priceSub}>3 days trip</Text>
        </View>
        <TouchableOpacity style={styles.planButton}>
          <Text style={styles.planButtonText}>Plan trip to Goa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  fixedHeroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 400,
  },
  headerActions: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerRightActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetHeader: {
    height: 32,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    paddingTop: 12,
    zIndex: 1,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
  },
  sheetContent: {
    backgroundColor: '#FFF',
    minHeight: height,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingScore: {
    fontWeight: '700',
    fontSize: 13,
    color: '#1A1A1A',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4A4A4A',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  highlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  highlightText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoGridItem: {
    width: (width - 48 - 12) / 2,
    height: 130,
    borderRadius: 16,
    marginBottom: 12,
  },
  emojiWrapper: {
    padding: 2,
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 24,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    justifyContent: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  priceSuffix: {
    fontSize: 15,
    color: '#8E8E93',
  },
  priceSub: {
    fontSize: 14,
    color: '#8E8E93',
  },
  planButton: {
    backgroundColor: '#0055FF',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 16,
  },
  planButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
