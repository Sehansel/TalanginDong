import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import AuthNavigator from './authNavigator';
import { ROUTES } from '../constants';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.AUTH_NAVIGATOR}>
      <Stack.Screen name={ROUTES.AUTH_NAVIGATOR} component={AuthNavigator} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
