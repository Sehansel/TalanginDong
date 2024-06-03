import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Text } from 'react-native';
import { AddFriendsScreen } from 'src/screens/friend/addFriends';
import { FriendsScreen } from 'src/screens/friend/friends';
import { PendingScreen } from 'src/screens/friend/pending';
import { COLOR } from 'src/theme';

interface ITabBarLabel {
  label: string;
  focused: boolean;
}

const TabBarLabel: React.FC<ITabBarLabel> = function TabBarLabel(props) {
  const { label, focused } = props;
  return (
    <Text
      style={{
        color: focused ? COLOR.PRIMARY : COLOR.GREY_3,
        opacity: focused ? 1 : 0.5,
      }}>
      {label}
    </Text>
  );
};

interface IFriendNavigator {}

export type FriendNavigatorParamList = {
  Friends: undefined;
  AddFriends: undefined;
  Pending: undefined;
};

const Tab = createMaterialTopTabNavigator<FriendNavigatorParamList>();

export const FriendNavigator: React.FC<IFriendNavigator> = function FriendNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: COLOR.PRIMARY,
        },
        tabBarPressColor: COLOR.GREY_1,
      }}>
      <Tab.Screen
        name='Friends'
        component={FriendsScreen}
        options={{
          tabBarLabel: (props) => <TabBarLabel label='Friends' focused={props.focused} />,
        }}
      />
      <Tab.Screen
        name='AddFriends'
        component={AddFriendsScreen}
        options={{
          tabBarLabel: (props) => <TabBarLabel label='Add Friends' focused={props.focused} />,
        }}
      />
      <Tab.Screen
        name='Pending'
        component={PendingScreen}
        options={{
          tabBarLabel: (props) => <TabBarLabel label='Pending' focused={props.focused} />,
        }}
      />
    </Tab.Navigator>
  );
};
