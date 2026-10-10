import React from 'react';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ContactAvatar from '../components/ContactAvatar';
import {transactions} from '../data/mockData';
import type {HistoryStackParams} from '../navigation/AppNavigator';
import colors from '../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<HistoryStackParams, 'TransactionDetail'>;
  route: RouteProp<HistoryStackParams, 'TransactionDetail'>;
};

export default function TransactionDetailScreen({route}: Props) {
  const {transactionId} = route.params;
  const txn = transactions.find(t => t.id === transactionId);

  if (!txn) {
    return (
      <View style={styles.center}>
        <Text>Transaction not found</Text>
      </View>
    );
  }

  const isCredited = txn.type === 'received';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.card}>
        <ContactAvatar name={txn.name} size={64} />
        <Text style={styles.name}>{txn.name}</Text>
        <Text style={[styles.amount, {color: isCredited ? colors.success : colors.error}]}>
          {isCredited ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{txn.type.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.detailSection}>
        <Row label="Date" value={txn.date} />
        <Row label="Reference" value={`TXN${txn.id.toUpperCase()}2026`} />
        <Row label="Status" value="Success ✅" />
        {txn.note ? <Row label="Note" value={txn.note} /> : null}
      </View>
    </SafeAreaView>
  );
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#f5f5f5'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  card: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 32,
    margin: 16,
    borderRadius: 16,
    elevation: 2,
  },
  name: {fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 12},
  amount: {fontSize: 32, fontWeight: '800', marginTop: 8},
  badge: {
    backgroundColor: '#f3e8ff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 10,
  },
  badgeText: {fontSize: 11, color: colors.primary, fontWeight: '700'},
  detailSection: {backgroundColor: '#fff', margin: 16, borderRadius: 16, paddingHorizontal: 20, elevation: 1},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowLabel: {fontSize: 13, color: colors.textSecondary},
  rowValue: {fontSize: 13, color: colors.textPrimary, fontWeight: '500'},
});
