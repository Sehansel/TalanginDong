import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';

import {Link, useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp, HomeStackNavigationParamList} from '../type';

function Home(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const backgroundStyle = {
    flex: 1,
    backgroundColor: 'white',
  };

  return <SafeAreaView style={backgroundStyle} />;
}

const styles = StyleSheet.create({});

export default Home;
