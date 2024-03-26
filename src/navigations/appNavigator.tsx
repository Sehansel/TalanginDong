import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import AuthNavigator from './authNavigator';

export type AppNavigatorParamList = {
  AuthNavigator: undefined;
};

const Stack = createStackNavigator<AppNavigatorParamList>();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="AuthNavigator">
      <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
