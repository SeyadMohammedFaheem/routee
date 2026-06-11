import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, LayoutAnimation, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

type FAQCategory = {
  categoryName: string;
  icon: string;
  items: FAQItem[];
};

const FAQ_DATA: FAQCategory[] = [
  {
    categoryName: 'Bookings & Refunds',
    icon: 'card-outline',
    items: [
      {
        id: 'br-1',
        question: 'How do I cancel my booking?',
        answer: 'You can request a cancellation by going to the Details screen of your trip under the "My Trips" tab. Refund eligibility is governed by the specific airline rules and the time of cancellation.'
      },
      {
        id: 'br-2',
        question: 'Can I reschedule my flights?',
        answer: 'Yes! Navigate to your booked trip, select the flight leg you wish to change, and tap "Reschedule flight". Rescheduling fees are determined by the airline, plus any fare differences.'
      },
      {
        id: 'br-3',
        question: 'Where is my invoice/receipt?',
        answer: 'A copy of your booking receipt and tax invoice is automatically emailed to your registered email address right after purchase. You can also view it inside your flight details.'
      }
    ]
  },
  {
    categoryName: 'Flights & Baggage',
    icon: 'airplane-outline',
    items: [
      {
        id: 'fl-1',
        question: 'How do I check in online?',
        answer: 'Web check-in usually opens 24-48 hours before your flight departure. Head directly to the airline website or mobile app and enter the Booking Reference (PNR) listed on your e-ticket.'
      },
      {
        id: 'fl-2',
        question: 'What is my baggage allowance?',
        answer: 'Baggage allowances depend on your ticket class and the specific airline. You can check the exact baggage limits for each leg of your trip in the ticket detail sheets under "My Trips".'
      }
    ]
  },
  {
    categoryName: 'Itinerary Planner',
    icon: 'calendar-outline',
    items: [
      {
        id: 'pl-1',
        question: 'How do I add custom activities to my day?',
        answer: 'Navigate to the "Planner" tab, select your confirmed trip, and tap the search bar at the top of the schedule. Type the place name, select the timing, and tap "Add to Timeline".'
      },
      {
        id: 'pl-2',
        question: 'Why does it say Time Conflict?',
        answer: 'Routee checks for scheduling overlaps to ensure you do not double-book yourself. If an activity intersects with another scheduled item on the timeline, you will be blocked and asked to select a different timing.'
      }
    ]
  }
];

export default function HelpCenterScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleContact = (type: 'chat' | 'email' | 'phone') => {
    if (type === 'phone') {
      Linking.openURL('tel:+18005550199');
    } else if (type === 'email') {
      Linking.openURL('mailto:support@routeeapp.example.com?subject=Support Request');
    } else {
      Linking.openURL('https://routeeapp.example.com/chat');
    }
  };

  // Filter FAQs based on search
  const filteredData = FAQ_DATA.map(category => {
    const matchedItems = category.items.filter(
      item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...category, items: matchedItems };
  }).filter(category => category.items.length > 0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Intro */}
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>How can we help?</Text>
          <Text style={styles.introSub}>Search FAQ topics or get in touch with our customer care team.</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBarContainer}>
            <Ionicons name="search-outline" size={18} color="#8E8E93" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search help articles..."
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>
        </View>

        {/* FAQ list */}
        {filteredData.length > 0 ? (
          filteredData.map(category => (
            <View key={category.categoryName} style={styles.categoryBlock}>
              <View style={styles.categoryHeader}>
                <Ionicons name={category.icon as any} size={18} color="#8E8E93" style={{ marginRight: 8 }} />
                <Text style={styles.categoryTitle}>{category.categoryName}</Text>
              </View>

              <View style={styles.faqCard}>
                {category.items.map((item, idx) => {
                  const isExpanded = expandedId === item.id;
                  const isLast = idx === category.items.length - 1;
                  return (
                    <View key={item.id}>
                      <TouchableOpacity 
                        style={styles.faqRow}
                        onPress={() => toggleExpand(item.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.questionText, isExpanded && styles.questionTextExpanded]}>
                          {item.question}
                        </Text>
                        <Ionicons 
                          name={isExpanded ? "chevron-up" : "chevron-down"} 
                          size={18} 
                          color={isExpanded ? "#0055FF" : "#C7C7CC"} 
                        />
                      </TouchableOpacity>
                      
                      {isExpanded && (
                        <View style={styles.answerContainer}>
                          <Text style={styles.answerText}>{item.answer}</Text>
                        </View>
                      )}
                      
                      {!isLast && <View style={styles.divider} />}
                    </View>
                  );
                })}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={48} color="#C7C7CC" />
            <Text style={styles.noResultsText}>No results match "{searchQuery}"</Text>
          </View>
        )}

        {/* Contact Support Section */}
        <Text style={styles.contactTitle}>Still need help?</Text>
        <View style={styles.supportCardsRow}>
          <TouchableOpacity style={styles.supportCard} onPress={() => handleContact('chat')} activeOpacity={0.8}>
            <View style={styles.supportIconBg}>
              <Ionicons name="chatbubbles-outline" size={24} color="#0055FF" />
            </View>
            <Text style={styles.supportCardLabel}>Live Chat</Text>
            <Text style={styles.supportCardSub}>Response in 2 min</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportCard} onPress={() => handleContact('email')} activeOpacity={0.8}>
            <View style={styles.supportIconBg}>
              <Ionicons name="mail-outline" size={24} color="#0055FF" />
            </View>
            <Text style={styles.supportCardLabel}>Email Support</Text>
            <Text style={styles.supportCardSub}>Response in 24 hr</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportCard} onPress={() => handleContact('phone')} activeOpacity={0.8}>
            <View style={styles.supportIconBg}>
              <Ionicons name="call-outline" size={24} color="#0055FF" />
            </View>
            <Text style={styles.supportCardLabel}>Call Us</Text>
            <Text style={styles.supportCardSub}>Toll-free 24/7</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  introContainer: {
    marginTop: 12,
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  introSub: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    fontWeight: '500',
  },
  searchSection: {
    marginBottom: 24,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  categoryBlock: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 4,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  faqCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  questionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 16,
  },
  questionTextExpanded: {
    color: '#0055FF',
  },
  answerContainer: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    marginTop: -4,
  },
  answerText: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 21,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 18,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 24,
  },
  noResultsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 12,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
    marginLeft: 4,
    marginTop: 8,
  },
  supportCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  supportCard: {
    width: '31.5%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  supportIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportCardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'center',
  },
  supportCardSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
  },
});
