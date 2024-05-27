import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'src/models';

import { AuthNavigator } from './authNavigator';
import { MainNavigator } from './mainNavigator';

interface IAppNavigator {}

export type AppNavigatorParamList = {
  AuthNavigator: undefined;
  MainNavigator: undefined;
};

const Stack = createStackNavigator<AppNavigatorParamList>();

export const AppNavigator: React.FC<IAppNavigator> = observer(function AppNavigator(props) {
  const {
    authenticationStore: { isAuthenticated },
  } = useStores();

  return (
    <Stack.Navigator initialRouteName={!isAuthenticated ? 'AuthNavigator' : 'MainNavigator'}>
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
          name='MainNavigator'
          component={MainNavigator}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
});
