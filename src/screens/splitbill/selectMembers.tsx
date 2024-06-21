import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import { StyleSheet, Text, View, SectionList, Dimensions } from 'react-native';
import { Button, Divider, IconButton, Portal, Searchbar, Snackbar } from 'react-native-paper';
import { CustomAvatar } from 'src/components/customAvatar';
import { CustomRefreshControl } from 'src/components/customRefreshControl';
import { useStores } from 'src/models';
import { SelectMemberStoreModel } from 'src/models/splitBill/selectMemberStore';
import { SplitBillNavigatorParamList } from 'src/navigations/splitBillNavigator';
import * as FriendService from 'src/services/friendService';
import { COLOR } from 'src/theme';
import { isNetworkError } from 'src/utils/apiUtils';

interface ISelectMembersProps {
  navigation: StackNavigationProp<SplitBillNavigatorParamList>;
}

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

export const SelectMembersScreen: React.FC<ISelectMembersProps> = observer(
  function SelectMemberscreen(props) {
    const { navigation } = props;
    const { billStore } = useStores();
    const selectMembersStore = useLocalObservable(() =>
      SelectMemberStoreModel.create({
        friendList: [],
        searchResultList: [],
        search: '',
        refreshing: false,
        isLoading: false,
        snackbar: '',
      }),
    );
    const loaderArray = Array.from(Array(10).keys());

    async function getFriendList() {
      try {
        const response = await FriendService.list();
        if (response.ok) {
          const sorted = response.data.data.sort((a: any, b: any) =>
            a.username.localeCompare(b.username),
          );
          const items: any[] = [];
          for (const item of sorted) {
            items.push({
              id: item.id,
              username: item.username,
            });
          }
          selectMembersStore.setFriends(items);
        } else if (isNetworkError(response.problem)) {
          selectMembersStore.setSnackbar('Please check your network connection before continue!');
        } else {
          selectMembersStore.setSnackbar('Unknown error occured');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: any) {
        selectMembersStore.setSnackbar('Unknown error occured');
      }
    }

    async function refreshFriends(manualRefresh?: boolean) {
      if (manualRefresh) {
        selectMembersStore.setRefreshing(true);
      } else {
        selectMembersStore.setIsLoading(true);
      }
      selectMembersStore.setFriends([]);
      await getFriendList();
      if (manualRefresh) {
        selectMembersStore.setRefreshing(false);
      } else {
        selectMembersStore.setIsLoading(false);
      }
    }

    useFocusEffect(
      React.useCallback(() => {
        (async () => {
          refreshFriends();
        })();
        return () => {};
      }, []),
    );

    const friendsData: any = [];

    if (billStore.members.length > 0) {
      friendsData.push({
        title: 'Members',
        data: billStore.members,
      });
    }
    const selectedMembersIdList = billStore.members.map((value) => value.id);
    friendsData.push({
      title: 'Add More',
      data: selectMembersStore.friendList.filter(
        (value) => !selectedMembersIdList.includes(value.id),
      ),
    });
    return (
      <>
        <View style={styles.container}>
          <Searchbar
            value={selectMembersStore.search}
            mode='view'
            onChangeText={(value) => {
              selectMembersStore.setSearch(value);
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
          {selectMembersStore.isLoading ? (
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
              sections={friendsData}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                  }}>
                  <CustomAvatar label={item.username} size={50} />
                  <Text style={styles.usernameItem}>{item.username}</Text>
                  {!selectedMembersIdList.includes(item.id) ? (
                    <IconButton
                      icon='account-plus-outline'
                      iconColor={COLOR.PRIMARY}
                      onPress={() => {
                        billStore.addMembers(item.id, item.username);
                      }}
                    />
                  ) : (
                    <IconButton
                      icon='account-minus-outline'
                      iconColor='red'
                      onPress={() => {
                        billStore.removeMembers(item.id);
                      }}
                    />
                  )}
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
              renderSectionFooter={({ section }) => {
                return (
                  <View
                    style={{
                      height: section.title === friendsData.at(-1).title ? 35 : 0,
                    }}
                  />
                );
              }}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <Divider />}
              stickySectionHeadersEnabled
              style={styles.section}
              refreshControl={
                <CustomRefreshControl
                  refreshing={selectMembersStore.refreshing}
                  onRefresh={() => refreshFriends(true)}
                />
              }
              ListEmptyComponent={
                selectMembersStore.refreshing ? (
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
          <Button
            mode='contained'
            buttonColor={COLOR.PRIMARY}
            style={{
              width: '90%',
              marginBottom: 20,
            }}
            onPress={() => navigation.navigate('SplitBill')}>
            Confirm Members
          </Button>
          <Portal>
            <Snackbar
              visible={!(!selectMembersStore.snackbar || selectMembersStore.snackbar === '')}
              onDismiss={() => selectMembersStore.setSnackbar('')}
              action={{
                label: 'Ok',
              }}
              theme={{ colors: { inversePrimary: COLOR.PRIMARY } }}>
              {selectMembersStore.snackbar}
            </Snackbar>
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
    marginHorizontal: 10,
    borderRadius: 10,
  },
});
