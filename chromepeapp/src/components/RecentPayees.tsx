import React from 'react';
import {ScrollView, StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import colors from '../theme/colors';

const payees = [
  {id: '1', name: 'Rahul', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop'},
  {id: '2', name: 'Aarti', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'},
  {id: '3', name: 'Vikas', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'},
  {id: '4', name: 'Sneh', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop'},
  {id: '5', name: 'Priya', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'},
  {id: '6', name: 'Amit', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'},
];

export default function RecentPayees() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>People</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {payees.map(p => (
          <TouchableOpacity key={p.id} style={styles.payeeItem}>
            <Image source={{uri: p.image}} style={styles.avatar} />
            <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 24,
    paddingVertical: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
    marginLeft: 16,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 20,
  },
  payeeItem: {
    alignItems: 'center',
    width: 64,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  }
});
