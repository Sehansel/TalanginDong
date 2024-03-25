import '@expo/metro-runtime';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-gesture-handler';

import App from './src/app';

SplashScreen.preventAutoHideAsync();

function TalanginDongApp() {
  return <App hideSplashScreen={SplashScreen.hideAsync} />;
}

export default TalanginDongApp;
