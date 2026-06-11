import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/Text';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type ShareTripModalProps = {
  visible: boolean;
  onClose: () => void;
  routeCodes: string[];
  dates: string;
  duration: string;
  link: string;
};

export default function ShareTripModal({ visible, onClose, routeCodes, dates, duration, link }: ShareTripModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(link);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2500);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Share Trip</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* Blue Tripway Pass Card */}
          <LinearGradient
            colors={['#0055FF', '#0040D0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.passCard}
          >
            <View style={styles.passHeaderRow}>
              <Text style={styles.passHeaderLeft}>TRIPWAY PASS ✈️</Text>
              <Text style={styles.passHeaderRight}>ACTIVE ROUTE</Text>
            </View>

            <View style={styles.routeRow}>
              {routeCodes.map((code, index) => (
                <React.Fragment key={index}>
                  <Text style={styles.routeCode}>{code}</Text>
                  {index < routeCodes.length - 1 && (
                    <Text style={styles.routeArrow}> ➔ </Text>
                  )}
                </React.Fragment>
              ))}
            </View>

            <View style={styles.passDivider} />

            <View style={styles.passFooterRow}>
              <View>
                <Text style={styles.passFooterLabel}>DATES</Text>
                <Text style={styles.passFooterValue}>{dates}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.passFooterLabel}>DURATION</Text>
                <Text style={styles.passFooterValue}>{duration}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Share Via */}
          <Text style={styles.sectionTitle}>SHARE VIA</Text>
          <View style={styles.shareViaGrid}>
            <TouchableOpacity style={styles.shareAppBtn}>
              <View style={[styles.appIconContainer, { backgroundColor: '#25D366' }]}>
                <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
              </View>
              <Text style={styles.appLabel}>WhatsApp</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareAppBtn}>
              <LinearGradient
                colors={['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={[styles.appIconContainer]}
              >
                <Ionicons name="logo-instagram" size={24} color="#FFF" />
              </LinearGradient>
              <Text style={styles.appLabel}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareAppBtn}>
              <View style={[styles.appIconContainer, { backgroundColor: '#0088cc' }]}>
                <Ionicons name="paper-plane" size={22} color="#FFF" style={{ marginLeft: -2, marginTop: 2 }} />
              </View>
              <Text style={styles.appLabel}>Telegram</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareAppBtn}>
              <View style={[styles.appIconContainer, { backgroundColor: '#000000' }]}>
                {/* Fallback to close icon styled roughly like X or just text X */}
                <Text style={{ color: '#FFF', fontSize: 22, fontWeight: '700' }}>𝕏</Text>
              </View>
              <Text style={styles.appLabel}>X / Twitter</Text>
            </TouchableOpacity>
          </View>

          {/* Copy Link */}
          <Text style={styles.sectionTitle}>OR COPY LINK</Text>
          <View style={styles.copyLinkContainer}>
            <Text style={styles.linkText} numberOfLines={1}>{link}</Text>
            <TouchableOpacity 
              style={[styles.copyBtn, isCopied && styles.copyBtnSuccess]} 
              onPress={handleCopy}
              activeOpacity={0.8}
            >
              <Text style={styles.copyBtnText}>{isCopied ? 'Copied!' : 'Copy'}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },
  passHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  passHeaderLeft: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.5,
  },
  passHeaderRight: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.5,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  routeCode: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  routeArrow: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    marginHorizontal: 8,
  },
  passDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  passFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passFooterLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  passFooterValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  shareViaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  shareAppBtn: {
    alignItems: 'center',
  },
  appIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  appLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  copyLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    borderRadius: 16,
    padding: 8,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: '#E6EFFF',
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0055FF',
    marginRight: 12,
  },
  copyBtn: {
    backgroundColor: '#0055FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  copyBtnSuccess: {
    backgroundColor: '#00D65B',
  },
  copyBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
