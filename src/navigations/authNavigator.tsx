import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { LoginScreen } from 'src/screens/authentication/login';
import { RegisterScreen } from 'src/screens/authentication/register';

import { ROUTES } from '../constants';
import { WelcomeScreen } from '../screens/authentication/welcome';

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.WELCOME}>
      <Stack.Screen
        name={ROUTES.WELCOME}
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
