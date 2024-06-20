import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FriendNavigator } from 'src/navigations/friendNavigator';
import { CreateScreen } from 'src/screens/main/create';
import { HistoryScreen } from 'src/screens/main/history';
import { HomeScreen } from 'src/screens/main/home';
import { ProfileScreen } from 'src/screens/profile/profile';
import { COLOR } from 'src/theme';

interface ITabBarButton {
  focused: boolean;
  color: string;
  size: number;
  label: string;
  iconName: string;
}

const TabBarButton: React.FC<ITabBarButton> = function TabBarButton(props) {
  const { focused, color, size, label, iconName } = props;
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon name={iconName} size={size} color={focused ? COLOR.PRIMARY : color} />
      <Text
        style={{
          color: focused ? COLOR.PRIMARY : color,
          fontSize: 12,
        }}>
        {label}
      </Text>
    </View>
  );
};

interface IMainNavigator {}

export type MainNavigatorParamList = {
  Home: undefined;
  Friend: undefined;
  Create: undefined;
  History: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainNavigatorParamList>();

export const MainNavigator: React.FC<IMainNavigator> = function HomeNavigator(props) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarButton: (props) => (
          <TouchableRipple
            onPress={props.onPress}
            borderless
            style={{
              alignItems: 'center',
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              borderRadius: 15,
            }}>
            {props.children}
          </TouchableRipple>
        ),
      }}>
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarButton
              focused={focused}
              color={color}
              size={size}
              label='Home'
              iconName='home'
            />
          ),
        }}
      />
      <Tab.Screen
        name='Friend'
        component={FriendNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarButton
              focused={focused}
              color={color}
              size={size}
              label='Friend'
              iconName='account-multiple'
            />
          ),
        }}
      />
      <Tab.Screen
        name='Create'
        component={CreateScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name='plus' size={size + 10} color={COLOR.WHITE} />
            </View>
          ),
          tabBarButton: (props) => (
            <TouchableRipple
              borderless
              style={{
                top: -35,
                justifyContent: 'center',
                alignItems: 'center',
                width: 60,
                height: 60,
                borderRadius: 35,
                backgroundColor: COLOR.PRIMARY,
                shadowColor: COLOR.GREY_3,
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.5,
                elevation: 5,
              }}
              onPress={props.onPress}>
              {props.children}
            </TouchableRipple>
          ),
        }}
      />
      <Tab.Screen
        name='History'
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarButton
              focused={focused}
              color={color}
              size={size}
              label='History'
              iconName='file-document-edit'
            />
          ),
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarButton
              focused={focused}
              color={color}
              size={size}
              label='Profile'
              iconName='account-circle'
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
