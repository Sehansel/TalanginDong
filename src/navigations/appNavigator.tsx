import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'src/models';
import { AuthNavigator } from 'src/navigations/authNavigator';
import { BottomTabNavigator } from 'src/navigations/bottomTabNavigator';

import { SplitBillNavigator } from './splitBillNavigator';

interface IAppNavigator {}

export type AppNavigatorParamList = {
  AuthNavigator: undefined;
  BottomTabNavigator: undefined;
  SplitBillNavigator: undefined;
};

const Stack = createStackNavigator<AppNavigatorParamList>();

export const AppNavigator: React.FC<IAppNavigator> = observer(function AppNavigator(props) {
  const {
    authenticationStore: { isAuthenticated },
  } = useStores();

  return (
    <Stack.Navigator initialRouteName={!isAuthenticated ? 'AuthNavigator' : 'BottomTabNavigator'}>
      {!isAuthenticated ? (
        <Stack.Screen
          name='AuthNavigator'
          component={AuthNavigator}
          options={{
            headerShown: false,
          }}
        />
      ) : (
        <>
          <Stack.Screen
            name='BottomTabNavigator'
            component={BottomTabNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='SplitBillNavigator'
            component={SplitBillNavigator}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
});
