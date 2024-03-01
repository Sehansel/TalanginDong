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

import { Link, useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp, HomeStackNavigationParamList } from '../type';

function Home(): React.JSX.Element {

  const navigation = useNavigation<HomeScreenNavigationProp>()

  const backgroundStyle = {
    flex: 1,
    backgroundColor: 'white',
  };

  const today = new Date();

  const formattedDate = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  })

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View>
            <Text style={styles.labelText}>Today's Date:</Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              // replace later with profile p
              source={require('../image/logo.png')}
              style={styles.image}
            />
          </View>
        </View>
        <View style={styles.centerContainer}>
          <View style={styles.imageTextContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ScanReceipt')}>
            <Image
              source={require('../image/photo.png')}
              style={styles.smallImage}
            />
            <Text style={styles.smallText}>Upload Bill</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imageTextContainer}>
            <Image
              source={require('../image/friend.png')}
              style={styles.smallImage}
            />
            <Text style={styles.smallText}>Add Friends</Text>
          </View>
          <View style={styles.imageTextContainer}>
            <Image
              source={require('../image/history.png')}
              style={styles.smallImage}
            />
            <Text style={styles.smallText}>History</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image
              source={require('../image/home.png')}
              style={styles.bottomImage}
            />
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: '5%'
  },
  labelText: {
    fontSize: 17,
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black',
  },
  dateText: {
    fontSize: 17,
    color: 'blue',
  },
  imageContainer: {
    marginLeft: '10%'
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  centerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#d0f0ff',
    marginTop: 20,
    borderRadius: 100,
    overflow: 'hidden'
  },
  imageTextContainer: {
    alignItems: 'center',
  },
  smallImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  smallText: {
    marginTop: 5,
    color: 'black'
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#1c2dc7',
    alignItems: 'center',
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
  }
});

export default Home;
