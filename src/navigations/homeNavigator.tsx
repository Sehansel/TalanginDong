import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { HomeScreen } from '../screens/home/home';

interface IHomeNavigator {}

export type HomeNavigatorParamList = {
  Home: undefined;
};

const Stack = createStackNavigator<HomeNavigatorParamList>();

export const HomeNavigator: React.FC<IHomeNavigator> = function HomeNavigator(props) {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
