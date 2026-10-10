import React from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {banks, currentUser} from '../data/mockData';
import colors from '../theme/colors';

export default function WalletScreen() {
  const totalBalance = currentUser.walletBalance;
  const formatted = `₹${totalBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wallet & Bank</Text>
          <View style={styles.bigCard}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>{formatted}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => Alert.alert('Add Money', 'Coming soon!')}>
                <Icon name="add-circle-outline" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Add Money</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => Alert.alert('Transfer', 'Coming soon!')}>
                <Icon name="send" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Transfer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>LINKED ACCOUNTS</Text>
          {banks.map(b => (
            <View key={b.id} style={styles.bankCard}>
              <View style={styles.bankIcon}>
                <Icon name="account-balance" size={24} color={colors.primary} />
              </View>
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>{b.name}</Text>
                <Text style={styles.bankMeta}>
                  {b.accountMasked} · {b.type}
                </Text>
              </View>
              <Text style={styles.bankBalance}>₹{b.balance.toLocaleString('en-IN')}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addBankBtn}
            onPress={() => Alert.alert('Link Account', 'Coming soon!')}>
            <Icon name="add" size={18} color={colors.primary} />
            <Text style={styles.addBankText}>Link New Bank Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#f5f5f5'},
  header: {backgroundColor: colors.primary, padding: 20, paddingBottom: 28},
  headerTitle: {color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16},
  bigCard: {backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 20},
  balanceLabel: {color: 'rgba(255,255,255,0.8)', fontSize: 12},
  balanceAmount: {color: '#fff', fontSize: 32, fontWeight: '800', marginTop: 4},
  actionRow: {flexDirection: 'row', gap: 12, marginTop: 16},
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  actionBtnText: {color: '#fff', fontSize: 12, fontWeight: '600'},
  section: {backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 20, elevation: 1},
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  bankIcon: {backgroundColor: '#f3e8ff', borderRadius: 10, padding: 8, marginRight: 12},
  bankInfo: {flex: 1},
  bankName: {fontSize: 14, fontWeight: '600', color: colors.textPrimary},
  bankMeta: {fontSize: 12, color: colors.textSecondary, marginTop: 2},
  bankBalance: {fontSize: 15, fontWeight: '700', color: colors.primary},
  addBankBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 8,
  },
  addBankText: {color: colors.primary, fontSize: 13, fontWeight: '600'},
});
