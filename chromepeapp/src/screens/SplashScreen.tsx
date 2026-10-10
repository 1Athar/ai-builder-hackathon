import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({onFinish}: Props) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.logoBox}>
        <Text style={styles.logo}>₹</Text>
      </View>
      <Text style={styles.appName}>ChromePe</Text>
      <Text style={styles.tagline}>Fast. Safe. Simple.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 90,
    height: 90,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {fontSize: 48, color: '#fff', fontWeight: '700'},
  appName: {fontSize: 32, color: '#fff', fontWeight: '800', letterSpacing: 1},
  tagline: {fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 8},
});
