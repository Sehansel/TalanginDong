import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { LoginScreen } from '../screens/authentication/login';
import { RegisterScreen } from '../screens/authentication/register';
import { WelcomeScreen } from '../screens/authentication/welcome';

export type AuthNavigatorParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createStackNavigator<AuthNavigatorParamList>();

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
