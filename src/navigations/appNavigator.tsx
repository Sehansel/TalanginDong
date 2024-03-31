import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { AuthNavigator } from './authNavigator';

interface IAppNavigator {}

export type AppNavigatorParamList = {
  AuthNavigator: undefined;
};

const Stack = createStackNavigator<AppNavigatorParamList>();

export const AppNavigator: React.FC<IAppNavigator> = function AppNavigator(props) {
  return (
    <Stack.Navigator initialRouteName='AuthNavigator'>
      <Stack.Screen name='AuthNavigator' component={AuthNavigator} />
    </Stack.Navigator>
  );
};
