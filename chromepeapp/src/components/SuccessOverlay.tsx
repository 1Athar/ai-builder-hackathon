import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../theme/colors';

interface Props {
  title: string;
  subtitle: string;
  onDone: () => void;
}

export default function SuccessOverlay({title, subtitle, onDone}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name="check-circle" size={80} color={colors.success} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <TouchableOpacity style={styles.button} onPress={onDone}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'},
  iconCircle: {marginBottom: 24},
  title: {fontSize: 22, fontWeight: '700', color: colors.textPrimary},
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  button: {
    marginTop: 32,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 48,
    paddingVertical: 14,
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});
