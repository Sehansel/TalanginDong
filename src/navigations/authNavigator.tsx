import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ForgotPasswordScreen } from 'src/screens/authentication/forgotPassword';
import { LoginScreen } from 'src/screens/authentication/login';
import { RegisterScreen } from 'src/screens/authentication/register';
import { WelcomeScreen } from 'src/screens/authentication/welcome';

interface IAuthNavigator {}

export type AuthNavigatorParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

const Stack = createStackNavigator<AuthNavigatorParamList>();

export const AuthNavigator: React.FC<IAuthNavigator> = function AuthNavigator(props) {
  return (
    <Stack.Navigator initialRouteName='Welcome'>
      <Stack.Screen
        name='Welcome'
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Login'
        component={LoginScreen}
        options={{
          headerBackTitleVisible: false,
          title: '',
          headerShadowVisible: false,
          headerStyle: {
            height: 60,
          },
        }}
      />
      <Stack.Screen
        name='ForgotPassword'
        component={ForgotPasswordScreen}
        options={{
          headerBackTitleVisible: false,
          title: '',
          headerShadowVisible: false,
          headerStyle: {
            height: 60,
          },
        }}
      />
      <Stack.Screen
        name='Register'
        component={RegisterScreen}
        options={{
          headerBackTitleVisible: false,
          title: '',
          headerShadowVisible: false,
          headerStyle: {
            height: 60,
          },
        }}
      />
    </Stack.Navigator>
  );
};
