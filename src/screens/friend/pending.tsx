import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import React from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import { Dimensions, SectionList, StyleSheet, Text, View } from 'react-native';
import { Button, Divider, Portal, Snackbar } from 'react-native-paper';
import { CustomAvatar } from 'src/components/customAvatar';
import { CustomRefreshControl } from 'src/components/customRefreshControl';
import { PendingButtonStatus } from 'src/constants/misc';
import { useStores } from 'src/models';
import * as FriendService from 'src/services/friendService';
import { COLOR } from 'src/theme';
import { isNetworkError } from 'src/utils/apiUtils';

interface IPendingProps {}

interface ILoaderProps {}

interface ICustomButtonProps {
  item: any;
}

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

export const PendingScreen: React.FC<IPendingProps> = observer(function PendingScreen(props) {
  const { pendingStore } = useStores();
  const loaderArray = Array.from(Array(10).keys());

  async function getPendingList() {
    try {
      const response = await FriendService.pending();
      if (response.ok) {
        const outgoingData = response.data.data
          .filter((value: any) => value.status === 0)
          .sort((a: any, b: any) => a.username.localeCompare(b.username))
          .map((value: any) => {
            return {
              id: value.id,
              username: value.username,
              status: value.status,
              buttonStatus: '0',
            };
          });
        const incomingData = response.data.data
          .filter((value: any) => value.status === 1)
          .sort((a: any, b: any) => a.username.localeCompare(b.username))
          .map((value: any) => {
            return {
              id: value.id,
              username: value.username,
              status: value.status,
              buttonStatus: '0',
            };
          });

        const pendingData = [];
        if (incomingData.length > 0) {
          pendingData.push({
            title: 'Incoming Friend Request',
            data: incomingData,
          });
        }
        if (outgoingData.length > 0) {
          pendingData.push({
            title: 'Outgoing Friend Request',
            data: outgoingData,
          });
        }
        pendingStore.setPending(pendingData);
      } else if (isNetworkError(response.problem)) {
        pendingStore.setSnackbar('Please check your network connection before continue!');
      } else {
        pendingStore.setSnackbar('Unknown error occured');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      pendingStore.setSnackbar('Unknown error occured');
    }
  }

  async function cancelFriendRequest(id: string) {
    try {
      const response = await FriendService.cancel(id);
      pendingStore.setButtonStatus(id, PendingButtonStatus.DONE);
      if (response.ok) {
        pendingStore.setSnackbar('Successfully cancelled a friend request!');
      } else if (response.data.status === 404) {
        pendingStore.setSnackbar('This friend request not found!');
      } else if (isNetworkError(response.problem)) {
        pendingStore.setSnackbar('Please check your network connection before continue!');
      } else {
        pendingStore.setSnackbar('Unknown error occured');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      pendingStore.setButtonStatus(id, PendingButtonStatus.DONE);
      pendingStore.setSnackbar('Unknown error occured');
    }
  }

  async function acceptFriendRequest(id: string) {
    try {
      const response = await FriendService.accept(id);
      pendingStore.setButtonStatus(id, PendingButtonStatus.DONE);
      if (response.ok) {
        pendingStore.setSnackbar('Successfully accepted a friend request!');
      } else if (response.data.status === 404) {
        pendingStore.setSnackbar('This friend request not found!');
      } else if (response.data.status === 409) {
        pendingStore.setSnackbar('This friend request already accepted!');
      } else if (isNetworkError(response.problem)) {
        pendingStore.setSnackbar('Please check your network connection before continue!');
      } else {
        pendingStore.setSnackbar('Unknown error occured');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      pendingStore.setButtonStatus(id, PendingButtonStatus.DONE);
      pendingStore.setSnackbar('Unknown error occured');
    }
  }

  async function rejectFriendRequest(id: string) {
    try {
      const response = await FriendService.reject(id);
      pendingStore.setButtonStatus(id, PendingButtonStatus.DONE);
      if (response.ok) {
        pendingStore.setSnackbar('Successfully rejected a friend request!');
      } else if (response.data.status === 404) {
        pendingStore.setSnackbar('This friend request not found!');
      } else if (isNetworkError(response.problem)) {
        pendingStore.setSnackbar('Please check your network connection before continue!');
      } else {
        pendingStore.setSnackbar('Unknown error occured');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      pendingStore.setButtonStatus(id, PendingButtonStatus.DONE);
      pendingStore.setSnackbar('Unknown error occured');
    }
  }

  async function refreshPending() {
    pendingStore.setRefreshing(true);
    pendingStore.setPending([]);
    await getPendingList();
    pendingStore.setRefreshing(false);
  }

  const CustomButton: React.FC<ICustomButtonProps> = observer(function CustomButton(props) {
    const { item } = props;
    return (
      <>
        {item.status === 0 ? (
          <Button
            onPress={async () => {
              pendingStore.setButtonStatus(item.id, PendingButtonStatus.CANCEL);
              await cancelFriendRequest(item.id);
              setTimeout(() => {
                refreshPending();
                pendingStore.setButtonStatus('', PendingButtonStatus.IDLE);
              }, 1000);
            }}
            buttonColor='grey'
            style={styles.button}
            mode='contained'
            loading={
              pendingStore.buttonStatus === PendingButtonStatus.CANCEL &&
              pendingStore.currentId === item.id
            }
            disabled={
              (pendingStore.buttonStatus !== PendingButtonStatus.IDLE &&
                pendingStore.buttonStatus !== PendingButtonStatus.CANCEL) ||
              (pendingStore.buttonStatus === PendingButtonStatus.CANCEL &&
                pendingStore.currentId !== item.id)
            }>
            Cancel
          </Button>
        ) : (
          <>
            <Button
              onPress={async () => {
                pendingStore.setButtonStatus(item.id, PendingButtonStatus.ACCEPT);
                await acceptFriendRequest(item.id);
                setTimeout(() => {
                  refreshPending();
                  pendingStore.setButtonStatus('', PendingButtonStatus.IDLE);
                }, 1000);
              }}
              buttonColor='green'
              style={styles.button}
              mode='contained'
              loading={
                pendingStore.buttonStatus === PendingButtonStatus.ACCEPT &&
                pendingStore.currentId === item.id
              }
              disabled={
                (pendingStore.buttonStatus !== PendingButtonStatus.IDLE &&
                  pendingStore.buttonStatus !== PendingButtonStatus.ACCEPT) ||
                (pendingStore.buttonStatus === PendingButtonStatus.ACCEPT &&
                  pendingStore.currentId !== item.id)
              }>
              Accept
            </Button>
            <Button
              onPress={async () => {
                pendingStore.setButtonStatus(item.id, PendingButtonStatus.REJECT);
                await rejectFriendRequest(item.id);
                setTimeout(() => {
                  refreshPending();
                  pendingStore.setButtonStatus('', PendingButtonStatus.IDLE);
                }, 1000);
              }}
              buttonColor='grey'
              style={styles.button}
              mode='contained'
              loading={
                pendingStore.buttonStatus === PendingButtonStatus.REJECT &&
                pendingStore.currentId === item.id
              }
              disabled={
                (pendingStore.buttonStatus !== PendingButtonStatus.IDLE &&
                  pendingStore.buttonStatus !== PendingButtonStatus.REJECT) ||
                (pendingStore.buttonStatus === PendingButtonStatus.REJECT &&
                  pendingStore.currentId !== item.id)
              }>
              Reject
            </Button>
          </>
        )}
      </>
    );
  });

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        pendingStore.setIsLoading(true);
        await getPendingList();
        pendingStore.setIsLoading(false);
        pendingStore.setFirstLoaded(true);
      })();
      return () => {};
    }, []),
  );

  return (
    <>
      <View style={styles.container}>
        {pendingStore.isLoading ? (
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
            sections={pendingStore.pendingList.slice()}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                }}>
                <CustomAvatar label={item.username} size={50} />
                <View
                  style={{
                    width: '100%',
                    padding: 15,
                  }}>
                  <Text style={styles.usernameItem}>{item.username}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <CustomButton item={item} />
                  </View>
                </View>
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
                refreshing={pendingStore.refreshing}
                onRefresh={refreshPending}
              />
            }
            ListEmptyComponent={
              !pendingStore.isFirstLoaded || pendingStore.refreshing ? (
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
                    You don't have any pending friends...
                  </Text>
                </View>
              )
            }
          />
        )}
        <Portal>
          <Snackbar
            visible={!(!pendingStore.snackbar || pendingStore.snackbar === '')}
            onDismiss={() => pendingStore.setSnackbar('')}
            action={{
              label: 'Ok',
            }}
            theme={{ colors: { inversePrimary: COLOR.PRIMARY } }}>
            {pendingStore.snackbar}
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
  usernameItem: {
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
    marginTop: 5,
    marginRight: 10,
    width: 100,
    height: 40,
  },
});
