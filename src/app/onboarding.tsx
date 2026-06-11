import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { useTripContext } from '@/context/TripContext';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: 0,
    title: "Itineraries, Explained\nSimply.",
    description: "We translate complex travel plans into clear, daily timelines—so you understand why a route works, not just if it does.",
    buttonText: "Continue",
  },
  {
    id: 1,
    title: "Travel, With Deeper\nClarity.",
    description: "Go beyond templates. Explore how destination, budget, and route compatibility create real journeys.",
    buttonText: "Continue",
  },
  {
    id: 2,
    title: "Sharing, Made\nCollaborative.",
    description: "Invite friends, vote on options, and sync your details in real-time. Travel together, with complete synchronization.",
    buttonText: "Get Started",
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setHasSeenOnboarding } = useTripContext();
  const [step, setStep] = useState(0);

  const slide = SLIDES[step];

  const handleNext = () => {
    if (step === 2) {
      setHasSeenOnboarding(true);
      router.replace('/login');
    } else {
      setStep(step + 1);
    }
  };

  const renderGraphic = () => {
    if (step === 0) {
      return (
        <View style={styles.graphicContainer}>
          <View style={[styles.cardBase, styles.cardBg1]}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1477959858617-6c9224f4e1b8?auto=format&fit=crop&w=400&q=80' }} style={StyleSheet.absoluteFill} />
            <View style={styles.cardGradient} />
            <View style={styles.cardFrontContent}>
               <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
                  <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: '#20C968', borderWidth: 2, borderColor: '#FFF'}} />
               </View>
               <Text style={[styles.cardTitle, {opacity: 0.5}]}>Bali</Text>
               <Text style={[styles.cardSubtitle, {opacity: 0.5}]}>Gateway</Text>
            </View>
          </View>
          <View style={[styles.cardBase, styles.cardBg2]}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80' }} style={StyleSheet.absoluteFill} />
            <View style={styles.cardGradient} />
            <View style={styles.cardFrontContent}>
               <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
                  <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: '#0055FF', borderWidth: 2, borderColor: '#FFF'}} />
               </View>
               <Text style={[styles.cardTitle, {opacity: 0.8}]}>Goa</Text>
               <Text style={[styles.cardSubtitle, {opacity: 0.8}]}>Tropical</Text>
            </View>
          </View>
          <View style={[styles.cardBase, styles.cardFront]}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80' }} 
              style={StyleSheet.absoluteFill} 
            />
            <View style={styles.cardGradient} />
            <View style={styles.cardFrontContent}>
              <View style={styles.cardMatchPill}>
                <Ionicons name="triangle" size={8} color="#FFF" />
                <Text style={styles.cardMatchText}>88% MATCH</Text>
              </View>
              <Text style={styles.cardTitle}>Manali, India</Text>
              <Text style={styles.cardSubtitle}>Alpine Escape</Text>
            </View>
            <View style={styles.cardLikeBtn}>
              <Ionicons name="heart" size={20} color="#FFF" />
            </View>
          </View>
          <View style={styles.fireEmoji}><Text style={{fontSize: 26}}>🔥</Text></View>
          <View style={styles.thumbEmoji}><Text style={{fontSize: 26}}>👍</Text></View>
          <View style={styles.cameraEmoji}><Text style={{fontSize: 26}}>📸</Text></View>
        </View>
      );
    }
    if (step === 1) {
      return (
        <View style={styles.graphicContainer}>
          {/* Decorative Shapes */}
          <Ionicons name="star" size={32} color="#8DA9FF" style={{ position: 'absolute', top: -10, left: 140, zIndex: 0 }} />
          <Ionicons name="flower" size={48} color="#D0E8FF" style={{ position: 'absolute', left: -20, top: 120, zIndex: 0 }} />
          <View style={{ position: 'absolute', left: 0, top: 139, width: 10, height: 10, borderRadius: 5, backgroundColor: '#0055FF', zIndex: 1 }} />
          <Ionicons name="triangle" size={24} color="#5CE5C9" style={{ position: 'absolute', right: 90, top: 140, transform: [{ rotate: '15deg' }], zIndex: 0 }} />

          <View style={[styles.circleBase, styles.circle1]}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80' }} style={styles.circleImage} />
          </View>
          <View style={[styles.circleBase, styles.circle2]}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=400&q=80' }} style={styles.circleImage} />
          </View>
          <View style={[styles.circleBase, styles.circle3]}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1506869640319-ce1a44a1fa33?auto=format&fit=crop&w=400&q=80' }} style={styles.circleImage} />
          </View>
          <View style={[styles.circleBase, styles.circle4]}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=400&q=80' }} style={styles.circleImage} />
          </View>
        </View>
      );
    }
    if (step === 2) {
      const CardContent = () => (
        <View style={styles.cardFrontContent}>
          <View style={styles.joinedPill}>
            <Ionicons name="people" size={12} color="#FFF" />
            <Text style={styles.joinedText}>3 JOINED</Text>
          </View>
          <Text style={styles.carouselTitle}>Coorg Trip</Text>
          <Text style={styles.carouselSubtitle}>With Jia & Jia</Text>
        </View>
      );

      return (
        <View style={styles.graphicContainer}>
          <View style={[styles.carouselCard, styles.carouselCardLeft]}>
             <Image source={{ uri: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=400&q=80' }} style={StyleSheet.absoluteFill} />
             <View style={styles.cardGradient} />
             <CardContent />
          </View>
          <View style={[styles.carouselCard, styles.carouselCardRight]}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=400&q=80' }} style={StyleSheet.absoluteFill} />
            <View style={styles.cardGradient} />
            <CardContent />
          </View>
          <View style={[styles.carouselCard, styles.carouselCardCenter]}>
             <Image source={{ uri: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=400&q=80' }} style={StyleSheet.absoluteFill} />
            <View style={styles.cardGradient} />
            <CardContent />
          </View>

          {/* Fade Overlays to blend side cards into background */}
          <LinearGradient
            colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ position: 'absolute', top: 0, bottom: 0, left: -150, width: 210, zIndex: 1 }}
            pointerEvents="none"
          />
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ position: 'absolute', top: 0, bottom: 0, right: -150, width: 210, zIndex: 1 }}
            pointerEvents="none"
          />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Screen options={{ href: null, tabBarStyle: { display: 'none' } }} />
      
      {/* Graphic Area */}
      <View style={styles.topSection}>
        {renderGraphic()}
      </View>

      {/* Text & Controls Area */}
      <View style={styles.bottomSection}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {SLIDES.map((s, i) => (
            <View key={s.id} style={[styles.dot, step === i && styles.dotActive]} />
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{slide.buttonText}</Text>
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
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    minHeight: height * 0.5,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#5A5A5A',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EAEAEA',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 16,
    backgroundColor: '#0055FF',
  },
  button: {
    backgroundColor: '#0055FF',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Step 0 Styles
  graphicContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardBase: {
    position: 'absolute',
    width: 180,
    height: 240,
    borderRadius: 20,
  },
  cardBg1: {
    transform: [{ rotate: '-12deg' }, { translateX: -30 }, { translateY: -10 }],
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardBg2: {
    transform: [{ rotate: '-6deg' }, { translateX: -15 }, { translateY: -5 }],
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardFront: {
    transform: [{ rotate: '4deg' }, { translateX: 20 }, { translateY: 10 }],
    justifyContent: 'flex-end',
    padding: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardGradientLight: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  cardFrontContent: {
    zIndex: 2,
  },
  cardMatchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardMatchText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
    marginLeft: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
  },
  cardTitleBg: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    opacity: 0.5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  cardLikeBtn: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
    zIndex: 10,
  },
  fireEmoji: { position: 'absolute', top: -30, left: 20, backgroundColor: '#FFF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  thumbEmoji: { position: 'absolute', bottom: 40, left: -30, backgroundColor: '#FFF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  cameraEmoji: { position: 'absolute', top: 100, right: -25, backgroundColor: '#FFF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  
  // Step 1 Styles
  circleBase: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#FFF',
    overflow: 'hidden',
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  circle1: {
    width: 170,
    height: 170,
    top: 0,
    right: 0,
    zIndex: 1,
  },
  circle2: {
    width: 140,
    height: 140,
    top: 60,
    left: -10,
    zIndex: 2,
  },
  circle3: {
    width: 160,
    height: 160,
    bottom: -10,
    left: 20,
    zIndex: 3,
  },
  circle4: {
    width: 110,
    height: 110,
    bottom: 20,
    right: 0,
    zIndex: 4,
  },

  // Step 2 Styles
  carouselCard: {
    position: 'absolute',
    height: 220,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  carouselCardCenter: {
    width: 180,
    height: 240,
    backgroundColor: '#4A5568',
    justifyContent: 'flex-end',
    padding: 16,
    zIndex: 2,
  },
  carouselCardLeft: {
    width: 140,
    height: 200,
    left: -100,
    opacity: 0.35,
    justifyContent: 'flex-end',
    padding: 12,
  },
  carouselCardRight: {
    width: 140,
    height: 200,
    right: -100,
    opacity: 0.35,
    justifyContent: 'flex-end',
    padding: 12,
  },
  joinedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D65B',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  joinedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
    marginLeft: 6,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  carouselSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
});
