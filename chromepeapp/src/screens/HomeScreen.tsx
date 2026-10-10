import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QuickActionButton from '../components/QuickActionButton';
import TransactionItem from '../components/TransactionItem';
import BannerCarousel from '../components/BannerCarousel';
import RecentPayees from '../components/RecentPayees';
import {currentUser, transactions} from '../data/mockData';
import type {HomeStackParams} from '../navigation/AppNavigator';
import colors from '../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParams, 'Home'>;
};

export default function HomeScreen({navigation}: Props) {
  const recent = transactions.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
      
      {/* Top Header - GPay Style */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Text style={styles.gpayLogo}>
            <Text style={{color: '#4285F4'}}>G</Text>
            <Text style={{color: '#EA4335'}}>P</Text>
            <Text style={{color: '#FBBC05'}}>a</Text>
            <Text style={{color: '#34A853'}}>y</Text>
          </Text>
          <TouchableOpacity style={styles.profileIconWrapper}>
            <Image 
              source={{uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop'}} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <Icon name="search" size={22} color={colors.textSecondary} style={{marginLeft: 12, marginRight: 8}} />
          <Text style={styles.searchText}>Pay friends and merchants</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Promotion Banner */}
        <View style={{ marginHorizontal: 16, marginTop: 12, marginBottom: 8 }}>
          <Image source={require('../assets/banner.jpg')} style={{width: '100%', height: 160, borderRadius: 24}} resizeMode="cover" />
        </View>

        {/* Main Actions Grid (GPay Style) */}
        <View style={styles.gpaySection}>
          <View style={styles.gridRow}>
            <QuickActionButton icon="qr-code-scanner" label="Scan any QR code" onPress={() => {}} />
            <QuickActionButton icon="perm-contact-calendar" label="Pay contacts" onPress={() => {}} />
            <QuickActionButton icon="phone-iphone" label="Pay phone number" onPress={() => {}} />
            <QuickActionButton icon="account-balance" label="Bank transfer" onPress={() => navigation.navigate('SendMoney')} />
          </View>
          <View style={[styles.gridRow, {marginTop: 20}]}>
            <QuickActionButton icon="alternate-email" label="Pay to UPI ID" onPress={() => {}} />
            <QuickActionButton icon="person" label="Self transfer" onPress={() => {}} />
            <QuickActionButton icon="receipt" label="Pay bills" onPress={() => navigation.navigate('Bills')} />
            <QuickActionButton icon="smartphone" label="Mobile recharge" onPress={() => navigation.navigate('Recharge')} />
          </View>
        </View>

        {/* Recent Payees */}
        <RecentPayees />

        {/* Banners */}
        <BannerCarousel />

        {/* Bills & Recharges */}
        <View style={styles.gpaySection}>
          <Text style={styles.sectionLabel}>Bills, recharges and more</Text>
          <View style={styles.gridRow}>
            <QuickActionButton icon="tv" label="DTH / Cable TV" onPress={() => navigation.navigate('Bills')} />
            <QuickActionButton icon="bolt" label="Electricity" onPress={() => navigation.navigate('Bills')} />
            <QuickActionButton icon="wifi" label="Broadband / Landline" onPress={() => navigation.navigate('Bills')} />
            <QuickActionButton icon="directions-car" label="FASTag recharge" onPress={() => navigation.navigate('Bills')} />
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={[styles.section, {marginBottom: 20}]}>
          <Text style={styles.sectionLabel}>Recent Transactions</Text>
          {recent.map(t => (
            <TransactionItem
              key={t.id}
              name={t.name}
              amount={t.amount}
              type={t.type}
              date={t.date}
              note={t.note}
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.primary},
  scrollContent: {
    backgroundColor: colors.background,
    paddingBottom: 40,
  },
  headerContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gpayLogo: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -1,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  searchText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  profileIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  gpaySection: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 24,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
