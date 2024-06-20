import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { Divider, Icon, Portal, Snackbar, TouchableRipple } from 'react-native-paper';
import { CustomAvatar } from 'src/components/customAvatar';
import { STORAGE_KEY } from 'src/constants';
import { useStores } from 'src/models';
import { ProfileStoreModel } from 'src/models/profile/profileStore';
import * as ProfileService from 'src/services/profileService';
import { COLOR } from 'src/theme';
import { isNetworkError } from 'src/utils/apiUtils';

interface IProfileProps {}

interface ILoaderProps {}

const LoaderItem: React.FC<ILoaderProps> = function LoaderItem() {
  return (
    <View
      style={{
        padding: 15,
      }}>
      <ContentLoader width='200' height={150}>
        <Circle cx='100' cy='50' r='50' />
        <Rect x='0' y='122' rx='5' ry='5' width='100%' height='20' />
      </ContentLoader>
    </View>
  );
};

export const ProfileScreen: React.FC<IProfileProps> = observer(function ProfileScreen(props) {
  const profileStore = useLocalObservable(() =>
    ProfileStoreModel.create({
      username: undefined,
      snackbar: '',
    }),
  );
  const { authenticationStore, friendsStore, addFriendsStore, pendingStore } = useStores();
  const profileItems = [
    {
      title: 'Account Settings',
      data: [
        {
          id: 'edit_profile',
          title: 'Edit Profile',
          icon: 'account-outline',
          position: 'start',
        },
        {
          id: 'security',
          title: 'Security',
          icon: 'shield-alert-outline',
          position: 'end',
        },
      ],
    },
    {
      title: 'App Settings',
      data: [
        {
          id: 'appearance',
          title: 'Appearance',
          icon: 'palette-outline',
          position: 'start',
        },
        {
          id: 'notifications',
          title: 'Notifications',
          icon: 'bell-outline',
          position: 'end',
        },
      ],
    },
    {
      title: 'Support & About',
      data: [
        {
          id: 'help_and_support',
          title: 'Help & Support',
          icon: 'help-circle-outline',
          position: 'start',
        },
        {
          id: 'terms_and_policies',
          title: 'Terms and Policies',
          icon: 'information-outline',
          position: 'end',
        },
      ],
    },
    {
      title: 'Actions',
      data: [
        {
          id: 'report_a_problem',
          title: 'Report a Problem',
          icon: 'flag-outline',
          position: 'start',
        },
        {
          id: 'log_out',
          title: 'Log Out',
          icon: 'logout',
          position: 'end',
        },
      ],
    },
  ];

  async function getProfile() {
    try {
      const response = await ProfileService.getProfile();
      if (response.ok) {
        profileStore.setUsername(response.data.data.username);
      } else if (isNetworkError(response.problem)) {
        profileStore.setSnackbar('Please check your network connection before continue!');
      } else {
        profileStore.setSnackbar('Unknown error occured');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      profileStore.setSnackbar('Unknown error occured');
    }
  }

  async function handleClick(id: string) {
    if (id === 'log_out') {
      await SecureStore.deleteItemAsync(STORAGE_KEY.TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEY.REFRESH_TOKEN);
      friendsStore.reset();
      addFriendsStore.reset();
      pendingStore.reset();
      authenticationStore.logout();
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        profileStore.setUsername(undefined);
        getProfile();
      })();
      return () => {};
    }, []),
  );

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            marginTop: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {!profileStore.username ? (
            <View
              style={{
                marginTop: -15,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 7,
              }}>
              <LoaderItem />
            </View>
          ) : (
            <>
              <CustomAvatar label={profileStore.username} size={100} />
              <Text
                style={{
                  marginTop: 15,
                  marginBottom: 30,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                {profileStore.username}
              </Text>
            </>
          )}
        </View>
        <SectionList
          sections={profileItems}
          renderItem={({ item }) => (
            <TouchableRipple
              borderless
              style={{
                backgroundColor: COLOR.GREY_2,
                marginHorizontal: 20,
                borderTopStartRadius: item.position === 'start' ? 10 : 0,
                borderTopEndRadius: item.position === 'start' ? 10 : 0,
                borderBottomStartRadius: item.position === 'end' ? 10 : 0,
                borderBottomEndRadius: item.position === 'end' ? 10 : 0,
              }}
              onPress={() => handleClick(item.id)}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                }}>
                <Icon
                  source={item.icon}
                  size={25}
                  color={item.id === 'log_out' ? COLOR.RED : undefined}
                />
                <Text
                  style={{
                    padding: 15,
                    fontSize: 16,
                    fontWeight: 'bold',
                    width: '75%',
                    color: item.id === 'log_out' ? COLOR.RED : undefined,
                  }}>
                  {item.title}
                </Text>
              </View>
            </TouchableRipple>
          )}
          renderSectionHeader={({ section }) => (
            <View
              style={{
                flexDirection: 'column',
                width: '100%',
              }}>
              <Text style={styles.profileTitle}>{section.title}</Text>
            </View>
          )}
          renderSectionFooter={({ section }) => {
            return (
              <View
                style={{
                  height: section.title === profileItems.at(-1)?.title ? 35 : 0,
                }}
              />
            );
          }}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <Divider
              style={{
                marginHorizontal: 20,
              }}
            />
          )}
          style={styles.section}
        />
        <Portal>
          <Snackbar
            visible={!(!profileStore.snackbar || profileStore.snackbar === '')}
            onDismiss={() => profileStore.setSnackbar('')}
            action={{
              label: 'Ok',
            }}
            theme={{ colors: { inversePrimary: COLOR.PRIMARY } }}>
            {profileStore.snackbar}
          </Snackbar>
        </Portal>
        <StatusBar style='auto' />
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    width: '100%',
  },
  profileItem: {
    padding: 15,
    fontSize: 16,
    fontWeight: 'bold',
    width: '75%',
  },
  profileTitle: {
    backgroundColor: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    // elevation: 4,
    marginHorizontal: 10,
    borderRadius: 10,
  },
});
