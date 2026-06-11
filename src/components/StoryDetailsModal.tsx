import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Dimensions, Image, ScrollView, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

type StoryDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  destination: { name: string; image: string } | null;
};

export default function StoryDetailsModal({ visible, onClose, destination }: StoryDetailsModalProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          onClose();
        }
      },
    })
  ).current;

  if (!destination) return null;

  const handleStartPlanning = () => {
    onClose();
    // Assuming the destination name matches an id loosely, or just route to build-route
    router.push('/build-route');
  };

  const DESTINATION_INFO: Record<string, any> = {
    'Goa': {
      subtitle: '4.8 · Beaches & Nightlife',
      weather: '⛅ 28°C',
      flight: '✈️ 2h 10m',
      price: '💰 $$',
      description: 'Goa is India\'s pocket-sized paradise, famous for its stellar beaches, world-class nightlife, and Portuguese heritage. Enjoy the tropical vibe, stunning seafood, and laid-back culture.',
      tags: ['🏖️ Beaches', '🎉 Nightlife', '🍤 Food', '⛪ Heritage'],
      highlights: [
        { name: 'Baga Beach', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dudhsagar', image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=400&q=80' }
      ]
    },
    'Mumbai': {
      subtitle: '4.9 · City of Dreams',
      weather: '🌤️ 30°C',
      flight: '✈️ 1h 45m',
      price: '💰 $$$',
      description: 'Mumbai is a vibrant, fast-paced metropolis. From the historic Gateway of India and Marine Drive to the bustling street food scene, it seamlessly blends colonial history with modern Indian culture.',
      tags: ['🌆 Cityscape', '🎬 Bollywood', '🍲 Street Food', '🌊 Coastline'],
      highlights: [
        { name: 'Marine Drive', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80' },
        { name: 'Gateway of India', image: 'https://images.unsplash.com/photo-1567159663784-38d011f038be?auto=format&fit=crop&w=400&q=80' }
      ]
    },
    'Delhi': {
      subtitle: '4.7 · Historic Capital',
      weather: '☀️ 32°C',
      flight: '✈️ 2h 30m',
      price: '💰 $$',
      description: 'Delhi is a city of layers, where ancient monuments stand alongside modern cafes. Explore the Red Fort, wander through Chandni Chowk, and experience incredible Mughal-era architecture.',
      tags: ['🏛️ History', '🥘 Cuisine', '🛍️ Shopping', '🕌 Culture'],
      highlights: [
        { name: 'Red Fort', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80' },
        { name: 'India Gate', image: 'https://images.unsplash.com/photo-1585084335487-f659d081b28e?auto=format&fit=crop&w=400&q=80' }
      ]
    },
    'Bangalore': {
      subtitle: '4.8 · The Garden City',
      weather: '🌦️ 24°C',
      flight: '✈️ 1h 15m',
      price: '💰 $$',
      description: 'Known as the Silicon Valley of India, Bangalore is celebrated for its lush parks, excellent year-round weather, and a thriving craft brewery culture amid historic colonial buildings.',
      tags: ['🌳 Parks', '🍺 Breweries', '💻 Tech Hub', '🏰 Palaces'],
      highlights: [
        { name: 'Cubbon Park', image: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=400&q=80' },
        { name: 'Bangalore Palace', image: 'https://images.unsplash.com/photo-1593693397690-362bb9a1153a?auto=format&fit=crop&w=400&q=80' }
      ]
    },
    'Chennai': {
      subtitle: '4.6 · Cultural Hub',
      weather: '☀️ 34°C',
      flight: '✈️ 1h 00m',
      price: '💰 $$',
      description: 'Chennai is the keeper of South Indian artistic and religious traditions. It boasts long sandy beaches, magnificent Hindu temples, and a deep-rooted love for classical music and dance.',
      tags: ['🏖️ Marina', '🛕 Temples', '🎼 Arts', '☕ Filter Coffee'],
      highlights: [
        { name: 'Marina Beach', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80' },
        { name: 'Kapaleeshwarar', image: 'https://images.unsplash.com/photo-1603525281861-1c5210c80081?auto=format&fit=crop&w=400&q=80' }
      ]
    }
  };

  const defaultInfo = {
    subtitle: '4.5 · Popular Destination',
    weather: '⛅ 25°C',
    flight: '✈️ 2h 00m',
    price: '💰 $$',
    description: 'A beautiful destination with stunning landscapes, rich culture, and amazing local food. Perfect for your next getaway.',
    tags: ['🌸 Nature', '🍣 Food', '🎎 Culture', '🏛️ Sights'],
    highlights: [
      { name: 'City Center', image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=400&q=80' },
      { name: 'Local Park', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80' }
    ]
  };

  const info = DESTINATION_INFO[destination.name] || defaultInfo;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <View style={[styles.sheetContent, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
            <View style={styles.dragHandle} />
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>{destination.name}, India</Text>
            
            <View style={styles.subtitleRow}>
              <Ionicons name="star" size={14} color="#FF9500" />
              <Text style={styles.subtitleText}> {info.subtitle}</Text>
            </View>
            
            <View style={styles.pillRow}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{info.weather}</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{info.flight}</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{info.price}</Text>
              </View>
            </View>
            
            <Text style={styles.description}>
              {info.description}
            </Text>
            
            <View style={styles.tagRow}>
              {info.tags.map((tag: string, i: number) => (
                <View key={i} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
              ))}
            </View>
            
            <Text style={styles.sectionTitle}>Top Highlights</Text>
            <View style={styles.highlightsRow}>
              {info.highlights.map((hl: any, i: number) => (
                <View key={i} style={styles.highlightCard}>
                  <Image source={{ uri: hl.image }} style={styles.highlightImage} />
                  <View style={styles.highlightOverlay}>
                    <Text style={styles.highlightText}>{hl.name}</Text>
                  </View>
                </View>
              ))}
            </View>
            
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.mapContainer}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80' }} style={styles.mapImage} />
            </View>
            
            {/* Extra padding so we can scroll past the floating button */}
            <View style={{ height: 80 }} />
          </ScrollView>

          {/* Floating Action Button */}
          <View style={[styles.floatingBtnContainer, { bottom: Math.max(insets.bottom, 20) }]}>
            <TouchableOpacity style={styles.startPlanningBtn} onPress={handleStartPlanning}>
              <Text style={styles.startPlanningText}>Start Planning Trip</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: height * 0.85,
    overflow: 'hidden',
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0055FF',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  pill: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  description: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#4A4A4A',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  highlightsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  highlightCard: {
    flex: 1,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
  },
  highlightImage: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  highlightOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingTop: 30, // gradient effect room
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  highlightText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  mapContainer: {
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  mapImage: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  floatingBtnContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    zIndex: 10,
  },
  startPlanningBtn: {
    backgroundColor: '#0055FF',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  startPlanningText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
