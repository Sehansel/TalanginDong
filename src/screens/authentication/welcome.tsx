import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

interface IWelcomeProps {}

export const WelcomeScreen: React.FC<IWelcomeProps> = function WelcomeScreen(props) {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>TalanginDong</Text>
        <Text style={styles.description}>You & friends do the fun, we do the math.</Text>
        <Image
          style={styles.welcomeImage}
          source={require('../../assets/images/welcome-image.png')}
        />
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeImage: {
    height: 215,
    width: 347,
    resizeMode: 'cover',
  },
  title: {
    fontWeight: '600',
    fontSize: 32,
  },
  description: {
    fontWeight: '400',
    fontSize: 14,
  },
});
