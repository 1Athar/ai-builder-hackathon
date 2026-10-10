import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ContactAvatar from '../components/ContactAvatar';
import SuccessOverlay from '../components/SuccessOverlay';
import {contacts} from '../data/mockData';
import colors from '../theme/colors';

export default function ScanPayScreen() {
  const [upiId, setUpiId] = useState('');
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <SuccessOverlay
        title="Payment Successful!"
        subtitle={`Payment to ${upiId} completed.`}
        onDone={() => setSuccess(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan & Pay</Text>
        <Text style={styles.subtitle}>Point at any QR code</Text>
      </View>
      <View style={styles.scannerBox}>
        <View style={styles.corner} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
        <Text style={styles.cameraText}>Camera Preview</Text>
        <Text style={styles.cameraHint}>(QR scanning — coming soon)</Text>
      </View>
      <View style={styles.manualSection}>
        <Text style={styles.orText}>— or enter manually —</Text>
        <TextInput
          style={styles.input}
          placeholder="name@upi"
          value={upiId}
          onChangeText={setUpiId}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.payBtn, !upiId.includes('@') ? styles.payBtnDisabled : null]}
          onPress={() => {
            if (upiId.includes('@')) {
              setSuccess(true);
            }
          }}
          disabled={!upiId.includes('@')}>
          <Text style={styles.payBtnText}>Pay</Text>
        </TouchableOpacity>
        <Text style={styles.contactsLabel}>RECENT</Text>
        <View style={styles.contactsRow}>
          {contacts.map(c => (
            <TouchableOpacity key={c.id} onPress={() => setUpiId(c.upiId)} style={styles.contact}>
              <ContactAvatar name={c.name} color={c.color} />
              <Text style={styles.contactName}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#000'},
  header: {backgroundColor: colors.primary, padding: 16, alignItems: 'center'},
  title: {color: '#fff', fontSize: 16, fontWeight: '700'},
  subtitle: {color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2},
  scannerBox: {
    margin: 24,
    height: 240,
    backgroundColor: '#111',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 28,
    height: 28,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
    borderRadius: 4,
  },
  cornerTR: {left: undefined, right: 12, borderLeftWidth: 0, borderRightWidth: 3},
  cornerBL: {top: undefined, bottom: 12, borderTopWidth: 0, borderBottomWidth: 3},
  cornerBR: {
    top: undefined,
    bottom: 12,
    left: undefined,
    right: 12,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  cameraText: {color: '#fff', fontSize: 14, opacity: 0.6},
  cameraHint: {color: '#fff', fontSize: 11, opacity: 0.4, marginTop: 4},
  manualSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  orText: {textAlign: 'center', color: colors.textSecondary, fontSize: 12, marginBottom: 14},
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  payBtn: {backgroundColor: colors.primary, borderRadius: 12, padding: 14, alignItems: 'center'},
  payBtnDisabled: {opacity: 0.4},
  payBtnText: {color: '#fff', fontSize: 15, fontWeight: '700'},
  contactsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 10,
  },
  contactsRow: {flexDirection: 'row', gap: 16},
  contact: {alignItems: 'center', gap: 4},
  contactName: {fontSize: 11, color: colors.textSecondary},
});
