import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ContactAvatar from './ContactAvatar';
import colors from '../theme/colors';

interface Props {
  name: string;
  amount: number;
  type: 'sent' | 'received' | 'recharge' | 'bill';
  date: string;
  note?: string;
}

export default function TransactionItem({name, amount, type, date, note}: Props) {
  const isCredited = type === 'received';
  const amountText = isCredited
    ? `+₹${amount.toLocaleString('en-IN')}`
    : `-₹${amount.toLocaleString('en-IN')}`;
  const amountColor = isCredited ? colors.success : colors.error;

  return (
    <View style={styles.row}>
      <ContactAvatar name={name} size={40} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.date}>{note ?? date}</Text>
      </View>
      <Text style={[styles.amount, {color: amountColor}]}>{amountText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  info: {flex: 1, marginLeft: 10},
  name: {fontSize: 14, fontWeight: '500', color: colors.textPrimary},
  date: {fontSize: 12, color: colors.textSecondary, marginTop: 2},
  amount: {fontSize: 14, fontWeight: '600'},
});
