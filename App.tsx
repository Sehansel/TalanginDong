/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Register from './screens/Register';
import Login from './screens/Login';
import Main from './screens/Main';
import Home from './screens/Home';
import ScanReceipt from './screens/ScanReceipt';
import ViewItem from './screens/ViewItems';
import DivideItem from './screens/DivideItem';
import {HomeStackNavigationParamList} from './type';

const Stack = createNativeStackNavigator<HomeStackNavigationParamList>();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name="ScanReceipt"
          component={ScanReceipt}
          options={{headerShown: false}}
        /> */}
        <Stack.Screen
          name="ViewItem"
          component={ViewItem}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={Main}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        /> */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ScanReceipt"
          component={ScanReceipt}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name="ViewItem"
          component={ViewItem}
          options={{headerShown: false}}
        /> */}
        <Stack.Screen
          name="DivideItem"
          component={DivideItem}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
