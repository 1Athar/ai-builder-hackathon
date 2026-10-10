import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import SuccessOverlay from '../components/SuccessOverlay';
import {mobilePlans} from '../data/mockData';
import type {HomeStackParams} from '../navigation/AppNavigator';
import colors from '../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParams, 'Recharge'>;
};

export default function RechargeScreen({navigation}: Props) {
  const [phone, setPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canPay = phone.length === 10 && selectedPlan !== null;
  const plan = mobilePlans.find(p => p.id === selectedPlan);

  if (success && plan) {
    return (
      <SuccessOverlay
        title="Recharge Successful!"
        subtitle={`₹${plan.amount} recharge done for ${phone}`}
        onDone={() => navigation.popToTop()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <Text style={styles.label}>MOBILE NUMBER</Text>
        <TextInput
          style={styles.input}
          placeholder="10-digit mobile number"
          value={phone}
          onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          maxLength={10}
        />
        <Text style={[styles.label, styles.planLabel]}>SELECT PLAN</Text>
        <FlatList
          data={mobilePlans}
          keyExtractor={p => p.id}
          scrollEnabled={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[styles.planCard, selectedPlan === item.id ? styles.planCardSelected : null]}
              onPress={() => setSelectedPlan(item.id)}>
              <View>
                <Text style={styles.planOperator}>{item.operator}</Text>
                <Text style={styles.planDetails}>
                  {item.validity} · {item.data}
                </Text>
              </View>
              <Text style={styles.planAmount}>₹{item.amount}</Text>
            </TouchableOpacity>
          )}
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
            <Text style={styles.payBtnText}>{plan ? `Recharge ₹${plan.amount}` : 'Recharge Now'}</Text>
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
  planLabel: {marginTop: 24},
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 4,
  },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  planCardSelected: {borderColor: colors.primary, backgroundColor: '#fdf4ff'},
  planOperator: {fontSize: 14, fontWeight: '600', color: colors.textPrimary},
  planDetails: {fontSize: 12, color: colors.textSecondary, marginTop: 2},
  planAmount: {fontSize: 16, fontWeight: '700', color: colors.primary},
  footer: {marginTop: 'auto'},
  payBtn: {backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center'},
  payBtnDisabled: {opacity: 0.4},
  payBtnText: {color: '#fff', fontSize: 16, fontWeight: '700'},
});
