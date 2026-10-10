import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../theme/colors';

interface Props {
  icon: string;
  label: string;
  onPress: () => void;
}

export default function QuickActionButton({icon, label, onPress}: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Icon name={icon} size={22} color={colors.accent} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: 'center', width: 75},
  iconWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 8,
    marginBottom: 8,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#e8eaed',
  },
  label: {fontSize: 11, fontWeight: '500', color: '#3c4043', textAlign: 'center'},
});
