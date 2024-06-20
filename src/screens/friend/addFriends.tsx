import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { debounce } from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Dialog, Divider, Portal, Searchbar, Snackbar } from 'react-native-paper';
import { CustomAvatar } from 'src/components/customAvatar';
import { CustomRefreshControl } from 'src/components/customRefreshControl';
import { FriendRequestStatus } from 'src/constants/misc';
import { useStores } from 'src/models';
import * as FriendService from 'src/services/friendService';
import { COLOR } from 'src/theme';
import { isNetworkError } from 'src/utils/apiUtils';

interface IAddFriendsProps {}

interface ILoaderProps {}

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

export const AddFriendsScreen: React.FC<IAddFriendsProps> = observer(
  function AddFriendsScreen(props) {
    const { addFriendsStore } = useStores();
    const loaderArray = Array.from(Array(10).keys());
    const searchDebounce = useCallback(
      debounce(async () => {
        if (addFriendsStore.pastSearch === addFriendsStore.search) return;
        refreshSearchResult();
      }, 1000),
      [],
    );

    async function getSearchResult() {
      if (addFriendsStore.search === '') {
        addFriendsStore.setPastSearch(addFriendsStore.search);
        return;
      }
      try {
        const response = await FriendService.search(addFriendsStore.search);
        if (response.ok) {
          addFriendsStore.setSearchResultList(response.data.data);
          addFriendsStore.setPastSearch(addFriendsStore.search);
        } else if (isNetworkError(response.problem)) {
          addFriendsStore.setSnackbar('Please check your network connection before continue!');
        } else {
          addFriendsStore.setSnackbar('Unknown error occured');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: any) {
        addFriendsStore.setSnackbar('Unknown error occured');
      }
    }

    async function requestFriend(id: string): Promise<boolean> {
      try {
        const response = await FriendService.requestFriend(id);
        if (response.ok) {
          return true;
        }
        if (response.data.status === 409) {
          addFriendsStore.setSnackbar('This friend is already requested!');
        } else if (isNetworkError(response.problem)) {
          addFriendsStore.setSnackbar('Please check your network connection before continue!');
        } else {
          addFriendsStore.setSnackbar('Unknown error occured');
        }
        return false;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: any) {
        addFriendsStore.setSnackbar('Unknown error occured');
        return false;
      }
    }

    async function refreshSearchResult(manualRefresh?: boolean) {
      if (manualRefresh) {
        addFriendsStore.setRefreshing(true);
      } else {
        addFriendsStore.setIsLoading(true);
      }
      addFriendsStore.setSearchResultList([]);
      await getSearchResult();
      if (manualRefresh) {
        addFriendsStore.setRefreshing(false);
      } else {
        addFriendsStore.setIsLoading(false);
      }
    }

    function getDialogContent() {
      if (
        addFriendsStore.dialog.status === FriendRequestStatus.ASK_CONFIRMATION ||
        addFriendsStore.dialog.status === FriendRequestStatus.REQUESTING
      ) {
        return 'Send Friend Request';
      } else if (addFriendsStore.dialog.status === FriendRequestStatus.REQUESTED) {
        return 'Friend Request Has Been Sent!';
      }
      return '';
    }

    useFocusEffect(
      React.useCallback(() => {
        (async () => {
          refreshSearchResult();
        })();
        return () => {};
      }, []),
    );

    return (
      <>
        <View style={styles.container}>
          <Searchbar
            value={addFriendsStore.search}
            mode='view'
            onChangeText={(value) => {
              addFriendsStore.setSearch(value);
              searchDebounce();
            }}
            placeholder='Type your friend username...'
            elevation={3}
            autoCapitalize='none'
            theme={{
              colors: {
                primary: COLOR.PRIMARY,
                outline: COLOR.PRIMARY,
                elevation: {
                  level3: COLOR.GREY_2,
                },
              },
            }}
          />
          {addFriendsStore.isLoading ? (
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
            <FlatList
              style={styles.section}
              data={addFriendsStore.searchResultList.slice()}
              renderItem={({ item }) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                    }}>
                    <CustomAvatar label={item.username} size={50} />
                    <Text style={styles.usernameItem}>{item.username}</Text>
                    <Button
                      mode='contained'
                      buttonColor={COLOR.PRIMARY}
                      onPress={() => {
                        addFriendsStore.setDialog(
                          item.id,
                          item.username,
                          FriendRequestStatus.ASK_CONFIRMATION,
                          true,
                        );
                      }}
                      icon='account-plus'
                      style={{
                        marginLeft: -50,
                      }}>
                      Add
                    </Button>
                  </View>
                );
              }}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <Divider />}
              refreshControl={
                <CustomRefreshControl
                  refreshing={addFriendsStore.refreshing}
                  onRefresh={() => refreshSearchResult(true)}
                />
              }
              ListEmptyComponent={
                addFriendsStore.refreshing ? (
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
                      {addFriendsStore.pastSearch === ''
                        ? 'Search friends by typing in search bar...'
                        : 'Friends not found...'}
                    </Text>
                  </View>
                )
              }
            />
          )}
          <Portal>
            <Snackbar
              visible={!(!addFriendsStore.snackbar || addFriendsStore.snackbar === '')}
              onDismiss={() => addFriendsStore.setSnackbar('')}
              action={{
                label: 'Ok',
              }}
              theme={{ colors: { inversePrimary: COLOR.PRIMARY } }}>
              {addFriendsStore.snackbar}
            </Snackbar>
            <Dialog
              visible={addFriendsStore.dialog.visible}
              onDismiss={() => {
                addFriendsStore.setDialogVisible(false);
                setTimeout(() => {
                  addFriendsStore.setDialog('', '', FriendRequestStatus.NOT_REQUESTING);
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
                <CustomAvatar size={50} label={addFriendsStore.dialog.username} />
                <Text
                  style={{
                    fontWeight: 'bold',
                    marginTop: 10,
                    fontSize: 18,
                  }}>
                  {addFriendsStore.dialog.username}
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
              {addFriendsStore.dialog.status === FriendRequestStatus.ASK_CONFIRMATION ||
              addFriendsStore.dialog.status === FriendRequestStatus.REQUESTING ? (
                <Dialog.Actions
                  style={{
                    justifyContent: 'space-evenly',
                  }}>
                  <Button
                    mode='outlined'
                    textColor='black'
                    style={styles.button}
                    onPress={() => {
                      addFriendsStore.setDialogVisible(false);
                      setTimeout(() => {
                        addFriendsStore.setDialog('', '', FriendRequestStatus.NOT_REQUESTING);
                      }, 200);
                    }}>
                    Cancel
                  </Button>
                  <Button
                    mode='contained'
                    buttonColor={COLOR.PRIMARY}
                    textColor='white'
                    style={styles.button}
                    onPress={async () => {
                      addFriendsStore.setDialog(
                        addFriendsStore.dialog.id,
                        addFriendsStore.dialog.username,
                        FriendRequestStatus.REQUESTING,
                      );
                      const isSucceed = await requestFriend(addFriendsStore.dialog.id);
                      if (isSucceed) {
                        addFriendsStore.setDialog(
                          addFriendsStore.dialog.id,
                          addFriendsStore.dialog.username,
                          FriendRequestStatus.REQUESTED,
                        );
                      }
                      setTimeout(
                        async () => {
                          addFriendsStore.setDialogVisible(false);
                          setTimeout(() => {
                            addFriendsStore.setDialog('', '', FriendRequestStatus.NOT_REQUESTING);
                          }, 200);
                          refreshSearchResult();
                        },
                        isSucceed ? 2000 : 0,
                      );
                    }}
                    loading={addFriendsStore.dialog.status === FriendRequestStatus.REQUESTING}>
                    Send
                  </Button>
                </Dialog.Actions>
              ) : (
                <View
                  style={{
                    marginTop: -30,
                    marginBottom: 30,
                  }}>
                  <Dialog.Icon size={45} color={COLOR.PRIMARY} icon='check-circle' />
                </View>
              )}
            </Dialog>
          </Portal>
          <StatusBar style='auto' />
        </View>
      </>
    );
  },
);

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
  button: {
    width: 100,
    height: 40,
  },
});
