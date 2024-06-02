import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { AddFriendsScreen } from 'src/screens/friend/addFriends';
import { FriendsScreen } from 'src/screens/friend/friends';
import { PendingScreen } from 'src/screens/friend/pending';

interface IFriendNavigator {}

export type FriendNavigatorParamList = {
  Friends: undefined;
  AddFriends: undefined;
  Pending: undefined;
};

const Tab = createMaterialTopTabNavigator<FriendNavigatorParamList>();

export const FriendNavigator: React.FC<IFriendNavigator> = function FriendNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Friends' component={FriendsScreen} />
      <Tab.Screen name='AddFriends' component={AddFriendsScreen} />
      <Tab.Screen name='Pending' component={PendingScreen} />
    </Tab.Navigator>
  );
};
