import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTripContext } from '@/context/TripContext';

const LANGUAGES = [
  { id: 'en-in', name: 'English (IN)' },
  { id: 'en-us', name: 'English (US)' },
  { id: 'fr', name: 'Français' },
  { id: 'es', name: 'Español' },
];

const CURRENCIES = [
  { id: 'inr', name: 'Indian Rupee (₹)' },
  { id: 'usd', name: 'US Dollar ($)' },
  { id: 'eur', name: 'Euro (€)' },
  { id: 'gbp', name: 'British Pound (£)' },
];

export default function LanguageCurrencyScreen() {
  const router = useRouter();
  const { userSettings, setUserSettings } = useTripContext();

  const handleSelectLanguage = (id: string) => {
    setUserSettings(prev => ({ ...prev, language: id }));
  };

  const handleSelectCurrency = (id: string) => {
    setUserSettings(prev => ({ ...prev, currency: id }));
  };

  const renderOption = (item: { id: string; name: string }, selectedId: string, onSelect: (id: string) => void) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity 
        key={item.id} 
        style={styles.optionRow} 
        onPress={() => onSelect(item.id)}
        activeOpacity={0.7}
      >
        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
          {item.name}
        </Text>
        {isSelected && <Ionicons name="checkmark-circle" size={24} color="#0055FF" />}
        {!isSelected && <View style={styles.emptyCircle} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language & Currency</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>Select Language</Text>
        <View style={styles.card}>
          {LANGUAGES.map((lang, index) => (
            <React.Fragment key={lang.id}>
              {renderOption(lang, userSettings.language, handleSelectLanguage)}
              {index < LANGUAGES.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Select Currency</Text>
        <View style={styles.card}>
          {CURRENCIES.map((curr, index) => (
            <React.Fragment key={curr.id}>
              {renderOption(curr, userSettings.currency, handleSelectCurrency)}
              {index < CURRENCIES.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, marginBottom: 24,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#8E8E93', marginBottom: 12, marginTop: 24, textTransform: 'uppercase', marginLeft: 4 },
  card: {
    backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingVertical: 18,
  },
  optionText: {
    fontSize: 16, fontWeight: '500', color: '#1A1A1A',
  },
  optionTextSelected: {
    fontWeight: '700', color: '#0055FF',
  },
  emptyCircle: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#EAEAEA',
  },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 16 },
});
