import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import SendMoneyScreen from '../screens/SendMoneyScreen';
import ScanPayScreen from '../screens/ScanPayScreen';
import HistoryScreen from '../screens/HistoryScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import WalletScreen from '../screens/WalletScreen';
import RechargeScreen from '../screens/RechargeScreen';
import BillsScreen from '../screens/BillsScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type HomeStackParams = {
  Home: undefined;
  SendMoney: undefined;
  Recharge: undefined;
  Bills: undefined;
};

export type HistoryStackParams = {
  History: undefined;
  TransactionDetail: {transactionId: string};
};

const HomeStack = createNativeStackNavigator<HomeStackParams>();
const HistoryStack = createNativeStackNavigator<HistoryStackParams>();
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  HomeTab: 'home',
  ScanTab: 'qr-code-scanner',
  HistoryTab: 'history',
  WalletTab: 'account-balance-wallet',
  ProfileTab: 'person',
};

function renderTabBarIcon(routeName: string) {
  return ({color, size}: {color: string; size: number}) => (
    <Icon name={TAB_ICONS[routeName] ?? 'circle'} size={size} color={color} />
  );
}

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen
        name="SendMoney"
        component={SendMoneyScreen}
        options={{headerShown: true, title: 'Send Money', headerTintColor: colors.primary}}
      />
      <HomeStack.Screen
        name="Recharge"
        component={RechargeScreen}
        options={{headerShown: true, title: 'Recharge', headerTintColor: colors.primary}}
      />
      <HomeStack.Screen
        name="Bills"
        component={BillsScreen}
        options={{headerShown: true, title: 'Pay Bills', headerTintColor: colors.primary}}
      />
    </HomeStack.Navigator>
  );
}

function HistoryStackNav() {
  return (
    <HistoryStack.Navigator screenOptions={{headerShown: false}}>
      <HistoryStack.Screen name="History" component={HistoryScreen} />
      <HistoryStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{headerShown: true, title: 'Details', headerTintColor: colors.primary}}
      />
    </HistoryStack.Navigator>
  );
}

export default function AppNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: '#737373',
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: '#FFFFFF',
          paddingTop: 8,
          minHeight: 60 + insets.bottom,
          paddingBottom: insets.bottom || 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: renderTabBarIcon(route.name),
      })}>
      <Tab.Screen name="HomeTab" component={HomeStackNav} options={{title: 'Home'}} />
      <Tab.Screen name="ScanTab" component={ScanPayScreen} options={{title: 'Wealth'}} />
      <Tab.Screen name="HistoryTab" component={HistoryStackNav} options={{title: 'History'}} />
    </Tab.Navigator>
  );
}
