import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ContactAvatar from '../components/ContactAvatar';
import SuccessOverlay from '../components/SuccessOverlay';
import {contacts} from '../data/mockData';
import type {HomeStackParams} from '../navigation/AppNavigator';
import colors from '../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParams, 'SendMoney'>;
};

export default function SendMoneyScreen({navigation}: Props) {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const isValid = upiId.includes('@') && Number(amount) > 0;

  if (success) {
    return (
      <SuccessOverlay
        title="Payment Successful!"
        subtitle={`₹${amount} sent to ${upiId}`}
        onDone={() => navigation.popToTop()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <View style={styles.container}>
          <Text style={styles.label}>RECENT CONTACTS</Text>
          <View style={styles.contactsRow}>
            {contacts.map(c => (
              <TouchableOpacity key={c.id} style={styles.contact} onPress={() => setUpiId(c.upiId)}>
                <ContactAvatar name={c.name} color={c.color} />
                <Text style={styles.contactName}>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>UPI ID OR PHONE</Text>
          <TextInput
            style={[
              styles.input,
              upiId.length > 0 && !upiId.includes('@') ? styles.inputError : null,
            ]}
            placeholder="name@upi or 9876543210"
            value={upiId}
            onChangeText={setUpiId}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {upiId.length > 0 && !upiId.includes('@') ? (
            <Text style={styles.errorText}>Enter a valid UPI ID (e.g. name@upi)</Text>
          ) : null}

          <Text style={[styles.label, styles.amountLabel]}>AMOUNT (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[styles.payButton, !isValid ? styles.payButtonDisabled : null]}
            onPress={() => {
              if (isValid) {
                setSuccess(true);
              }
            }}
            disabled={!isValid}>
            <Text style={styles.payButtonText}>Pay ₹{amount || '0'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#fff'},
  flex: {flex: 1},
  container: {flex: 1, padding: 20},
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  amountLabel: {marginTop: 20},
  contactsRow: {flexDirection: 'row', gap: 16, marginBottom: 24},
  contact: {alignItems: 'center', gap: 4},
  contactName: {fontSize: 11, color: colors.textSecondary},
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  inputError: {borderColor: colors.error},
  errorText: {color: colors.error, fontSize: 12, marginBottom: 8},
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  payButtonDisabled: {opacity: 0.4},
  payButtonText: {color: '#fff', fontSize: 16, fontWeight: '700'},
});
