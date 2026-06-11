import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PaymentMethodsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>Saved Cards</Text>
        
        <View style={styles.cardItem}>
          <View style={styles.cardIconBox}>
            <Ionicons name="card" size={24} color="#0055FF" />
          </View>
          <View style={styles.cardDetails}>
            <Text style={styles.cardName}>Visa ending in 4242</Text>
            <Text style={styles.cardExpiry}>Expires 12/28</Text>
          </View>
          <Ionicons name="trash-outline" size={20} color="#D32F2F" />
        </View>

        <View style={styles.cardItem}>
          <View style={styles.cardIconBox}>
            <Ionicons name="card" size={24} color="#FF9900" />
          </View>
          <View style={styles.cardDetails}>
            <Text style={styles.cardName}>Mastercard ending in 1234</Text>
            <Text style={styles.cardExpiry}>Expires 08/25</Text>
          </View>
          <Ionicons name="trash-outline" size={20} color="#D32F2F" />
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={22} color="#0055FF" style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>Add New Card</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 24,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#8E8E93', marginBottom: 16, textTransform: 'uppercase' },
  cardItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12,
  },
  cardIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardDetails: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  cardExpiry: { fontSize: 13, color: '#8E8E93' },
  addButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF4FF', borderRadius: 16, paddingVertical: 18, marginTop: 12,
  },
  addButtonText: { color: '#0055FF', fontSize: 16, fontWeight: '700' },
});
