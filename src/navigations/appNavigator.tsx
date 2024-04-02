import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'src/models';

import { AuthNavigator } from './authNavigator';
import { HomeNavigator } from './homeNavigator';

interface IAppNavigator {}

export type AppNavigatorParamList = {
  AuthNavigator: undefined;
  HomeNavigator: undefined;
};

const Stack = createStackNavigator<AppNavigatorParamList>();

export const AppNavigator: React.FC<IAppNavigator> = observer(function AppNavigator(props) {
  const {
    authenticationStore: { isAuthenticated },
  } = useStores();

  return (
    <Stack.Navigator initialRouteName={!isAuthenticated ? 'AuthNavigator' : 'HomeNavigator'}>
      {!isAuthenticated ? (
        <Stack.Screen
          name='AuthNavigator'
          component={AuthNavigator}
          options={{
            headerShown: false,
          }}
        />
      ) : (
        <Stack.Screen
          name='HomeNavigator'
          component={HomeNavigator}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
});
