import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import TransactionItem from '../components/TransactionItem';
import {transactions} from '../data/mockData';
import type {HistoryStackParams} from '../navigation/AppNavigator';
import colors from '../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<HistoryStackParams, 'History'>;
};

const FILTERS = ['All', 'Sent', 'Received', 'Recharge'] as const;
type Filter = (typeof FILTERS)[number];

export default function HistoryScreen({navigation}: Props) {
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = transactions.filter(t => {
    if (filter === 'All') {
      return true;
    }
    if (filter === 'Sent') {
      return t.type === 'sent' || t.type === 'bill';
    }
    if (filter === 'Received') {
      return t.type === 'received';
    }
    if (filter === 'Recharge') {
      return t.type === 'recharge';
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
      </View>
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f ? styles.filterTabActive : null]}
            onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f ? styles.filterTextActive : null]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('TransactionDetail', {transactionId: item.id})}>
            <TransactionItem
              name={item.name}
              amount={item.amount}
              type={item.type}
              date={item.date}
              note={item.note}
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#fff'},
  header: {backgroundColor: colors.primary, padding: 16},
  title: {color: '#fff', fontSize: 18, fontWeight: '700'},
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterTab: {flex: 1, paddingVertical: 12, alignItems: 'center'},
  filterTabActive: {borderBottomWidth: 2, borderBottomColor: colors.primary},
  filterText: {fontSize: 13, color: colors.textSecondary},
  filterTextActive: {color: colors.primary, fontWeight: '600'},
  list: {paddingHorizontal: 20},
});
