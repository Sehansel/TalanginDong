import React, {useState} from 'react';
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
  Button,
} from 'react-native';

import {Link, useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp, HomeStackNavigationParamList} from '../type';

function ScanReceipt(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const backgroundStyle = {
    flex: 1,
    backgroundColor: 'white',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>View Item</Text>
          <Text style={styles.subTitleText}>Check If Items Are Correct</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Finalize</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View>
          <Image
            source={require('../image/logo.png')}
            style={styles.bottomImage}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  textContainer: {
    marginTop: '5%',
  },
  titleText: {
    fontSize: 35,
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black',
  },
  subTitleText: {
    fontSize: 15,
    color: 'black',
  },
  imageContainer: {
    marginTop: '7%',
    marginLeft: '10%',
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c2dc7',
    paddingHorizontal: 20,
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomImage: {
    width: 50,
    height: 50,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: '30%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScanReceipt;
