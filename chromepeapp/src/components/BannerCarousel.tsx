import React from 'react';
import {ScrollView, StyleSheet, View, Text, ImageBackground} from 'react-native';

const banners = [
  {
    id: '1', 
    title: 'Get flat ₹50 Cashback', 
    subtitle: 'On your first mobile recharge.', 
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '2', 
    title: 'Pay Bills Win Rewards', 
    subtitle: 'Earn up to ₹1000 daily.', 
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '3', 
    title: 'Refer & Earn', 
    subtitle: 'Get ₹100 for every friend.', 
    image: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=600&auto=format&fit=crop'
  },
];

export default function BannerCarousel() {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {banners.map(b => (
          <ImageBackground 
            key={b.id} 
            source={{uri: b.image}} 
            style={styles.bannerCard}
            imageStyle={{borderRadius: 12}}
          >
            <View style={styles.overlay}>
              <View style={styles.content}>
                <Text style={styles.title}>{b.title}</Text>
                <Text style={styles.subtitle}>{b.subtitle}</Text>
              </View>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  bannerCard: {
    width: 300,
    height: 140,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    width: '85%',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  subtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 14,
    fontWeight: '500',
  }
});
