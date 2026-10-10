import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SuccessOverlay from '../components/SuccessOverlay';
import {billCategories} from '../data/mockData';
import type {HomeStackParams} from '../navigation/AppNavigator';
import colors from '../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParams, 'Bills'>;
};

export default function BillsScreen({navigation}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const category = billCategories.find(c => c.id === selectedCategory);
  const canPay = selectedCategory !== null && accountNo.length >= 5 && Number(amount) > 0;

  if (success && category) {
    return (
      <SuccessOverlay
        title="Bill Paid!"
        subtitle={`₹${amount} paid for ${category.name}`}
        onDone={() => navigation.popToTop()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <Text style={styles.label}>SELECT CATEGORY</Text>
        <View style={styles.categoryGrid}>
          {billCategories.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.categoryCard,
                selectedCategory === c.id ? styles.categoryCardSelected : null,
              ]}
              onPress={() => setSelectedCategory(c.id)}>
              <Icon
                name={c.icon}
                size={28}
                color={selectedCategory === c.id ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.categoryName,
                  selectedCategory === c.id ? styles.categoryNameSelected : null,
                ]}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.label, styles.accountLabel]}>ACCOUNT / CONSUMER NUMBER</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter account number"
          value={accountNo}
          onChangeText={setAccountNo}
          keyboardType="numeric"
        />
        <Text style={[styles.label, styles.amountLabel]}>AMOUNT (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter bill amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.payBtn, !canPay ? styles.payBtnDisabled : null]}
            onPress={() => {
              if (canPay) {
                setSuccess(true);
              }
            }}
            disabled={!canPay}>
            <Text style={styles.payBtnText}>{amount ? `Pay ₹${amount}` : 'Pay Bill'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#fff'},
  container: {flex: 1, padding: 20},
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  categoryGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  categoryCard: {
    width: '47%',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
  },
  categoryCardSelected: {borderColor: colors.primary, backgroundColor: '#fdf4ff'},
  categoryName: {fontSize: 12, color: colors.textSecondary, marginTop: 6, fontWeight: '500'},
  categoryNameSelected: {color: colors.primary},
  accountLabel: {marginTop: 24},
  amountLabel: {marginTop: 20},
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 4,
  },
  footer: {marginTop: 'auto'},
  payBtn: {backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center'},
  payBtnDisabled: {opacity: 0.4},
  payBtnText: {color: '#fff', fontSize: 16, fontWeight: '700'},
});
