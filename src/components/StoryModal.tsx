import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Dimensions, Image, Animated, Easing, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import StoryDetailsModal from './StoryDetailsModal';

const { width, height } = Dimensions.get('window');

const getStoriesForDestination = (name?: string) => {
  if (name === 'Goa') {
    return [{ type: 'video', source: require('@/assets/images/goa-story.mp4'), duration: 8000 }];
  } else if (name === 'Mumbai') {
    return [
      { type: 'video', source: require('@/assets/images/mumbai-story-1.mp4'), duration: 8000 },
      { type: 'video', source: require('@/assets/images/mumbai-story-2.mp4'), duration: 8000 }
    ];
  } else if (name === 'Delhi') {
    return [{ type: 'video', source: require('@/assets/images/f5d6c0df2f0128b836ea215279189a6c.mp4'), duration: 8000 }];
  } else if (name === 'Bangalore') {
    return [
      { type: 'video', source: require('@/assets/images/2e370d85aba52869a3b80206e24e5708_720w.mp4'), duration: 8000 },
      { type: 'video', source: require('@/assets/images/4f13e5eb33c33f785b137bc50aab4cb6_720w.mp4'), duration: 8000 }
    ];
  } else if (name === 'Chennai') {
    return [{ type: 'video', source: require('@/assets/images/8251947f2a6d85d6b7bc5001235c91bc.mp4'), duration: 8000 }];
  }
  return [{ type: 'image', source: null, duration: 5000 }];
};

type StoryModalProps = {
  visible: boolean;
  onClose: () => void;
  destination: { name: string; image: string } | null;
  onNextDestination?: () => void;
};

export default function StoryModal({ visible, onClose, destination, onNextDestination }: StoryModalProps) {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  const onCloseRef = useRef(onClose);
  const [isDetailsVisible, setDetailsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const stories = getStoriesForDestination(destination?.name);
  const currentStory = stories[currentIndex] || stories[0];
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -40) {
          // Swiped up
          setDetailsVisible(true);
        } else if (gestureState.dy > 40) {
          // Swiped down
          onClose();
        }
      },
    })
  ).current;
  
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    setCurrentIndex(0);
    setDetailsVisible(false);
  }, [destination]);
  
  // Use a higher resolution image for full screen
  const fullScreenImage = destination?.image ? destination.image.replace('w=200', 'w=1200') : '';
  
  // Setup the video player
  const player = useVideoPlayer(currentStory.type === 'video' ? currentStory.source : null, player => {
    player.loop = true;
  });

  // Autoplay/pause and Progress Animation based on visibility
  useEffect(() => {
    let animationTimer: ReturnType<typeof setTimeout> | null = null;

    const startAnimation = (duration: number) => {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && !isDetailsVisible) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else if (onNextDestination) {
            onNextDestination();
          } else {
            onCloseRef.current();
          }
        }
      });
    };

    if (visible && !isDetailsVisible) {
      if (currentStory.type === 'video') {
        player.play();
        
        const checkDuration = () => {
          if (player.duration && player.duration > 0 && !isNaN(player.duration)) {
            startAnimation(player.duration * 1000);
          } else {
            animationTimer = setTimeout(checkDuration, 100);
          }
        };
        checkDuration();
      } else {
        startAnimation(currentStory.duration);
      }
    } else {
      player.pause();
      progress.stopAnimation();
      if (animationTimer) clearTimeout(animationTimer);
    }

    return () => {
      if (animationTimer) clearTimeout(animationTimer);
    };
  }, [visible, isDetailsVisible, currentStory, player, progress, currentIndex, stories.length, onNextDestination]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (!destination) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container} {...panResponder.panHandlers}>
        {currentStory.type === 'video' ? (
          <VideoView 
            style={{ width: '100%', height: '100%', position: 'absolute' }} 
            player={player} 
            nativeControls={false} 
            contentFit="cover"
          />
        ) : (
          <Image source={{ uri: fullScreenImage }} style={StyleSheet.absoluteFill} />
        )}
        
        {/* Tap areas overlay (placed behind the header/footer controls but in front of background video/image) */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <View style={{ flex: 1, flexDirection: 'row' }} pointerEvents="box-none">
            {/* Left Tap Area (Back) */}
            <TouchableOpacity 
              style={{ width: width / 3, height: '100%' }}
              activeOpacity={1}
              onPress={() => {
                if (currentIndex > 0) {
                  setCurrentIndex(prev => prev - 1);
                }
              }}
            />
            {/* Right Tap Area (Forward) */}
            <TouchableOpacity 
              style={{ flex: 1, height: '100%' }}
              activeOpacity={1}
              onPress={() => {
                if (currentIndex < stories.length - 1) {
                  setCurrentIndex(prev => prev + 1);
                } else if (onNextDestination) {
                  onNextDestination();
                } else {
                  onClose();
                }
              }}
            />
          </View>
        </View>
        
        {/* Top Dark Gradient for readability */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={[styles.topGradient, { height: Math.max(insets.top, 20) + 100 }]}
          pointerEvents="none"
        />
        
        <View style={[styles.safeAreaHeader, { paddingTop: Math.max(insets.top, 20) }]} pointerEvents="box-none">
          {/* Progress Bar */}
          <View style={styles.progressContainer} pointerEvents="none">
            {stories.map((s, idx) => (
              <View key={idx} style={styles.progressSegment}>
                {idx === currentIndex ? (
                  <Animated.View style={[styles.progressFill, { width: widthInterpolated }]} />
                ) : (
                  <View style={[styles.progressFill, { width: idx < currentIndex ? '100%' : '0%' }]} />
                )}
              </View>
            ))}
          </View>
          
          {/* Header row */}
          <View style={styles.headerContent} pointerEvents="box-none">
            <View style={styles.userInfo} pointerEvents="none">
              <View style={styles.profileRing}>
                <Image source={{ uri: fullScreenImage }} style={styles.profileImage} />
              </View>
              <Text style={styles.userName}>{destination.name}, India</Text>
              <Text style={styles.timeText}>12h</Text>
            </View>
            
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Dark Gradient for swipe text */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.bottomGradient}
          pointerEvents="box-none"
        >
          <TouchableOpacity style={styles.swipeUpContainer} onPress={() => setDetailsVisible(true)} activeOpacity={0.8}>
            <Ionicons name="chevron-up" size={28} color="#FFF" />
            <Text style={styles.swipeUpText}>SWIPE UP TO KNOW MORE</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <StoryDetailsModal 
        visible={isDetailsVisible}
        onClose={() => setDetailsVisible(false)}
        destination={destination}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  safeAreaHeader: {
    paddingHorizontal: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 6,
  },
  progressSegment: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginRight: 6,
  },
  timeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  closeButton: {
    padding: 4,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  swipeUpContainer: {
    alignItems: 'center',
  },
  swipeUpText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
