import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button } from 'react-native-paper';

import { AuthNavigatorParamList } from '../../navigations/authNavigator';
import { COLOR } from '../../theme';

interface IWelcomeProps {
  navigation: StackNavigationProp<AuthNavigatorParamList>;
}

export const WelcomeScreen: React.FC<IWelcomeProps> = function WelcomeScreen(props) {
  const { navigation } = props;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Image style={styles.icon} source={require('../../assets/images/adaptive-icon.png')} />
        </View>
        <Text style={styles.title}>TalanginDong</Text>
        <Text style={styles.description}>You & friends do the fun, we do the math.</Text>
        <Image
          style={styles.welcomeImage}
          source={require('../../assets/images/welcome-image.png')}
        />
        <Button
          mode="outlined"
          theme={{ colors: { outline: COLOR.PRIMARY } }}
          textColor={COLOR.PRIMARY}
          style={styles.button}
          onPress={() => navigation.navigate('Login')}>
          Log In
        </Button>
        <Text style={styles.orText}>-or-</Text>
        <Button
          mode="contained"
          buttonColor={COLOR.PRIMARY}
          textColor="white"
          style={styles.button}
          onPress={() => navigation.navigate('Register')}>
          Create Account
        </Button>
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
    rowGap: 10,
  },
  welcomeImage: {
    height: 215,
    width: 347,
    resizeMode: 'cover',
  },
  iconContainer: {
    width: 340,
    alignItems: 'flex-end',
    marginBottom: -50,
  },
  icon: {
    flex: 0,
    height: 70,
    width: 70,
    transform: [
      {
        rotate: '-25deg',
      },
    ],
  },
  title: {
    fontWeight: '600',
    fontSize: 38,
  },
  description: {
    fontWeight: '400',
    fontSize: 15,
  },
  orText: {
    fontWeight: '600',
    fontSize: 12,
    margin: 5,
  },
  button: {
    width: 175,
    height: 40,
  },
});
