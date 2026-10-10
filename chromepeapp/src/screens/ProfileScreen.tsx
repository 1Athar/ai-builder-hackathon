import React from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ContactAvatar from '../components/ContactAvatar';
import {currentUser} from '../data/mockData';
import colors from '../theme/colors';

const SETTINGS = [
  {id: 's1', icon: 'lock', label: 'Security & PIN'},
  {id: 's2', icon: 'notifications', label: 'Notifications'},
  {id: 's3', icon: 'language', label: 'Language'},
  {id: 's4', icon: 'help-outline', label: 'Help & Support'},
  {id: 's5', icon: 'privacy-tip', label: 'Privacy Policy'},
  {id: 's6', icon: 'info-outline', label: 'About ChromePe'},
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <ContactAvatar name={currentUser.name} size={72} />
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.phone}>{currentUser.phone}</Text>
          <View style={styles.upiChip}>
            <Text style={styles.upiText}>{currentUser.upiId}</Text>
          </View>
        </View>
        <View style={styles.section}>
          {SETTINGS.map((s, i) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.settingRow, i < SETTINGS.length - 1 ? styles.settingRowBorder : null]}
              onPress={() => Alert.alert(s.label, 'Coming soon!')}>
              <View style={styles.settingIcon}>
                <Icon name={s.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingLabel}>{s.label}</Text>
              <Icon name="chevron-right" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => Alert.alert('Logout', 'Coming soon!')}>
          <Icon name="logout" size={18} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#f5f5f5'},
  header: {backgroundColor: colors.primary, alignItems: 'center', paddingTop: 24, paddingBottom: 32},
  name: {color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 12},
  phone: {color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4},
  upiChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginTop: 10,
  },
  upiText: {color: '#fff', fontSize: 12},
  section: {backgroundColor: '#fff', margin: 16, borderRadius: 16, overflow: 'hidden', elevation: 1},
  settingRow: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16},
  settingRowBorder: {borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
  settingIcon: {backgroundColor: '#f3e8ff', borderRadius: 8, padding: 6, marginRight: 14},
  settingLabel: {flex: 1, fontSize: 14, color: colors.textPrimary},
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 1,
  },
  logoutText: {color: colors.error, fontSize: 15, fontWeight: '600'},
});
