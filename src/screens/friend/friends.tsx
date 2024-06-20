import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import React from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import { Dimensions, SectionList, StyleSheet, Text, View } from 'react-native';
import { Button, Dialog, Divider, IconButton, Menu, Portal, Snackbar } from 'react-native-paper';
import { CustomAvatar } from 'src/components/customAvatar';
import { CustomRefreshControl } from 'src/components/customRefreshControl';
import { FriendRemoveStatus } from 'src/constants/misc';
import { useStores } from 'src/models';
import { FriendNavigatorParamList } from 'src/navigations/friendNavigator';
import * as FriendService from 'src/services/friendService';
import { COLOR } from 'src/theme';
import { isNetworkError } from 'src/utils/apiUtils';

interface IFriendsProps {
  navigation: StackNavigationProp<FriendNavigatorParamList>;
}

interface ILoaderProps {}

interface ICustomMenuProps {
  id: string;
  username: string;
}

const CustomMenu: React.FC<ICustomMenuProps> = observer(function CustomMenu(props) {
  const { id, username } = props;
  const { friendsStore } = useStores();
  const [visible, setVisible] = React.useState(false);
  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <IconButton iconColor='grey' icon='dots-vertical' onPress={() => setVisible(true)} />
      }>
      <Menu.Item
        onPress={() => {
          setVisible(false);
          friendsStore.setDialog(id, username, FriendRemoveStatus.ASK_CONFIRMATION, true);
        }}
        title='Remove'
      />
    </Menu>
  );
});

const LoaderItem: React.FC<ILoaderProps> = function LoaderItem() {
  return (
    <View
      style={{
        padding: 15,
      }}>
      <ContentLoader width='100%' height={60}>
        <Circle cx='30' cy='30' r='25' />
        <Rect x='75' y='25' rx='5' ry='5' width='70%' height='12' />
      </ContentLoader>
    </View>
  );
};

export const FriendsScreen: React.FC<IFriendsProps> = observer(function FriendsScreen(props) {
  // const { navigation } = props;
  const { friendsStore } = useStores();
  const loaderArray = Array.from(Array(10).keys());

  async function getFriendList() {
    try {
      const response = await FriendService.list();
      if (response.ok) {
        const sorted = response.data.data.sort((a: any, b: any) =>
          a.username.localeCompare(b.username),
        );
        const items: any[] = [];
        let lastIndex = -1;
        for (const item of sorted) {
          const char = item.username.charAt(0).toUpperCase();
          if (lastIndex === -1 || items[lastIndex].title !== char) {
            lastIndex++;
            items.push({
              title: char,
              data: [
                {
                  id: item.id,
                  username: item.username,
                },
              ],
            });
          } else {
            items[lastIndex].data.push({
              id: item.id,
              username: item.username,
            });
          }
        }
        friendsStore.setFriends(items);
      } else if (isNetworkError(response.problem)) {
        friendsStore.setSnackbar('Please check your network connection before continue!');
      } else {
        friendsStore.setSnackbar('Unknown error occured');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      friendsStore.setSnackbar('Unknown error occured');
    }
  }

  async function refreshFriends() {
    friendsStore.setRefreshing(true);
    friendsStore.setFriends([]);
    await getFriendList();
    friendsStore.setRefreshing(false);
  }

  async function removeFriend(id: string): Promise<boolean> {
    try {
      const response = await FriendService.remove(id);
      if (response.ok) {
        return true;
      } else if (response.data.status === 404) {
        friendsStore.setSnackbar('This friend not found!');
        return false;
      }
      if (isNetworkError(response.problem)) {
        friendsStore.setSnackbar('Please check your network connection before continue!');
      } else {
        friendsStore.setSnackbar('Unknown error occured');
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      friendsStore.setSnackbar('Unknown error occured');
      return false;
    }
  }

  function getDialogContent() {
    if (
      friendsStore.dialog.status === FriendRemoveStatus.ASK_CONFIRMATION ||
      friendsStore.dialog.status === FriendRemoveStatus.REMOVING
    ) {
      return 'Confirm to Remove Friend?';
    } else if (friendsStore.dialog.status === FriendRemoveStatus.REMOVED) {
      return 'Friend Removed!';
    }
    return '';
  }

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        friendsStore.setIsLoading(true);
        await getFriendList();
        friendsStore.setIsLoading(false);
        friendsStore.setFirstLoaded(true);
      })();
      return () => {};
    }, []),
  );

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('blur', async () => {
  //     friendsStore.reset();
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  return (
    <>
      <View style={styles.container}>
        {friendsStore.isLoading ? (
          <View
            style={{
              width: '100%',
              flex: 1,
            }}>
            {loaderArray.map((value) => (
              <View key={value}>
                <LoaderItem />
                <Divider />
              </View>
            ))}
          </View>
        ) : (
          <SectionList
            sections={friendsStore.friendList.slice()}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                }}>
                <CustomAvatar label={item.username} size={50} />
                <Text style={styles.usernameItem}>{item.username}</Text>
                <CustomMenu id={item.id} username={item.username} />
              </View>
            )}
            renderSectionHeader={({ section }) => (
              <View
                style={{
                  flexDirection: 'column',
                  width: '100%',
                }}>
                <Text style={styles.usernameTitle}>{section.title}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <Divider />}
            stickySectionHeadersEnabled
            style={styles.section}
            refreshControl={
              <CustomRefreshControl
                refreshing={friendsStore.refreshing}
                onRefresh={refreshFriends}
              />
            }
            ListEmptyComponent={
              !friendsStore.isFirstLoaded || friendsStore.refreshing ? (
                <View
                  style={{
                    width: '100%',
                    flex: 1,
                  }}>
                  {loaderArray.map((value) => (
                    <View key={value}>
                      <LoaderItem />
                      <Divider />
                    </View>
                  ))}
                </View>
              ) : (
                <View
                  style={{
                    height: Dimensions.get('screen').height / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      opacity: 0.5,
                    }}>
                    You don't have friends...
                  </Text>
                </View>
              )
            }
          />
        )}
        <Portal>
          <Snackbar
            visible={!(!friendsStore.snackbar || friendsStore.snackbar === '')}
            onDismiss={() => friendsStore.setSnackbar('')}
            action={{
              label: 'Ok',
            }}
            theme={{ colors: { inversePrimary: COLOR.PRIMARY } }}>
            {friendsStore.snackbar}
          </Snackbar>
          <Dialog
            visible={friendsStore.dialog.visible}
            onDismiss={() => {
              friendsStore.setDialogVisible(false);
              setTimeout(() => {
                friendsStore.setDialog('', '', FriendRemoveStatus.NOT_REMOVING);
              }, 200);
            }}
            dismissable={false}
            dismissableBackButton={false}
            theme={{
              colors: {
                elevation: {
                  level3: 'white',
                },
              },
            }}>
            <Dialog.Content
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CustomAvatar size={50} label={friendsStore.dialog.username} />
              <Text
                style={{
                  fontWeight: 'bold',
                  marginTop: 10,
                  fontSize: 18,
                }}>
                {friendsStore.dialog.username}
              </Text>
              <Text
                style={{
                  marginTop: 20,
                  marginHorizontal: 40,
                  color: COLOR.PRIMARY,
                  fontSize: 25,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                {getDialogContent()}
              </Text>
            </Dialog.Content>
            {friendsStore.dialog.status === FriendRemoveStatus.ASK_CONFIRMATION ||
            friendsStore.dialog.status === FriendRemoveStatus.REMOVING ? (
              <Dialog.Actions
                style={{
                  justifyContent: 'space-evenly',
                }}>
                <Button
                  mode='outlined'
                  textColor='black'
                  style={styles.button}
                  onPress={() => {
                    friendsStore.setDialogVisible(false);
                    setTimeout(() => {
                      friendsStore.setDialog('', '', FriendRemoveStatus.NOT_REMOVING);
                    }, 200);
                  }}>
                  Cancel
                </Button>
                <Button
                  mode='contained'
                  buttonColor={COLOR.RED}
                  textColor='white'
                  style={styles.button}
                  onPress={async () => {
                    friendsStore.setDialog(
                      friendsStore.dialog.id,
                      friendsStore.dialog.username,
                      FriendRemoveStatus.REMOVING,
                    );
                    const isSucceed = await removeFriend(friendsStore.dialog.id);
                    if (isSucceed) {
                      friendsStore.setDialog(
                        friendsStore.dialog.id,
                        friendsStore.dialog.username,
                        FriendRemoveStatus.REMOVED,
                      );
                    }
                    setTimeout(
                      async () => {
                        friendsStore.setDialogVisible(false);
                        setTimeout(() => {
                          friendsStore.setDialog('', '', FriendRemoveStatus.NOT_REMOVING);
                        }, 200);
                        refreshFriends();
                      },
                      isSucceed ? 2000 : 0,
                    );
                  }}
                  loading={friendsStore.dialog.status === FriendRemoveStatus.REMOVING}>
                  Confirm
                </Button>
              </Dialog.Actions>
            ) : (
              <View
                style={{
                  marginTop: -30,
                  marginBottom: 30,
                }}>
                <Dialog.Icon size={45} color='red' icon='check-circle' />
              </View>
            )}
          </Dialog>
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
  usernameItem: {
    padding: 15,
    marginVertical: 15,
    fontSize: 16,
    fontWeight: 'bold',
    width: '75%',
  },
  usernameTitle: {
    backgroundColor: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    elevation: 4,
    margin: 10,
    marginBottom: 0,
    borderRadius: 10,
  },
  button: {
    width: 100,
    height: 40,
  },
});
