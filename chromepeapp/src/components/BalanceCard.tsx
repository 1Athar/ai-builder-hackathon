import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Props {
  balance: number;
  bankName: string;
  accountMasked: string;
}

export default function BalanceCard({balance, bankName, accountMasked}: Props) {
  const formatted = `₹${balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Wallet Balance</Text>
      <Text style={styles.amount}>{formatted}</Text>
      <Text style={styles.bank}>
        {bankName} {accountMasked}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  label: {color: '#fff', fontSize: 12, opacity: 0.8},
  amount: {color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 4},
  bank: {color: '#fff', fontSize: 11, opacity: 0.7, marginTop: 4},
});
