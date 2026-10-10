import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const COLORS = ['#5f259f', '#2196F3', '#4CAF50', '#FF5722', '#009688', '#E91E63'];

interface Props {
  name: string;
  size?: number;
  color?: string;
}

export default function ContactAvatar({name, size = 40, color}: Props) {
  const initial = name.trim()[0]?.toUpperCase() ?? '?';
  const bg = color ?? COLORS[name.charCodeAt(0) % COLORS.length];

  return (
    <View
      style={[
        styles.circle,
        {width: size, height: size, borderRadius: size / 2, backgroundColor: bg},
      ]}>
      <Text style={[styles.letter, {fontSize: size * 0.4}]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {alignItems: 'center', justifyContent: 'center'},
  letter: {color: '#fff', fontWeight: '700'},
});
